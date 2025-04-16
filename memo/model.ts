// eslint-disable no-unused-vars
// Global
//     Field[]
//     User[]
//     Team[]
//     Schedule[]
//     Role[]
//     Service[]
//     ServiceRoute[]
//     Alert[]
//     Incident[]

interface Alert {
    id: string
    detail: Record<string, any>
    service: Service
    incident: Incident
    createdAt: Date
    updatedAt: Date
}

/**
 * 字段
 * 用于描述事件的属性
 * 可在Global, Service中定义
 */
interface Field {
    name: string
    type: string // string, number, boolean, ['',...]
    desc: string
    required: boolean
}

/**
 * 用户
 * 用于描述用户信息
 * 可在Global, Team中定义
 */
interface User {
    id: string
    name: string
    mail: string
    roles: Role[]
    teams: Team[]
    services: Service[]
    notificationPreference: UserNotificationPreference
    phoneNumber?: string  // 添加电话号码字段
    timezone: string      // 添加时区字段
    status: 'online' | 'offline' | 'busy' | 'away'  // 添加用户状态
}

interface Team {
    name: string
    desc: string
    users: User[]
    services: Service[]
    roles: Role[]
}

interface Role {
    name: string
    desc: string
    allows: string[]
    denies: string[]
}

interface ScheduleBase {
    name: string
    desc: string
    startTime: Date
    endTime: Date
}

interface SingleSchedule extends ScheduleBase {
    type: 'single'
    users: User[]
    teams: Team[]
    services: Service[]
}

interface RecurringSchedule extends ScheduleBase {
    type: 'recurring'
    interval: number
    intervalUnit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
    intervalCount: number
}

interface Schedule {
    name: string
    desc: string
    type: string
    startTime: Date
    endTime: Date
    users: User[]
    teams: Team[]
    services: Service[]
}

interface GlobalConfig {
    fields: Field[]
    priority: string[]
    level: string[]
}

interface ServiceConfig {
    teams: Team[]
    fields: Field[]
    incidentTypes: IncidentType[]
    priority: string[]
    level: string[]
}

interface Service {
    id: string
    name: string
    desc: string
    config: ServiceConfig
    incidentTypes: IncidentType[]
    incidents: Incident[]
}

interface ServiceRoute {
    id: string
    name: string
    description?: string
    status: 'active' | 'inactive'
    conditions: Condition[]
    target: Service
}


type IncidentStatus =  'Trigger' | 'Resolve' | 'Acknowledge'
type Json = string

interface Condition {
    rule: Json
    targetId: string
}

interface IncidentType {
    id: string
    name: string
    description?: string
    triggerConditions: Json[]
    resolveConditions: Json[]
    priorityConditions: Condition[]
    levelConditions: Condition[]
    status: 'active' | 'inactive'
    schedule: Schedule[]

}

interface Incident {
    id: string
    assignee: User
    assigneeTeam: Team
    status: IncidentStatus
    type: IncidentType
    alerts: Alert[]
    resolvedAt: Date
    receivedAt: Date
    acknowledgedAt: Date
    notes: Note[]
    timeLine: TimeLine[]
    priority: string
    level: string
    notifications: NotificationRecord[]  // 添加通知记录
    escalationLevel: number             // 添加升级级别
    lastNotificationAt?: Date           // 添加最后通知时间
}

interface Note {
    id: string
    content: string
    createdAt: Date
    updatedAt: Date
    createdBy: User
    updatedBy: User
}

interface TimeLine {
    id: string
    content: string
    createdAt: Date
    updatedAt: Date
}

// 添加通知渠道类型
type NotificationChannel = 'system' | 'app_message' | 'app_call'

// 添加通知级别
type NotificationPriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Emergency' | 'Normal'

// 添加通知配置接口
interface NotificationConfig {
    channel: NotificationChannel
    priority: NotificationPriority
    responseTimeout: number  // 响应超时时间（分钟）
    escalationRules: EscalationRule[]
}

// 添加升级规则接口
interface EscalationRule {
    timeout: number  // 升级触发时间（分钟）
    action: 'upgrade_channel' | 'notify_manager' | 'notify_senior_manager'
    targetRole?: string  // 升级目标角色
    targetChannel?: NotificationChannel  // 升级目标通知渠道
}

// 添加免打扰配置接口
interface DoNotDisturbConfig {
    enabled: boolean
    startTime: string  // 格式 "HH:mm"
    endTime: string    // 格式 "HH:mm"
    timezone: string
    excludePriorities: NotificationPriority[]  // 不受免打扰影响的优先级
}

// 添加用户通知配置
interface UserNotificationPreference {
    doNotDisturb: DoNotDisturbConfig
    defaultChannel: NotificationChannel
    channelConfigs: {
        [key in NotificationChannel]: {
            enabled: boolean
            muteUntil?: Date
        }
    }
}

// 添加通知记录接口
interface NotificationRecord {
    id: string
    userId: string
    incidentId: string
    channel: NotificationChannel
    priority: NotificationPriority
    content: string
    status: 'sent' | 'delivered' | 'read' | 'responded'
    sentAt: Date
    deliveredAt?: Date
    readAt?: Date
    respondedAt?: Date
    escalationHistory: {
        timestamp: Date
        action: string
        fromChannel: NotificationChannel
        toChannel?: NotificationChannel
        toRole?: string
    }[]
}

// 添加通知模板接口
interface NotificationTemplate {
    id: string
    name: string
    type: 'message' | 'call'
    content: string
    variables: string[]  // 模板变量
    priority: NotificationPriority[]
    channels: NotificationChannel[]
}
