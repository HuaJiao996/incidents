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
    title: 'Active Incidents',
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
        title: 'Database Connection Failure',
        description: 'Production database experiencing intermittent connection issues'
      },
      p2: {
        title: 'API Response Latency',
        description: 'High latency detected in payment processing API'
      },
      p3: {
        title: 'SSL Certificate Warning',
        description: 'SSL certificate approaching expiration'
      }
    }
  },
  alert: {
    title: 'Alert List',
    service: 'Service',
    dateRange: 'Start Time - End Time',
    searchPlaceholder: 'Search alert titles',
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
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      networkResolved: 'Network Issue Resolved',
      newAlert: 'New Alert Triggered',
      shiftHandover: 'Shift Handover Completed',
      timeAgo: {
        minutes: '{minutes} minutes ago',
        hours: '{hours} hours ago'
      }
    }
  }
}
