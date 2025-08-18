import {
  databaseClient,
  IncidentStatus,
  type Alert,
  type Incident,
  type IncidentType,
} from '@incidents/database'
import { type AlertJobProcessor } from '@incidents/queue'
import { logger } from '@incidents/common/logger'
import { RuleEngine } from '@incidents/common/rengine'
import { tryit } from 'radash'
import { compileTemplate } from '@incidents/common/utils'
import { createIncident } from '@/services/incident'

export const alertJobProcessor: AlertJobProcessor = async job => {
  logger.info(job.data)

  // 获取告警数据
  const alert = await fetchAlert(job.data)
  if (!alert?.service) {
    throw new Error(`Alert not found ${job.data}`)
  }

  // 匹配事件类型
  const matchedIncidentType = await matchIncidentType(alert)
  if (!matchedIncidentType) {
    return
  }

  // 处理事件
  await handleIncident(alert, matchedIncidentType)

  logger.info(`Alert processing completed: ${job.data}`)
  return { success: true }
}

async function fetchAlert(alertId: number) {
  return databaseClient.alert.findUnique({
    where: {
      id: alertId,
    },
    include: {
      service: {
        include: {
          incidentTypes: {
            orderBy: {
              priority: 'desc',
            },
          },
        },
      },
    },
  })
}

async function matchIncidentType(alert: NonNullable<Awaited<ReturnType<typeof fetchAlert>>>) {
  if (!alert.service) {
    logger.error('Alert service not found')
    return null
  }

  const incidentTypeChecker = new RuleEngine<IncidentType>()

  alert.service.incidentTypes.forEach(incidentType => {
    if (incidentType.condition) {
      incidentTypeChecker.appendRule(incidentType.condition, incidentType, incidentType.priority)
    }
  })

  const [error, matchedIncidentType] = await tryit(() => incidentTypeChecker.run(alert))()

  if (error) {
    logger.error(error)
    return null
  }

  logger.debug(matchedIncidentType)

  if (!matchedIncidentType) {
    logger.error('No matching Incident Type')
    return null
  }

  return matchedIncidentType
}

async function handleIncident(alert: Alert, incidentType: IncidentType) {
  logger.info(`处理告警 ${alert.id} 为事件类型 ${incidentType.name}`)
  let existingIncident: Incident | undefined

  if (incidentType.groupCondition) {
    // 1. 首先检索 IncidentType 下所有非 RESOLVED 状态的 Incident
    const openIncidents = await databaseClient.incident.findMany({
      where: {
        typeId: incidentType.id,
        status: {
          not: IncidentStatus.RESOLVED,
        },
      },
    })

    if (openIncidents.length) {
      const groupChecker = new RuleEngine<true>()
      for (const openIncident of openIncidents) {
        groupChecker.appendRule(incidentType.groupCondition, true)
        const [error, matched] = await tryit(() =>
          groupChecker.run({ alert, incident: openIncident }),
        )()

        if (!error && matched) {
          existingIncident = openIncident
          break
        }
      }
    }
  }

  if (existingIncident) {
    await databaseClient.alert.update({
      where: { id: alert.id },
      data: { incidentId: existingIncident.id },
    })
  } else {
    const title = compileTemplate(incidentType.title, { alert })
    const description = compileTemplate(incidentType.description, { alert })
    await createIncident(alert, incidentType, title, description)
  }
}
