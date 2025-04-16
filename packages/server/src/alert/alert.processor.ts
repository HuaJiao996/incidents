import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from '../incident/incident.service';
import { dbClient } from 'src/database/database.client';
import { Engine, TopLevelCondition } from 'json-rules-engine';
import { IncidentType } from '../database/schema';

@Processor('alert')
export class AlertProcessor extends WorkerHost {
    constructor(private readonly incidentService: IncidentService) {
        super();
    }
    async process(job: Job<string>, token?: string) {
        const alert = await dbClient.query.alert.findFirst({
            where: (alert, { eq }) => eq(alert.id, job.data),
            with: {
                service: {
                    with: {
                        incidentTypes: true
                    }
                }
            }
        });

        if (!alert) {
            throw new Error('Alert not found');
        }

        const engine = new Engine;
        alert.service!.incidentTypes.forEach((incidentType) => {
            engine.addRule({
                conditions: incidentType.condition as TopLevelCondition,
                event: { type: 'matched', params: { incidentType } },
                priority: incidentType.order,
            })
        })
        engine.on('matched', () => {
            engine.stop();
        })

        const incidentType = await engine.run(alert).then(({ events }) => events[0]?.params?.incidentType as IncidentType);

        let status = alert.type
        if (!status) {
            const engine2 = new Engine;
            incidentType.statusCondions.forEach((statusCondion) => {
                engine.addRule({
                    conditions: statusCondion.condition as TopLevelCondition,
                    event: { type: 'matched', params: { status: statusCondion.status } },
                    priority: statusCondion.order,
                })
            })
            engine2.on('matched', () => {
                engine.stop();
            })
            status = await engine2.run(alert).then(({ events }) => events[0]?.params?.status as "trigger" | "resolve");
        }









    }

}
