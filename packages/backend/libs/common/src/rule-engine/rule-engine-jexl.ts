import { Jexl } from 'jexl';
import { Jexl as JexlEngine } from 'jexl';

/**
 * Jexl规则引擎基础类
 * 提供Jexl表达式评估的核心功能
 */
export class JexlRuleEngine {
  protected jexl: any;
  private expression: string;

  constructor(expression: string) {
    this.jexl = new Jexl();
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
    this.jexl.addTransform(operator, transform);
    return this;
  }

  /**
   * 异步执行规则评估
   */
  async evaluate(context: any): Promise<boolean> {
    try {
      return await this.jexl.eval(this.expression, context);
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
      return this.jexl.evalSync(this.expression, context);
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
    this.jexl.addTransform('date', (val: string | Date) => {
      return val instanceof Date ? val : new Date(val);
    });
    
    // 日期比较
    this.jexl.addTransform('after', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() > d2.getTime();
    });
    
    this.jexl.addTransform('before', (date1: string | Date, date2: string | Date) => {
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
    this.jexl.addTransform('contains', (str: string, search: string) => {
      if (typeof str !== 'string' || typeof search !== 'string') return false;
      return str.includes(search);
    });
    
    this.jexl.addTransform('startsWith', (str: string, prefix: string) => {
      if (typeof str !== 'string' || typeof prefix !== 'string') return false;
      return str.startsWith(prefix);
    });
    
    this.jexl.addTransform('endsWith', (str: string, suffix: string) => {
      if (typeof str !== 'string' || typeof suffix !== 'string') return false;
      return str.endsWith(suffix);
    });
    
    this.jexl.addTransform('matches', (str: string, pattern: string) => {
      if (typeof str !== 'string' || typeof pattern !== 'string') return false;
      const regex = new RegExp(pattern);
      return regex.test(str);
    });
  }

  /**
   * 创建用于日期比较的自定义转换函数
   */
  static setupDateTransforms(jexlInstance = new JexlEngine()) {
    const jx = jexlInstance;
    
    // 日期格式化转换
    jx.addTransform('date', (val: string | Date) => {
      return val instanceof Date ? val : new Date(val);
    });
    
    // 日期比较转换
    jx.addTransform('after', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() > d2.getTime();
    });
    
    jx.addTransform('before', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() < d2.getTime();
    });
    
    // 返回配置好的实例
    return jx;
  }

  /**
   * 创建一个字符串匹配器
   */
  static setupStringMatchers(jexlInstance = new JexlEngine()) {
    const jx = jexlInstance;
    
    // 添加字符串匹配转换
    jx.addTransform('contains', (str: string, search: string) => {
      if (typeof str !== 'string' || typeof search !== 'string') return false;
      return str.includes(search);
    });
    
    jx.addTransform('startsWith', (str: string, prefix: string) => {
      if (typeof str !== 'string' || typeof prefix !== 'string') return false;
      return str.startsWith(prefix);
    });
    
    jx.addTransform('endsWith', (str: string, suffix: string) => {
      if (typeof str !== 'string' || typeof suffix !== 'string') return false;
      return str.endsWith(suffix);
    });
    
    jx.addTransform('matches', (str: string, pattern: string) => {
      if (typeof str !== 'string' || typeof pattern !== 'string') return false;
      const regex = new RegExp(pattern);
      return regex.test(str);
    });
    
    // 返回配置好的实例
    return jx;
  }
} 