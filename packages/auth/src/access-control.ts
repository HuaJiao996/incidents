import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  // 事件管理权限
  incident: ['create', 'read', 'update', 'delete'],

  // 告警管理权限
  alert: ['create', 'read', 'update', 'delete'],

  // 服务管理权限
  service: ['create', 'read', 'update', 'delete'],

  // 团队管理权限
  team: ['create', 'read', 'update', 'delete'],

  global: ['create', 'read', 'update', 'delete'],
} as const

export type Permissions = {
  [K in keyof typeof statement]?: Array<typeof statement[K][number]>
};

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  incident: ['create', 'read', 'update', 'delete'],
  alert: ['create', 'read', 'update', 'delete'],
  service: ['create', 'read', 'update', 'delete'],
  team: ['create', 'read', 'update', 'delete'],
  global: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
})

export const manager = ac.newRole({
  incident: ['create', 'read', 'update', 'delete'],
  alert: ['create', 'read', 'update', 'delete'],
  service: ['create', 'read', 'update', 'delete'],
  team: ['create', 'read', 'update', 'delete'],
  global: ['read'],
  ...adminAc.statements,
})
export const member = ac.newRole({
  incident: ['create', 'read', 'update', 'delete'],
  alert: ['create', 'read', 'update', 'delete'],
  service: ['create', 'read', 'update', 'delete'],
  team: ['read'],
  global: ['read'],
  user: ['list'],
})

export const viewer = ac.newRole({
  incident: ['read'],
  alert: ['read'],
  service: ['read'],
  team: ['read'],
  global: ['read'],
  user: ['list'],
})
