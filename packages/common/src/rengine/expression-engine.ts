import { Jexl } from 'jexl';
import { 
  parseISO, 
  isValid, 
  format, 
  add, 
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  startOfDay,
  isAfter,
  isBefore,
  type Duration
} from 'date-fns'

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
  async evaluate<T = any>(context: any): Promise<T> {
    try {
      console.log('context', context);
      console.log('expression', this.expression);
      return await this.eval(this.expression, context);
    } catch (error) {
      console.error(`Rule evaluation error: ${this.expression}`, error);
      throw error;
    }
  }



  /**
   * Setup date-related transforms
   */
  private setupDateTransforms(): void {
    // 使用 date-fns 优化日期处理
    this.addTransform('toDate', (value: any) => {
      if (value instanceof Date) return value;
      if (typeof value === 'string') {
        const date = parseISO(value);
        return isValid(date) ? date : null;
      }
      if (typeof value === 'number') {
        const date = new Date(value);
        return isValid(date) ? date : null;
      }
      return null;
    });

    this.addTransform('formatDate', (date: any, formatStr: string = 'yyyy-MM-dd') => {
      if (!(date instanceof Date) || !isValid(date)) return null;
      return format(date, formatStr);
    });

    this.addTransform('dateAdd', (date: any, amount: number, unit: string) => {
      if (!(date instanceof Date) || !isValid(date)) return null;
      
      const duration = { [unit.toLowerCase().replace(/s$/, '')]: amount };
      try {
        return add(date, duration as Duration);
      } catch {
        return null;
      }
    });

    this.addTransform('dateDiff', (date1: any, date2: any, unit: string = 'days') => {
      if (!(date1 instanceof Date) || !(date2 instanceof Date) || 
          !isValid(date1) || !isValid(date2)) {
        return null;
      }
      
      switch (unit.toLowerCase()) {
        case 'year':
        case 'years':
          return differenceInYears(date2, date1);
        case 'month':
        case 'months':
          return differenceInMonths(date2, date1);
        case 'day':
        case 'days':
          return differenceInDays(date2, date1);
        case 'hour':
        case 'hours':
          return differenceInHours(date2, date1);
        case 'minute':
        case 'minutes':
          return differenceInMinutes(date2, date1);
        case 'second':
        case 'seconds':
          return differenceInSeconds(date2, date1);
        default:
          return differenceInDays(date2, date1);
      }
    });

    this.addTransform('now', () => new Date());
    
    this.addTransform('today', () => startOfDay(new Date()));
    
    this.addTransform('isAfter', (date1: any, date2: any) => {
      if (!(date1 instanceof Date) || !(date2 instanceof Date) || 
          !isValid(date1) || !isValid(date2)) {
        return false;
      }
      return isAfter(date1, date2);
    });
    
    this.addTransform('isBefore', (date1: any, date2: any) => {
      if (!(date1 instanceof Date) || !(date2 instanceof Date) || 
          !isValid(date1) || !isValid(date2)) {
        return false;
      }
      return isBefore(date1, date2);
    });
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
      return regex.test(str);
    });
  }
}
