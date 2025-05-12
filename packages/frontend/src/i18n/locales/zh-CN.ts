export default {
  menu: {
    home: '首页',
    incident: '事件',
    alert: '告警',
    service: '服务',
    settings: '设置'
  },
  common: {
    appName: '事件管理系统',
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    status: '状态',
    title: '标题',
    actions: '操作',
    createTime: '创建时间',
    updateTime: '更新时间'
  },
  incident: {
    title: '故障事件列表',
    create: '创建事件',
    batchAssign: '批量分配',
    batchResolve: '批量解决',
    status: {
      all: '全部状态',
      triggered: '已触发',
      processing: '处理中',
      resolved: '已解决'
    },
    examples: {
      p1: {
        title: '数据库连接失败',
        description: '生产数据库出现间歇性连接问题'
      },
      p2: {
        title: 'API响应延迟',
        description: '支付处理API检测到高延迟'
      },
      p3: {
        title: 'SSL证书警告',
        description: 'SSL证书即将过期'
      }
    }
  },
  alert: {
    title: '告警列表',
    service: '服务',
    dateRange: '开始时间 - 结束时间',
    searchPlaceholder: '搜索告警标题',
    type: {
      label: '告警类型',
      all: '全部类型',
      triggered: '已触发',
      recovered: '已恢复'
    },
    relatedIncident: '关联事件',
    noIncident: '无关联事件'
  },
  service: {
    title: '服务列表',
    create: '添加新服务',
    searchPlaceholder: '搜索服务...',
    name: '服务名称',
    description: '描述'
  },
  settings: {
    title: '系统设置',
    systemName: '系统名称',
    refreshInterval: '自动刷新间隔',
    darkMode: '启用暗黑模式',
    language: '默认语言'
  },
  home: {
    dutySchedule: {
      title: '值班表',
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      onDuty: '值班',
      offDuty: '休息'
    },
    teamStatus: {
      title: '团队状态',
      online: '在线',
      away: '离开',
      inMeeting: '会议中'
    },
    recentActivity: {
      title: '最近活动',
      networkResolved: '网络问题已解决',
      newAlert: '新告警触发',
      shiftHandover: '班次交接完成',
      timeAgo: {
        minutes: '{minutes}分钟前',
        hours: '{hours}小时前'
      }
    }
  }
}
