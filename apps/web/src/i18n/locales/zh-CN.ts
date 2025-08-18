const zhCN = {
  users: {
    title: '用户管理',
    description: '有权访问系统的用户',
    name: '姓名',
    email: '邮箱',
    role: '角色',
    status: '状态',
    actions: '操作',
    active: '活跃',
    inactive: '非活跃',
    edit: '编辑',
    delete: '删除',
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
    confirmDelete: '确定要删除此用户吗？',
    roles: {
      admin: '管理员',
      manager: '经理',
      member: '成员',
      viewer: '查看者'
    },
    statuses: {
      active: '活跃',
      inactive: '非活跃',
      pending: '待激活'
    }
  },
  error: {
    accessDenied: '访问被拒绝',
    accessDeniedDesc: '您没有权限访问此页面。请联系管理员获取相应权限。',
    insufficientPermissions: '权限不足',
    roleRequired: '需要 {role} 角色或更高权限',
    permissionRequired: '需要 {permission} 权限',
    cannotAssignRole: '您无权分配此角色',
    invalidRole: '无效的角色',
    operationFailed: '操作失败',
    unauthorized: '未授权访问'
  },
  permissions: {
    title: '权限管理',
    description: '管理用户权限和访问控制',
    resource: '资源',
    action: '操作',
    granted: '已授权',
    denied: '已拒绝',
    roleDescriptions: {
      admin: '拥有系统的完全访问权限，可以管理所有功能',
      manager: '可以管理用户和大部分系统功能，但不能修改系统设置',
      member: '可以查看和创建内容，但不能管理其他用户',
      viewer: '只能查看内容，不能进行任何修改操作'
    }
  },
  menu: {
    home: '首页',
    incident: '事件',
    alert: '告警',
    service: '服务',
    settings: '设置',
    permissions: '权限演示'
  },
  common: {
    appName: '事件管理系统',
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    update: '更新',
    search: '搜索',
    filter: '筛选',
    reset: '重置',
    submit: '提交',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    view: '查看',
    download: '下载',
    upload: '上传',
    refresh: '刷新',
    clear: '清空',
    select: '选择',
    selectAll: '全选',
    deselectAll: '取消全选',
    expand: '展开',
    collapse: '收起',
    copy: '复制',
    paste: '粘贴',
    cut: '剪切',
    undo: '撤销',
    redo: '重做',
    yes: '是',
    no: '否',
    ok: '确定',
    error: '错误',
    warning: '警告',
    info: '信息',
    success: '成功',
    failed: '失败',
    completed: '已完成',
    pending: '待处理',
    processing: '处理中',
    cancelled: '已取消',
    expired: '已过期',
    active: '活跃',
    inactive: '非活跃',
    enabled: '已启用',
    disabled: '已禁用',
    online: '在线',
    offline: '离线',
    connected: '已连接',
    disconnected: '已断开',
    available: '可用',
    unavailable: '不可用',
    public: '公开',
    private: '私有',
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
    deleted: '已删除',
    all: '全部',
    none: '无',
    other: '其他',
    unknown: '未知',
    optional: '可选',
    required: '必填',
    recommended: '推荐',
    deprecated: '已弃用',
    beta: '测试版',
    new: '新',
    updated: '已更新',
    sort: '排序',
    status: '状态',
    title: '标题',
    actions: '操作',
    createTime: '创建时间',
    updateTime: '更新时间',
    profile: '个人资料',
    goHome: '回到首页'
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
    },
    type: {
      form: {
        name: '名称',
        title: {
          label: '标题模板',
          placeholder: '输入标题模板，使用 #{alert.xxx} 引用告警字段'
        },
        description: {
          label: '描述模板',
          placeholder: '输入描述模板，使用 #{alert.xxx} 引用告警字段'
        },
        condition: {
          label: '匹配条件',
          placeholder: '输入 Jexl 表达式，使用 alert.xxx 引用告警字段'
        },
        groupCondition: {
          label: '分组条件',
          placeholder: '输入 Jexl 表达式，使用 alert.xxx 和 incident.xxx 引用字段'
        },
        priority: '优先级'
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
  },
  editor: {
    fieldType: {
      string: '文本',
      number: '数字',
      boolean: '布尔值',
      enum: '枚举',
      date: '日期',
      array: '数组',
      required: '必填'
    },
    field: {
      global: '全局字段',
      service: '服务字段'
    },
    alert: {
      title: '告警标题',
      content: '告警内容',
      createdAt: '告警创建时间',
      customFields: '告警自定义字段'
    },
    incident: {
      status: '事件状态',
      createdAt: '事件创建时间',
      serviceId: '服务ID',
      alerts: '关联的告警列表'
    },
    operator: {
      matches: '正则匹配',
      equals: '等于',
      notEquals: '不等于',
      greaterThan: '大于',
      greaterThanOrEqual: '大于等于',
      lessThan: '小于',
      lessThanOrEqual: '小于等于',
      and: '且',
      or: '或'
    },
    transform: {
      date: '转换为日期',
      dateInfo: '将字符串转换为日期对象',
      after: '晚于',
      afterInfo: '检查日期是否晚于指定日期',
      before: '早于',
      beforeInfo: '检查日期是否早于指定日期',
      contains: '包含',
      containsInfo: '检查字符串是否包含指定子串',
      startsWith: '以...开头',
      startsWithInfo: '检查字符串是否以指定前缀开头',
      endsWith: '以...结尾',
      endsWithInfo: '检查字符串是否以指定后缀结尾',
      matches: '匹配正则',
      matchesInfo: '检查字符串是否匹配指定的正则表达式'
    }
  },
  auth: {
    login: '登录',
    loginAccount: '登录您的账号',
    email: '邮箱',
    emailRequired: '请输入邮箱地址',
    password: '密码',
    passwordRequired: '请输入密码',
    pleaseLogin: '请登录您的账号',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    welcomeBack: '欢迎回来',
    logout: '退出登录'
  }
}
export type MessageSchema = typeof zhCN

export default zhCN;
