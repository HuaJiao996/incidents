import { Jexl } from 'jexl';

/**
 * Jexl Rule Engine Base Class
 * Provides core functionality for Jexl expression evaluation
 */
export class ExpressionEngine extends Jexl {
  constructor(private expression: string) {
    super();
    this.setupTransforms();
  }

  /**
   * Setup all built-in transforms
   */
  private setupTransforms() {
    this.setupDateTransforms();
    this.setupStringMatchers();
  }

  /**
   * Evaluate rule asynchronously
   */
  async evaluate(context: any): Promise<boolean> {
    try {
      console.log('context', context);
      console.log('expression', this.expression);
      return await this.eval(this.expression, context);
    } catch (error) {
      console.error(`Rule evaluation error: ${this.expression}`, error);
      return false;
    }
  }

  /**
   * Evaluate rule synchronously
   */
  evaluateSync(context: any): boolean {
    try {
      return this.evalSync(this.expression, context);
    } catch (error) {
      console.error(`Rule evaluation error: ${this.expression}`, error);
      return false;
    }
  }

  /**
   * Setup date-related transforms
   */
  private setupDateTransforms(): void {
    // Date formatting
    this.addTransform('date', (val: string | Date) => {
      return val instanceof Date ? val : new Date(val);
    });

    // Date comparison
    this.addTransform('after', (date1: string | Date, date2: string | Date) => {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return d1.getTime() > d2.getTime();
    });

    this.addTransform(
      'before',
      (date1: string | Date, date2: string | Date) => {
        const d1 = date1 instanceof Date ? date1 : new Date(date1);
        const d2 = date2 instanceof Date ? date2 : new Date(date2);
        return d1.getTime() < d2.getTime();
      },
    );
  }

  /**
   * Setup string-related transforms
   */
  private setupStringMatchers(): void {
    // String matching
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
      const res = regex.test(str);
      console.log('matches', str, pattern, res);
      return res;
    });
  }
}
