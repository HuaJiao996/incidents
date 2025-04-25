import { Engine, TopLevelCondition } from 'json-rules-engine';
export { TopLevelCondition } from 'json-rules-engine';

export class RuleEngine extends Engine {
  public static Matched = 'matched';

  constructor(stopWhenMatchedFirst: boolean = true) {
    super();

    if (stopWhenMatchedFirst) {
      this.on(RuleEngine.Matched, () => {
        this.stop();
      });
    }
  }

  appendRule(
    conditions: TopLevelCondition,
    matchedResult: Record<string, any> = {},
    priority?: number,
    type: string = RuleEngine.Matched,
  ): this {
    super.addRule({
      conditions: conditions,
      event: {
        params: matchedResult,
        type,
      },
      priority: priority,
    });
    return this;
  }
}
