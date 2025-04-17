import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from '../incident/incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Processor('alert')
export class AlertProcessor extends WorkerHost {
    private readonly logger = new Logger(AlertProcessor.name);
    constructor(private readonly incidentService: IncidentService, private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job<string>, token?: string) {
        this.logger.log(job.data);
        const alert = await this.databaseService.getClient().query.alert.findFirst({
            where: (alert, { eq }) => eq(alert.id, job.data),
            with: {
                service: {
                    with: {
                        incidentTypes: {
                            with: {
                                statusConditions: true
                            }
                        }
                    }
                }
            }
        });
        this.logger.log(alert);
        // if (!alert) {
        //     throw new Error('Alert not found');
        // }

        // const engine = new Engine;
        // alert.service!.incidentTypes.forEach((incidentType) => {
        //     engine.addRule({
        //         conditions: incidentType.condition as TopLevelCondition,
        //         event: { type: 'matched', params: { incidentType } },
        //         priority: incidentType.order,
        //     })
        // })
        // engine.on('matched', () => {
        //     engine.stop();
        // })

        // const incidentType = await engine.run(alert).then(({ events }) => events[0]?.params?.incidentType as (Exclude<(typeof alert.service), null>)['incidentTypes'][number]);

        // let status = alert.type
        // if (!status) {
        //     const engine2 = new Engine;
        //     incidentType.statusConditions.forEach((statusCondion) => {
        //         engine.addRule({
        //             conditions: statusCondion.condition as TopLevelCondition,
        //             event: { type: 'matched', params: { status: statusCondion.status } },
        //             priority: statusCondion.order,
        //         })
        //     })
        //     engine2.on('matched', () => {
        //         engine.stop();
        //     })
        //     status = await engine2.run(alert).then(({ events }) => events[0]?.params?.status as "trigger" | "resolve");
        // }

        // this.logger.log(status);
        









    }

}
