import { JexlRuleEngine } from './rule-engine-jexl';

// 定义规则事件类型
export interface RuleEvent {
  type: string;
  params: Record<string, any>;
}

interface Rule {
  id: string;
  engine: JexlRuleEngine;
  result: Record<string, any>;
  priority: number;
}

/**
 * 规则引擎适配器
 * 管理多个规则的注册和执行
 */
export class RuleEngineAdapter {
  private rules: Map<string, Rule> = new Map();
  public static readonly MATCHED = 'matched';
  
  /**
   * 添加规则
   * @param expression Jexl表达式
   * @param matchedResult 匹配结果
   * @param priority 优先级
   * @param type 事件类型
   */
  appendRule(
    expression: string,
    matchedResult: Record<string, any> = {},
    priority: number = 0,
    type: string = RuleEngineAdapter.MATCHED,
  ): this {
    const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    try {
      this.rules.set(ruleId, {
        id: ruleId,
        engine: new JexlRuleEngine(expression),
        result: { ...matchedResult, type },
        priority
      });
    } catch (error) {
      console.error('规则创建失败:', error);
    }
    
    return this;
  }
  
  /**
   * 异步执行所有规则
   * @param facts 事实数据
   */
  async run(facts: any): Promise<{ events: RuleEvent[] }> {
    const events: RuleEvent[] = [];
    const sortedRules = [...this.rules.values()]
      .sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      try {
        const matched = await rule.engine.evaluate(facts);
        if (matched) {
          events.push({
            type: rule.result.type || RuleEngineAdapter.MATCHED,
            params: { ...rule.result, ruleId: rule.id }
          });
        }
      } catch (error) {
        console.error(`规则执行错误 (${rule.id}):`, error);
      }
    }
    
    return { events };
  }
  
  /**
   * 同步执行所有规则
   * @param facts 事实数据
   */
  runSync(facts: any): { events: RuleEvent[] } {
    const events: RuleEvent[] = [];
    const sortedRules = [...this.rules.values()]
      .sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      try {
        const matched = rule.engine.evaluateSync(facts);
        if (matched) {
          events.push({
            type: rule.result.type || RuleEngineAdapter.MATCHED,
            params: { ...rule.result, ruleId: rule.id }
          });
        }
      } catch (error) {
        console.error(`规则执行错误 (${rule.id}):`, error);
      }
    }
    
    return { events };
  }
  
  /**
   * 清除所有规则
   */
  clearRules(): void {
    this.rules.clear();
  }
} 