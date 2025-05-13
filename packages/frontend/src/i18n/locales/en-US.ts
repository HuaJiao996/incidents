export default {
  menu: {
    home: 'Home',
    incident: 'Incidents',
    alert: 'Alerts',
    service: 'Services',
    settings: 'Settings'
  },
  common: {
    appName: 'Incident Management System',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    status: 'Status',
    title: 'Title',
    actions: 'Actions',
    createTime: 'Created At',
    updateTime: 'Updated At'
  },
  incident: {
    title: 'Incident List',
    create: 'Create Incident',
    batchAssign: 'Batch Assign',
    batchResolve: 'Batch Resolve',
    status: {
      all: 'All Status',
      triggered: 'Triggered',
      processing: 'Processing',
      resolved: 'Resolved'
    },
    examples: {
      p1: {
        title: 'Database Connection Failed',
        description: 'Production database experiencing intermittent connection issues'
      },
      p2: {
        title: 'API Response Latency',
        description: 'High latency detected in payment processing API'
      },
      p3: {
        title: 'SSL Certificate Warning',
        description: 'SSL certificate is about to expire'
      }
    },
    type: {
      form: {
        name: 'Name',
        title: {
          label: 'Title Template',
          placeholder: 'Enter title template, use #{alert.xxx} to reference alert fields'
        },
        description: {
          label: 'Description Template',
          placeholder: 'Enter description template, use #{alert.xxx} to reference alert fields'
        },
        condition: {
          label: 'Match Condition',
          placeholder: 'Enter Jexl expression, use alert.xxx to reference alert fields'
        },
        groupCondition: {
          label: 'Group Condition',
          placeholder: 'Enter Jexl expression, use alert.xxx and incident.xxx to reference fields'
        },
        priority: 'Priority'
      }
    }
  },
  alert: {
    title: 'Alert List',
    service: 'Service',
    dateRange: 'Start Time - End Time',
    searchPlaceholder: 'Search alert title',
    type: {
      label: 'Alert Type',
      all: 'All Types',
      triggered: 'Triggered',
      recovered: 'Recovered'
    },
    relatedIncident: 'Related Incident',
    noIncident: 'No Related Incident'
  },
  service: {
    title: 'Service List',
    create: 'Add New Service',
    searchPlaceholder: 'Search services...',
    name: 'Service Name',
    description: 'Description'
  },
  settings: {
    title: 'System Settings',
    systemName: 'System Name',
    refreshInterval: 'Auto Refresh Interval',
    darkMode: 'Enable Dark Mode',
    language: 'Default Language'
  },
  home: {
    dutySchedule: {
      title: 'Duty Schedule',
      weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      onDuty: 'On Duty',
      offDuty: 'Off Duty'
    },
    teamStatus: {
      title: 'Team Status',
      online: 'Online',
      away: 'Away',
      inMeeting: 'In Meeting'
    },
    recentActivity: {
      title: 'Recent Activity',
      networkResolved: 'Network issue resolved',
      newAlert: 'New alert triggered',
      shiftHandover: 'Shift handover completed',
      timeAgo: {
        minutes: '{minutes} minutes ago',
        hours: '{hours} hours ago'
      }
    }
  },
  editor: {
    fieldType: {
      string: 'Text',
      number: 'Number',
      boolean: 'Boolean',
      enum: 'Enum',
      date: 'Date',
      array: 'Array',
      required: 'Required'
    },
    field: {
      global: 'Global Field',
      service: 'Service Field'
    },
    alert: {
      title: 'Alert Title',
      content: 'Alert Content',
      createdAt: 'Alert Creation Time',
      customFields: 'Alert Custom Fields'
    },
    incident: {
      status: 'Incident Status',
      createdAt: 'Incident Creation Time',
      serviceId: 'Service ID',
      alerts: 'Related Alerts'
    },
    operator: {
      matches: 'Matches Regex',
      equals: 'Equals',
      notEquals: 'Not Equals',
      greaterThan: 'Greater Than',
      greaterThanOrEqual: 'Greater Than or Equal',
      lessThan: 'Less Than',
      lessThanOrEqual: 'Less Than or Equal',
      and: 'AND',
      or: 'OR'
    },
    transform: {
      date: 'Convert to Date',
      dateInfo: 'Convert string to Date object',
      after: 'After',
      afterInfo: 'Check if date is after specified date',
      before: 'Before',
      beforeInfo: 'Check if date is before specified date',
      contains: 'Contains',
      containsInfo: 'Check if string contains specified substring',
      startsWith: 'Starts With',
      startsWithInfo: 'Check if string starts with specified prefix',
      endsWith: 'Ends With',
      endsWithInfo: 'Check if string ends with specified suffix',
      matches: 'Matches Regex',
      matchesInfo: 'Check if string matches specified regular expression'
    }
  }
}
