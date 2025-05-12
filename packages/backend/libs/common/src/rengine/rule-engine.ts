import { Logger } from '@nestjs/common';
import { ExpressionEngine } from './expression-engine';


interface Rule<T> {
  engine: ExpressionEngine;
  result: T;
  priority: number;
}

/**
 * Rule Engine Error Class
 */
export class RuleEngineError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RuleEngineError';
  }
}

/**
 * Rule Engine
 * Manages registration and execution of multiple rules
 */
export class RuleEngine<T = never> {
  private rules: Rule<T>[] = [];
  public static readonly MATCHED = 'matched';

  /**
   * Add a rule
   * @param expression Jexl expression
   * @param matchedResult Match result
   * @param priority Priority
   * @param type Event type
   * @throws RuleEngineError
   */
  appendRule(
    expression: string,
    matchedResult: T,
    priority: number = 0,
  ): void {
    if (!expression || typeof expression !== 'string') {
      throw new RuleEngineError('Expression cannot be empty', 'INVALID_EXPRESSION');
    }

    try {
      const engine = new ExpressionEngine(expression);
      this.rules.push({
        engine,
        result: matchedResult,
        priority
      });
    } catch (error) {
      throw new RuleEngineError(
        `Rule creation failed: ${error instanceof Error ? error.message : String(error)}`,
        'RULE_CREATION_FAILED'
      );
    }
  }

  /**
   * Execute rules asynchronously
   * @param facts Fact data
   */
  async run(facts: any): Promise<T | undefined> {
    const sortedRules = [...this.rules]
      .sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      const matched = await rule.engine.evaluate(facts);
      if (matched) {
        return rule.result;
      }
    }
  }
} 