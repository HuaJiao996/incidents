import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '@libs/database';
import { RuleEngine } from '@libs/common/rengine';
import { tryit } from 'radash';
import { IncidentService } from '../incident/incident.service';
import { compileTemplate } from '@libs/common/template';
import { Alert, Incident, IncidentStatus, IncidentType } from '@prisma/client';

@Processor('alertQueue')
export class AlertProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertProcessor.name);
  constructor(
    private readonly incidentService: IncidentService,
    private readonly databaseService: DatabaseService,
  ) {
    super();
  }

  async process(job: Job<number>) {
    this.logger.log(job.data);

    // 获取告警数据
    const alert = await this.fetchAlert(job.data);
    if (!alert?.service) {
      throw new Error(`Alert not found ${job.data}`);
    }

    // 匹配事件类型
    const matchedIncidentType = await this.matchIncidentType(alert);
    if (!matchedIncidentType) {
      return;
    }

    // 处理事件
    await this.handleIncident(alert, matchedIncidentType);

    this.logger.log(`Alert processing completed: ${job.data}`);
    return { success: true };
  }

  private async fetchAlert(alertId: number) {
    return this.databaseService.client.alert.findUnique({
      where: {
        id: alertId
      },
      include: {
        service: {
          include: {
            incidentTypes: {
              orderBy: {
                priority: 'desc'
              }
            }
          }
        }
      }
    })
  }

  private async matchIncidentType(
    alert: NonNullable<Awaited<ReturnType<typeof this.fetchAlert>>>,
  ) {
    if (!alert.service) {
      this.logger.error('Alert service not found');
      return null;
    }

    const incidentTypeChecker = new RuleEngine<IncidentType>();

    alert.service.incidentTypes.forEach((incidentType) => {
      if (incidentType.condition) {
        incidentTypeChecker.appendRule(
          incidentType.condition,
          incidentType,
          incidentType.priority,
        );
      }
    });

    const [error, matchedIncidentType] = await tryit(() =>
      incidentTypeChecker.run(alert)
    )();

    if (error) {
      this.logger.error(error);
      return null;
    }

    this.logger.debug(matchedIncidentType);

    if (!matchedIncidentType) {
      this.logger.error('No matching Incident Type');
      return null;
    }

    return matchedIncidentType;
  }

  private async handleIncident(
    alert: Alert,
    incidentType: IncidentType,
  ) {
    this.logger.log(`处理告警 ${alert.id} 为事件类型 ${incidentType.name}`);
    let existingIncident: Incident | undefined
    
    if (incidentType.groupCondition) {
      // 1. 首先检索 IncidentType 下所有非 RESOLVED 状态的 Incident
      const openIncidents = await this.databaseService.client.incident.findMany({
        where: {
          typeId: incidentType.id,
          status: {
            not: IncidentStatus.RESOLVED
          }
        }
      });

      if (openIncidents.length) {
        const groupChecker = new RuleEngine<true>();
        for (const openIncident of openIncidents) {
          groupChecker.appendRule(incidentType.groupCondition, true);
          const [error, matched] = await tryit(() => 
            groupChecker.run({ alert, incident: openIncident })
          )();
          
          if (!error && matched) {
            existingIncident = openIncident;
            break;
          }
        }
      }
    }

    if (existingIncident) {
      await this.databaseService.client.alert.update({
        where: { id: alert.id },
        data: { incidentId: existingIncident.id }
      });
    } else {
      const title = compileTemplate(incidentType.title, { alert });
      const description = compileTemplate(incidentType.description, { alert });
      await this.incidentService.createIncident(alert, incidentType, title, description);
    }
  }
}
