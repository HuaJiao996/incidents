import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IncidentService } from '../incident/incident.service';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RuleEngine } from 'src/common/rule-engine/rule-engine';
import { TopLevelCondition } from 'json-rules-engine';
import { tryit } from 'radash';

@Processor('alert')
export class AlertProcessor extends WorkerHost {
    private readonly logger = new Logger(AlertProcessor.name);
    constructor(private readonly incidentService: IncidentService, private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job<string>) {
        
        this.logger.log(job.data);
        const alert = await this.databaseService.getClient().query.alert.findFirst({
            where: (alert, { eq }) => eq(alert.id, job.data),
            with: {
                service: {
                        with: {
                            incidentTypes: {
                                with: {
                                    statusConditions: true,
                                }
                            }
                        }
                }
            }
        });
        if (!alert?.service) {
            throw new Error('Alert not found');
        }

        const incidentTypeGetter = new RuleEngine;
        alert.service.incidentTypes.forEach((incidentType) => {
            incidentTypeGetter.appendRule(incidentType.condition as TopLevelCondition,{ incidentType }, incidentType.order)
        })

        const [error, incidentType] = await tryit(async () => incidentTypeGetter.run(alert).then(({ events }) => events[0]?.params?.incidentType as (Exclude<(typeof alert.service), null>)['incidentTypes'][number]))();
        if (error) {
            this.logger.error(error);
            return; // TODO: handle error
        }
        this.logger.debug(incidentType);

        let status = alert.type
        if (!status) {
            const statusChecker = new RuleEngine;
            incidentType.statusConditions.forEach((statusCondion) => {
                statusChecker.addRule({
                    conditions: statusCondion.condition as TopLevelCondition,
                    event: { type: 'matched', params: { status: statusCondion.status } },
                    priority: statusCondion.order,
                })
            })
           
            status = await statusChecker.run(alert).then(({ events }) => events[0]?.params?.status as "trigger" | "resolve");
        }

        this.logger.debug(status);
        
        // 根据匹配的 Incident Type 确认当前是否存在未 Resolved 的 Incident
        const existingIncident = await this.incidentService.findOpenIncidentByType(incidentType.id);
        
        if (existingIncident) {
            // 存在未解决的事件，将 Alert 数据更新到 Incident 中
            this.logger.log(`找到未解决的事件: ${existingIncident.id}, 更新事件信息`);
            
            // 根据 Alert 状态决定是否将 Incident 标记为已解决
            if (status === 'resolve') {
                // 将 Incident 数据更新为 Resolved
                await this.incidentService.updateIncident(existingIncident.id, job.data, true);
                this.logger.log(`事件已标记为已解决: ${existingIncident.id}`);
            } else {
                // 仅更新 Alert 关联，不改变状态
                await this.incidentService.updateIncident(existingIncident.id, job.data, false);
                this.logger.log(`事件已更新最新告警: ${existingIncident.id}`);
            }
        } else {
            // 不存在未解决的事件
            if (status === 'resolve') {
                // 如果是解决状态的告警，且没有关联的未解决事件，则不处理
                this.logger.log('收到解决状态的告警，但没有关联的未解决事件，不处理');
            } else {
                // 创建新的 Incident
                this.logger.log('创建新的事件');
                const incidentId = await this.incidentService.createIncident(
                    alert,
                    incidentType,
                );
                this.logger.log(`新事件已创建: ${incidentId}`);
            }
        }
        
        this.logger.log(`告警处理完成: ${job.data}`);
        return { success: true };
    }

}
