import { Jexl } from 'jexl';

/**
 * Jexl规则引擎基础类
 * 提供Jexl表达式评估的核心功能
 */
export class JexlRuleEngine extends Jexl {
  private expression: string;

  constructor(expression: string) {
    super();
    this.expression = expression;
    this.setupTransforms();
  }

  /**
   * 设置所有内置的转换器
   */
  private setupTransforms() {
    this.setupDateTransforms();
    this.setupStringMatchers();
  }

  /**
   * 添加自定义操作符
   */
  addTransform(operator: string, transform: (...args: any[]) => any): this {
    super.addTransform(operator, transform);
    return this;
  }

  /**
   * 异步执行规则评估
   */
  async evaluate(context: any): Promise<boolean> {
    try {
      return await this.eval(this.expression, context);
    } catch (error) {
      console.error(`规则执行错误: ${this.expression}`, error);
      return false;
    }
  }

  /**
   * 同步执行规则评估
   */
  evaluateSync(context: any): boolean {
    try {
      return this.evalSync(this.expression, context);
    } catch (error) {
      console.error(`规则执行错误: ${this.expression}`, error);
      return false;
    }
  }

  /**
   * 设置日期相关的转换器
   */
  private setupDateTransforms(): void {
    // 日期格式化
    this.addTransform('date', (val: string | Date) => {
      return val instanceof Date ? val : new Date(val);
    });
    
    // 日期比较
    this.addTransform('after', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() > d2.getTime();
    });
    
    this.addTransform('before', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() < d2.getTime();
    });
  }

  /**
   * 设置字符串相关的转换器
   */
  private setupStringMatchers(): void {
    // 字符串匹配
    this.addTransform('contains', (str: string, search: string) => {
      if (typeof str !== 'string' || typeof search !== 'string') return false;
      return str.includes(search);
    });
    
    this.addTransform('startsWith', (str: string, prefix: string) => {
      if (typeof str !== 'string' || typeof prefix !== 'string') return false;
      return str.startsWith(prefix);
    });
    
    this.addTransform('endsWith', (str: string, suffix: string) => {
      if (typeof str !== 'string' || typeof suffix !== 'string') return false;
      return str.endsWith(suffix);
    });
    
    this.addTransform('matches', (str: string, pattern: string) => {
      if (typeof str !== 'string' || typeof pattern !== 'string') return false;
      const regex = new RegExp(pattern);
      return regex.test(str);
    });
  }
} 