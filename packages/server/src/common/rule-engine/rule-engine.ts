import { Engine, EngineResult, RunOptions, TopLevelCondition } from "json-rules-engine";
import { tryit } from "radash";


export class RuleEngine extends Engine {

    public static Matched = 'matched';

    constructor(stopWhenMatchedFirst: boolean = true) {
        super();

        if (stopWhenMatchedFirst) {
            this.on(RuleEngine.Matched, () => {
                this.stop();
            })
        }
        
    }

    appendRule(conditions: TopLevelCondition, matchedResule: Record<string, any> = {} ,  priority?: number, type: string = RuleEngine.Matched ): this {
        super.addRule({
            conditions: conditions,
            event: {
                params: matchedResule,
                type,
            },
            priority: priority,
        });
        return this;
    }

}