import { logger } from '@incidents/common/logger'
import { RuleEngine } from '@incidents/common/rengine'
import {
  databaseClient,
  IncidentSeverity,
  type Alert,
  type IncidentType,
  type IncidentUpdateInput,
} from '@incidents/database'
import { addIncidentJob } from '@incidents/queue'
import { tryit } from 'radash'

/**
 * 根据告警内容和事件类型的条件判断严重程度
 */
export async function determineSeverity(
  alert: Alert,
  incidentType: IncidentType,
): Promise<IncidentSeverity> {
  // 获取事件类型的所有严重程度条件
  const severityConditions = await databaseClient.incidentTypeSeverityCondition.findMany({
    where: { incidentTypeId: incidentType.id },
    orderBy: { order: 'asc' },
  })

  if (!severityConditions || severityConditions.length === 0) {
    logger.warn(
      `No severity conditions found for incident type ${incidentType.id}, using default HIGH`,
    )
    return IncidentSeverity.HIGH
  }

  // 创建规则引擎实例
  const severityChecker = new RuleEngine<IncidentSeverity>()

  // 添加所有严重程度条件
  severityConditions.forEach(condition => {
    severityChecker.appendRule(
      condition.condition,
      condition.severity,
      -condition.order, // 注意：这里取负数是因为RuleEngine按优先级降序排列，而我们的order是升序
    )
  })

  // 准备评估上下文
  const context = {
    alert,
    title: alert.title,
    content: alert.content,
    customFields: alert.customFields || {},
  }

  // 执行规则评估
  const [error, matchedSeverity] = await tryit(() => severityChecker.run(context))()

  if (error) {
    logger.error(error, `Error evaluating severity conditions: ${error.message}`)
    return IncidentSeverity.HIGH
  }

  if (!matchedSeverity) {
    logger.warn(
      `No matching severity condition found for incident type ${incidentType.id}, using lowest severity`,
    )
    return severityConditions[severityConditions.length - 1]?.severity || 'LOW'
  }

  logger.debug(`Determined severity ${matchedSeverity} for alert ${alert.id}`)
  return matchedSeverity
}

export async function createIncident(
  alert: Alert,
  incidentType: IncidentType,
  title: string,
  description: string,
) {
  logger.info(
    `Create incident: alertId=${alert.id}, incidentTypeId=${incidentType.id}, serviceId=${incidentType.serviceId}`,
  )

  // 确定事件严重程度
  const severity = await determineSeverity(alert, incidentType)
  logger.info(`Determined severity: ${severity} for alert ${alert.id}`)

  // 使用 Prisma 事务创建事件并更新告警
  const result = await databaseClient.$transaction(async tx => {
    // 创建新事件
    const incident = await tx.incident.create({
      data: {
        title,
        typeId: incidentType.id,
        description,
        severity,
        serviceId: incidentType.serviceId,
      },
    })

    // 更新告警，关联到新创建的事件
    const updatedAlert = await tx.alert.update({
      where: { id: alert.id },
      data: { incidentId: incident.id },
    })

    return { incident, updatedAlert }
  })

  logger.info(`Incident created successfully: incidentId=${result.incident.id}`)

  // 添加到处理队列
  await addIncidentJob({
    id: result.incident.id,
    severity,
    serviceId: incidentType.serviceId,
  })

  return result.incident.id
}

export async function resolveIncident(incidentId: number, alertId: number) {
  logger.info(`Resolving incident: incidentId=${incidentId}, alertId=${alertId}`)

  return updateIncident(incidentId, alertId, true)
}

async function updateIncident(incidentId: number, alertId: number, resolved: boolean) {
  logger.info(
    `Updating incident: incidentId=${incidentId}, alertId=${alertId}, resolved=${resolved}`,
  )

  const updateData: IncidentUpdateInput = {
    //   lastAlertId: alertId,
    status: 'OPEN',
    //   resolvedAt: new Date(),
  }

  if (resolved) {
    updateData.status = 'RESOLVED'
    //   updateData.resolvedAt = new Date();
  }

  // 使用 Prisma 更新事件
  await databaseClient.incident.update({
    where: { id: incidentId },
    data: updateData,
  })

  logger.info(
    `Incident update success: incidentId=${incidentId}, status=${resolved ? 'resolved' : 'open'}`,
  )

  return true
}
