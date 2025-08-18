import { databaseClient, IncidentSeverity } from '@incidents/database'
import type { IncidentJobProcessor } from '@incidents/queue'
import { logger } from '@incidents/common/logger'

export const incidentJobProcessor: IncidentJobProcessor = async job => {
  const { id, severity, serviceId } = job.data

  logger.info(`Processing incident: id=${id}, severity=${severity}, serviceId=${serviceId}`)

  try {
    // 获取服务相关信息
    const service = await databaseClient.service.findUnique({
      where: { id: serviceId },
      include: {
        customFields: true,
      },
    })

    if (!service) {
      throw new Error(`Service not found: ${serviceId}`)
    }

    // 根据严重程度执行不同的处理逻辑
    switch (severity) {
      case IncidentSeverity.CRITICAL:
        logger.info(`Critical incident detected: ${id}`)
        // TODO: 实现关键事件的处理逻辑
        break

      case IncidentSeverity.HIGH:
        logger.info(`High severity incident detected: ${id}`)
        // TODO: 实现高优先级事件的处理逻辑
        break

      case IncidentSeverity.MEDIUM:
        logger.info(`Medium severity incident detected: ${id}`)
        // TODO: 实现中等优先级事件的处理逻辑
        break

      case IncidentSeverity.LOW:
        logger.info(`Low severity incident detected: ${id}`)
        // TODO: 实现低优先级事件的处理逻辑
        break

      default:
        logger.warn(`Unknown severity level: ${severity}`)
    }

    // 更新事件状态为处理中
    await databaseClient.incident.update({
      where: { id: id },
      data: {
        // status: 'IN_PROGRESS',
        updatedAt: new Date(),
      },
    })

    logger.info(`Incident processed successfully: ${id}`)
  } catch (error) {
    logger.error(error, `Error processing incident ${id}:`)
    throw error
  }
}
