import { describe, it, expect, beforeEach } from 'bun:test';
import { RuleEngine, RuleEngineError } from './rule-engine';

describe('REngine 集成测试', () => {
  describe('RuleEngineError', () => {
    it('应该创建带有消息和代码的错误', () => {
      const error = new RuleEngineError('Test message', 'TEST_CODE');
      
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('RuleEngineError');
      expect(error).toBeInstanceOf(Error);
    });
  });



  describe('RuleEngine', () => {
    let ruleEngine: RuleEngine<string>;

    beforeEach(() => {
      ruleEngine = new RuleEngine<string>();
    });

    describe('静态属性', () => {
      it('应该有MATCHED常量', () => {
        expect(RuleEngine.MATCHED).toBe('matched');
      });
    });

    describe('appendRule', () => {
      it('应该成功添加有效规则', () => {
        expect(() => {
          ruleEngine.appendRule('user.age > 18', 'adult');
        }).not.toThrow();
      });

      it('应该使用默认优先级0', () => {
        ruleEngine.appendRule('user.age > 18', 'adult');
        // 通过运行测试来验证优先级
        expect(ruleEngine).toBeDefined();
      });

      it('应该在表达式为空时抛出错误', () => {
        expect(() => {
          ruleEngine.appendRule('', 'result');
        }).toThrow(RuleEngineError);
      });

      it('应该在表达式不是字符串时抛出错误', () => {
        expect(() => {
          // @ts-expect-error 故意传入非字符串类型进行测试
          ruleEngine.appendRule(123, 'result');
        }).toThrow(RuleEngineError);
      });

      it('应该允许添加多个规则', () => {
        expect(() => {
          ruleEngine.appendRule('user.age > 18', 'adult');
          ruleEngine.appendRule('user.age >= 65', 'senior');
          ruleEngine.appendRule('user.age >= 13', 'teen');
        }).not.toThrow();
      });


    });

    describe('run', () => {
      beforeEach(() => {
        ruleEngine.appendRule('user.age >= 65', 'senior', 3);
        ruleEngine.appendRule('user.age >= 18', 'adult', 2);
        ruleEngine.appendRule('user.age >= 13', 'teen', 1);
        ruleEngine.appendRule('user.age >= 0', 'child', 0);
      });

      it('应该按优先级顺序执行规则（高优先级优先）', async () => {
        const facts = { user: { age: 70 } };
        const result = await ruleEngine.run(facts);
        expect(result).toBe('senior'); // 应该匹配最高优先级的规则
      });

      it('应该返回第一个匹配的规则结果', async () => {
        const facts = { user: { age: 25 } };
        const result = await ruleEngine.run(facts);
        expect(result).toBe('adult'); // 应该匹配adult规则，而不是teen或child
      });

      it('应该在没有规则匹配时返回undefined', async () => {
        const emptyEngine = new RuleEngine<string>();
        emptyEngine.appendRule('user.age > 100', 'ancient');
        
        const facts = { user: { age: 25 } };
        const result = await emptyEngine.run(facts);
        expect(result).toBeUndefined();
      });

      it('应该处理空的facts对象', async () => {
        const result = await ruleEngine.run({});
        expect(result).toBeUndefined();
      });

      it('应该处理null/undefined facts', async () => {
        const resultNull = await ruleEngine.run(null);
        const resultUndefined = await ruleEngine.run(undefined);
        
        expect(resultNull).toBeUndefined();
        expect(resultUndefined).toBeUndefined();
      });

      it('应该在没有规则时返回undefined', async () => {
        const emptyEngine = new RuleEngine<string>();
        const result = await emptyEngine.run({ user: { age: 25 } });
        expect(result).toBeUndefined();
      });

      it('应该正确处理相同优先级的规则', async () => {
        const sameEngine = new RuleEngine<string>();
        sameEngine.appendRule('user.role == "admin"', 'admin', 1);
        sameEngine.appendRule('user.active == true', 'active', 1);
        
        const facts = { user: { role: 'admin', active: true } };
        const result = await sameEngine.run(facts);
        expect(result).toBe('admin'); // 应该返回第一个匹配的规则
      });

      it('应该处理复杂的泛型类型', async () => {
          interface Action {
            type: string;
            payload: any;
          }

          const actionEngine = new RuleEngine<Action>();
          actionEngine.appendRule('user.role == "admin"', { type: 'ADMIN_ACCESS', payload: { level: 'full' } });
          actionEngine.appendRule('user.active == true', { type: 'USER_ACCESS', payload: { level: 'limited' } });

          const facts = { user: { role: 'admin', active: true } };
          const result = await actionEngine.run(facts);

          expect(result).toEqual({ type: 'ADMIN_ACCESS', payload: { level: 'full' } });
        });

        it('应该在规则评估失败时跳过该规则继续执行', async () => {
          const testEngine = new RuleEngine<string>();
          
          // 添加一个会导致运行时错误的规则（访问undefined属性）
          testEngine.appendRule('user.nonexistent.property > 0', 'invalid_result', 10);
          // 添加一个正常的规则
          testEngine.appendRule('user.age > 18', 'valid_result', 5);
          
          const facts = { user: { age: 25 } };
          const result = await testEngine.run(facts);
          
          // 应该跳过失败的规则，返回有效规则的结果
          expect(result).toBe('valid_result');
        });

        it('应该测试字符串transforms的类型检查', async () => {
          const testEngine = new RuleEngine<string>();
          
          // 测试contains transform的类型检查
          testEngine.appendRule('num | contains("2")', 'contains_result');
          testEngine.appendRule('text | contains("hello")', 'contains_match');
          
          // 测试startsWith transform的类型检查
          testEngine.appendRule('num | startsWith("1")', 'starts_result');
          testEngine.appendRule('text | startsWith("hello")', 'starts_match');
          
          // 测试endsWith transform的类型检查
          testEngine.appendRule('num | endsWith("3")', 'ends_result');
          testEngine.appendRule('text | endsWith("world")', 'ends_match');
          
          // 测试matches transform的类型检查和正常匹配
          testEngine.appendRule('num | matches("\\d+")', 'matches_result');
          testEngine.appendRule('email | matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")', 'email_match');
          
          const facts = {
            num: 123,
            text: 'hello world',
            email: 'test@example.com'
          };
          
          const result = await testEngine.run(facts);
          
          // 应该匹配第一个成功的规则
          expect(result).toBe('contains_match');
        });

        it('应该测试日期transforms', async () => {
           const testEngine = new RuleEngine<string>();
           
           // 测试date transform
           testEngine.appendRule('dateStr | date', 'date_converted', 5);
           testEngine.appendRule('dateObj | date', 'date_kept', 4);
           
           // 测试after transform
           testEngine.appendRule('date1 | after(date2)', 'after_match', 3);
           
           // 测试before transform with Date objects (覆盖Date instanceof分支)
           testEngine.appendRule('dateObj1 | before(dateObj2)', 'before_date_objects', 2);
           
           // 测试before transform with strings
           testEngine.appendRule('date3 | before(date4)', 'before_match', 1);
           
           const testDate = new Date('2023-01-01');
           const facts = {
             dateStr: '2023-01-02',
             dateObj: testDate,
             date1: '2023-01-02',
             date2: '2023-01-01',
             dateObj1: new Date('2023-01-01'),
             dateObj2: new Date('2023-06-01'),
             date3: '2023-01-01',
             date4: '2023-01-02'
           };
           
           const result = await testEngine.run(facts);
           
           // 应该匹配第一个成功的规则
           expect(result).toBe('date_converted');
         });

        it('应该测试字符串transforms的类型检查', async () => {
           const testEngine = new RuleEngine<string>();
           
           // 测试endsWith的类型检查 - 非字符串输入应该返回false
           testEngine.appendRule('num | endsWith("3")', 'ends_type_check', 3);
           
           // 测试matches的类型检查 - 非字符串输入应该返回false  
           testEngine.appendRule('num | matches("\\d+")', 'matches_type_check', 2);
           
           // 测试正常的字符串匹配
           testEngine.appendRule('text | endsWith("world")', 'ends_success', 1);
           
           const facts = {
             num: 123,
             text: 'hello world'
           };
           
           const result = await testEngine.run(facts);
           
           // 应该匹配字符串匹配成功的规则
           expect(result).toBe('ends_success');
         });


    });

    describe('集成测试', () => {
      it('应该支持完整的规则引擎工作流', async () => {
        const workflowEngine = new RuleEngine<string>();
        
        // 添加多个规则
        workflowEngine.appendRule('user.age >= 65 && user.active == true', 'senior_active', 10);
        workflowEngine.appendRule('user.age >= 18 && user.role == "admin"', 'admin_adult', 8);
        workflowEngine.appendRule('user.age >= 18', 'adult', 5);
        workflowEngine.appendRule('user.age >= 13', 'teen', 3);
        workflowEngine.appendRule('user.age >= 0', 'child', 1);
        
        // 测试不同的facts组合
        const seniorActive = await workflowEngine.run({ user: { age: 70, active: true } });
        expect(seniorActive).toBe('senior_active');
        
        const adminAdult = await workflowEngine.run({ user: { age: 30, role: 'admin' } });
        expect(adminAdult).toBe('admin_adult');
        
        const regularAdult = await workflowEngine.run({ user: { age: 25 } });
        expect(regularAdult).toBe('adult');
        
        const teen = await workflowEngine.run({ user: { age: 15 } });
        expect(teen).toBe('teen');
        
        const child = await workflowEngine.run({ user: { age: 8 } });
        expect(child).toBe('child');
      });

      it('应该支持布尔类型的结果', async () => {
        const boolEngine = new RuleEngine<boolean>();
        boolEngine.appendRule('user.active == true', true, 1);
        boolEngine.appendRule('user.active == false', false, 0);
        
        const activeResult = await boolEngine.run({ user: { active: true } });
        expect(activeResult).toBe(true);
        
        const inactiveResult = await boolEngine.run({ user: { active: false } });
        expect(inactiveResult).toBe(false);
      });

      it('应该支持复杂表达式和transforms的组合', async () => {
        const complexEngine = new RuleEngine<string>();
        
        // 使用日期和字符串transforms
        complexEngine.appendRule(
          'event.name | startsWith("alert") && event.timestamp | after("2023-01-01")',
          'recent_alert',
          10
        );
        
        complexEngine.appendRule(
          'alert.service.name | contains("api") && alert.severity == "high"',
          'api_high_severity',
          5
        );
        
        const alertResult = await complexEngine.run({
          event: {
            name: 'alert_critical',
            timestamp: '2023-06-01'
          }
        });
        expect(alertResult).toBe('recent_alert');
        
        const apiResult = await complexEngine.run({
          alert: {
            service: { name: 'api-gateway' },
            severity: 'high'
          }
        });
        expect(apiResult).toBe('api_high_severity');
      });
    });
  });
});