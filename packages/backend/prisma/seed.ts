import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库初始化...');

  // 执行原始SQL语句插入数据
  // 创建服务
  await prisma.$executeRaw`
    INSERT INTO services (id, name, description, "createdAt", "updatedAt")
    VALUES 
      (1, 'Web服务', '网站前端服务', NOW(), NOW()),
      (2, 'API服务', 'RESTful API服务', NOW(), NOW()),
      (3, '数据库服务', '后端数据库服务', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, 
        description = EXCLUDED.description, 
        "updatedAt" = NOW();
  `;

  // 创建服务路由 - 使用Jexl表达式
  await prisma.$executeRaw`
    INSERT INTO service_routes (id, "serviceId", "order", condition, description, "createdAt", "updatedAt")
    VALUES 
      (1, 1, 0, 'title|matches("Web")', 'Web服务的告警路由', NOW(), NOW()),
      (2, 2, 1, 'title|matches("API")', 'API服务的告警路由', NOW(), NOW()),
      (3, 3, 2, 'title|matches("Database")', '数据库服务的告警路由', NOW(), NOW()),
      (4, 1, 3, '(title|matches("前端") && content|matches("错误")) || (title|matches("UI") && content|matches("崩溃"))', '前端UI错误路由', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET "serviceId" = EXCLUDED."serviceId", 
        "order" = EXCLUDED."order", 
        condition = EXCLUDED.condition, 
        description = EXCLUDED.description, 
        "updatedAt" = NOW();
  `;

  // 创建服务自定义字段
  await prisma.$executeRaw`
    INSERT INTO service_custom_fields (id, "serviceId", path, type, required, "enumValues", "createdAt", "updatedAt")
    VALUES 
      (1, 1, 'browser', 'STRING', true, '[]', NOW(), NOW()),
      (2, 2, 'endpoint', 'STRING', true, '[]', NOW(), NOW()),
      (3, 3, 'query', 'STRING', false, '[]', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET "serviceId" = EXCLUDED."serviceId", 
        path = EXCLUDED.path, 
        type = EXCLUDED.type, 
        required = EXCLUDED.required, 
        "enumValues" = EXCLUDED."enumValues", 
        "updatedAt" = NOW();
  `;

  // 创建事件类型 - 使用Jexl表达式
  await prisma.$executeRaw`
    INSERT INTO incident_types (id, name, "serviceId", title, description, condition, "groupCondition", priority, "createdAt", "updatedAt")
    VALUES 
      (1, '网站崩溃', 1, '网站崩溃: #{alert.title}', '发生时间: #{alert.createdAt}\n详细信息: #{alert.content}', 'title|matches("崩溃")', 'incident.status != "RESOLVED" && title|matches("崩溃") && incident.createdAt > (now - 3600000)', 0, NOW(), NOW()),
      (2, 'API超时', 2, 'API超时告警: #{alert.title}', '接口: #{alert.customFields.endpoint}\n详细信息: #{alert.content}', 'title|matches("超时")', 'incident.status != "RESOLVED" && title == "API超时" && alert.customFields.environment == "production" && incident.serviceId == alert.serviceId', 0, NOW(), NOW()),
      (3, '数据库连接异常', 3, 'DB异常: #{alert.title}', '查询: #{alert.customFields.query}\n详细信息: #{alert.content}', 'title|matches("连接")', 'incident.status != "RESOLVED" && title|matches("连接") && incident.serviceId == alert.serviceId && incident.createdAt > (now - 1800000)', 0, NOW(), NOW()),
      (4, '复杂前端错误', 1, '前端错误: #{alert.title} (#{alert.customFields.browser})', '浏览器: #{alert.customFields.browser}\n优先级: #{alert.customFields.priority}\n详细信息: #{alert.content}', '(title|matches("前端") && customFields.browser == "Chrome") || (title|matches("UI") && customFields.priority == "high" && content|matches("紧急"))', 'incident.status != "RESOLVED" && customFields.browser == incident.alerts[0].customFields.browser && ["high", "critical"].includes(customFields.priority) && incident.createdAt > (now - 7200000)', 1, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, 
        "serviceId" = EXCLUDED."serviceId",
        title = EXCLUDED.title,
        description = EXCLUDED.description, 
        condition = EXCLUDED.condition, 
        "groupCondition" = EXCLUDED."groupCondition",
        priority = EXCLUDED.priority, 
        "updatedAt" = NOW();
  `;

  // 创建全局自定义字段
  await prisma.$executeRaw`
    INSERT INTO global_custom_fields (id, path, type, required, "enumValues", "createdAt", "updatedAt")
    VALUES 
      (1, 'timestamp', 'DATE', true, '[]', NOW(), NOW()),
      (2, 'environment', 'ENUM', true, '["development","testing","production"]', NOW(), NOW()),
      (3, 'priority', 'ENUM', false, '["low","medium","high","critical"]', NOW(), NOW()),
      (4, 'tags', 'ARRAY', false, '[]', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE 
    SET path = EXCLUDED.path, 
        type = EXCLUDED.type, 
        required = EXCLUDED.required, 
        "enumValues" = EXCLUDED."enumValues", 
        "updatedAt" = NOW();
  `;

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