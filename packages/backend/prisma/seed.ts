import { PrismaClient } from '../libs/database/src/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库初始化...');

  // 创建服务
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 1 },
      update: {
        name: 'Web服务',
        description: '网站前端服务',
      },
      create: {
        id: 1,
        name: 'Web服务',
        description: '网站前端服务',
      },
    }),
    prisma.service.upsert({
      where: { id: 2 },
      update: {
        name: 'API服务',
        description: 'RESTful API服务',
      },
      create: {
        id: 2,
        name: 'API服务',
        description: 'RESTful API服务',
      },
    }),
    prisma.service.upsert({
      where: { id: 3 },
      update: {
        name: '数据库服务',
        description: '后端数据库服务',
      },
      create: {
        id: 3,
        name: '数据库服务',
        description: '后端数据库服务',
      },
    }),
  ]);

  // 创建服务路由
  const serviceRoutes = await Promise.all([
    prisma.serviceRoute.upsert({
      where: { id: 1 },
      update: {
        serviceId: 1,
        order: 0,
        condition: 'title|matches("Web")',
        description: 'Web服务的告警路由',
      },
      create: {
        id: 1,
        serviceId: 1,
        order: 0,
        condition: 'title|matches("Web")',
        description: 'Web服务的告警路由',
      },
    }),
    prisma.serviceRoute.upsert({
      where: { id: 2 },
      update: {
        serviceId: 2,
        order: 1,
        condition: 'title|matches("API")',
        description: 'API服务的告警路由',
      },
      create: {
        id: 2,
        serviceId: 2,
        order: 1,
        condition: 'title|matches("API")',
        description: 'API服务的告警路由',
      },
    }),
    prisma.serviceRoute.upsert({
      where: { id: 3 },
      update: {
        serviceId: 3,
        order: 2,
        condition: 'title|matches("Database")',
        description: '数据库服务的告警路由',
      },
      create: {
        id: 3,
        serviceId: 3,
        order: 2,
        condition: 'title|matches("Database")',
        description: '数据库服务的告警路由',
      },
    }),
    prisma.serviceRoute.upsert({
      where: { id: 4 },
      update: {
        serviceId: 1,
        order: 3,
        condition: '(title|matches("前端") && content|matches("错误")) || (title|matches("UI") && content|matches("崩溃"))',
        description: '前端UI错误路由',
      },
      create: {
        id: 4,
        serviceId: 1,
        order: 3,
        condition: '(title|matches("前端") && content|matches("错误")) || (title|matches("UI") && content|matches("崩溃"))',
        description: '前端UI错误路由',
      },
    }),
  ]);

  // 创建服务自定义字段
  const serviceCustomFields = await Promise.all([
    prisma.serviceCustomField.upsert({
      where: { id: 1 },
      update: {
        serviceId: 1,
        path: 'browser',
        type: 'STRING',
        required: true,
        enumValues: [],
      },
      create: {
        id: 1,
        serviceId: 1,
        path: 'browser',
        type: 'STRING',
        required: true,
        enumValues: [],
      },
    }),
    prisma.serviceCustomField.upsert({
      where: { id: 2 },
      update: {
        serviceId: 2,
        path: 'endpoint',
        type: 'STRING',
        required: true,
        enumValues: [],
      },
      create: {
        id: 2,
        serviceId: 2,
        path: 'endpoint',
        type: 'STRING',
        required: true,
        enumValues: [],
      },
    }),
    prisma.serviceCustomField.upsert({
      where: { id: 3 },
      update: {
        serviceId: 3,
        path: 'query',
        type: 'STRING',
        required: false,
        enumValues: [],
      },
      create: {
        id: 3,
        serviceId: 3,
        path: 'query',
        type: 'STRING',
        required: false,
        enumValues: [],
      },
    }),
  ]);

  // 创建事件类型
  const incidentTypes = await Promise.all([
    prisma.incidentType.upsert({
      where: { id: 1 },
      update: {
        name: '网站崩溃',
        serviceId: 1,
        title: '网站崩溃: #{alert.title}',
        description: '发生时间: #{alert.createdAt}\n详细信息: #{alert.content}',
        condition: 'title|matches("崩溃")',
        groupCondition: 'incident.status != "RESOLVED" && title|matches("崩溃") && incident.createdAt > (now - 3600000)',
        priority: 0,
      },
      create: {
        id: 1,
        name: '网站崩溃',
        serviceId: 1,
        title: '网站崩溃: #{alert.title}',
        description: '发生时间: #{alert.createdAt}\n详细信息: #{alert.content}',
        condition: 'title|matches("崩溃")',
        groupCondition: 'incident.status != "RESOLVED" && title|matches("崩溃") && incident.createdAt > (now - 3600000)',
        priority: 0,
      },
    }),
    prisma.incidentType.upsert({
      where: { id: 2 },
      update: {
        name: 'API超时',
        serviceId: 2,
        title: 'API超时告警: #{alert.title}',
        description: '接口: #{alert.customFields.endpoint}\n详细信息: #{alert.content}',
        condition: 'title|matches("超时")',
        groupCondition: 'incident.status != "RESOLVED" && title == "API超时" && alert.customFields.environment == "production" && incident.serviceId == alert.serviceId',
        priority: 0,
      },
      create: {
        id: 2,
        name: 'API超时',
        serviceId: 2,
        title: 'API超时告警: #{alert.title}',
        description: '接口: #{alert.customFields.endpoint}\n详细信息: #{alert.content}',
        condition: 'title|matches("超时")',
        groupCondition: 'incident.status != "RESOLVED" && title == "API超时" && alert.customFields.environment == "production" && incident.serviceId == alert.serviceId',
        priority: 0,
      },
    }),
    prisma.incidentType.upsert({
      where: { id: 3 },
      update: {
        name: '数据库连接异常',
        serviceId: 3,
        title: 'DB异常: #{alert.title}',
        description: '查询: #{alert.customFields.query}\n详细信息: #{alert.content}',
        condition: 'title|matches("连接")',
        groupCondition: 'incident.status != "RESOLVED" && title|matches("连接") && incident.serviceId == alert.serviceId && incident.createdAt > (now - 1800000)',
        priority: 0,
      },
      create: {
        id: 3,
        name: '数据库连接异常',
        serviceId: 3,
        title: 'DB异常: #{alert.title}',
        description: '查询: #{alert.customFields.query}\n详细信息: #{alert.content}',
        condition: 'title|matches("连接")',
        groupCondition: 'incident.status != "RESOLVED" && title|matches("连接") && incident.serviceId == alert.serviceId && incident.createdAt > (now - 1800000)',
        priority: 0,
      },
    }),
    prisma.incidentType.upsert({
      where: { id: 4 },
      update: {
        name: '复杂前端错误',
        serviceId: 1,
        title: '前端错误: #{alert.title} (#{alert.customFields.browser})',
        description: '浏览器: #{alert.customFields.browser}\n优先级: #{alert.customFields.priority}\n详细信息: #{alert.content}',
        condition: '(title|matches("前端") && customFields.browser == "Chrome") || (title|matches("UI") && customFields.priority == "high" && content|matches("紧急"))',
        groupCondition: 'incident.status != "RESOLVED" && customFields.browser == incident.alerts[0].customFields.browser && ["high", "critical"].includes(customFields.priority) && incident.createdAt > (now - 7200000)',
        priority: 1,
      },
      create: {
        id: 4,
        name: '复杂前端错误',
        serviceId: 1,
        title: '前端错误: #{alert.title} (#{alert.customFields.browser})',
        description: '浏览器: #{alert.customFields.browser}\n优先级: #{alert.customFields.priority}\n详细信息: #{alert.content}',
        condition: '(title|matches("前端") && customFields.browser == "Chrome") || (title|matches("UI") && customFields.priority == "high" && content|matches("紧急"))',
        groupCondition: 'incident.status != "RESOLVED" && customFields.browser == incident.alerts[0].customFields.browser && ["high", "critical"].includes(customFields.priority) && incident.createdAt > (now - 7200000)',
        priority: 1,
      },
    }),
  ]);

  // 创建事件类型严重程度条件
  const severityConditions = await Promise.all([
    // 网站崩溃的严重程度条件
    prisma.incidentTypeSeverityCondition.upsert({
      where: { id: 1 },
      update: {
        severity: 'CRITICAL',
        incidentTypeId: 1,
        condition: 'content|matches("完全无法访问") || customFields.affectedUsers > 1000',
        order: 0,
      },
      create: {
        id: 1,
        severity: 'CRITICAL',
        incidentTypeId: 1,
        condition: 'content|matches("完全无法访问") || customFields.affectedUsers > 1000',
        order: 0,
      },
    }),
    prisma.incidentTypeSeverityCondition.upsert({
      where: { id: 2 },
      update: {
        severity: 'HIGH',
        incidentTypeId: 1,
        condition: 'content|matches("部分功能无法使用") || customFields.affectedUsers > 500',
        order: 1,
      },
      create: {
        id: 2,
        severity: 'HIGH',
        incidentTypeId: 1,
        condition: 'content|matches("部分功能无法使用") || customFields.affectedUsers > 500',
        order: 1,
      },
    }),
    // ... 继续其他严重程度条件的upsert操作
  ]);

  // 创建全局自定义字段
  const globalCustomFields = await Promise.all([
    prisma.globalCustomField.upsert({
      where: { id: 1 },
      update: {
        path: 'timestamp',
        type: 'DATE',
        required: true,
        enumValues: [],
      },
      create: {
        id: 1,
        path: 'timestamp',
        type: 'DATE',
        required: true,
        enumValues: [],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 2 },
      update: {
        path: 'environment',
        type: 'ENUM',
        required: true,
        enumValues: ['development', 'testing', 'production'],
      },
      create: {
        id: 2,
        path: 'environment',
        type: 'ENUM',
        required: true,
        enumValues: ['development', 'testing', 'production'],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 3 },
      update: {
        path: 'priority',
        type: 'ENUM',
        required: false,
        enumValues: ['low', 'medium', 'high', 'critical'],
      },
      create: {
        id: 3,
        path: 'priority',
        type: 'ENUM',
        required: false,
        enumValues: ['low', 'medium', 'high', 'critical'],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 4 },
      update: {
        path: 'tags',
        type: 'ARRAY',
        required: false,
        enumValues: [],
      },
      create: {
        id: 4,
        path: 'tags',
        type: 'ARRAY',
        required: false,
        enumValues: [],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 5 },
      update: {
        path: 'affectedUsers',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
      create: {
        id: 5,
        path: 'affectedUsers',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 6 },
      update: {
        path: 'responseTime',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
      create: {
        id: 6,
        path: 'responseTime',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
    }),
    prisma.globalCustomField.upsert({
      where: { id: 7 },
      update: {
        path: 'errorRate',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
      create: {
        id: 7,
        path: 'errorRate',
        type: 'NUMBER',
        required: false,
        enumValues: [],
      },
    }),
  ]);

  console.log('数据库初始化完成！');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 