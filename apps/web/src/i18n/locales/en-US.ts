import type { MessageSchema } from "./zh-CN"

const en: MessageSchema = {
  users: {
    title: 'Users',
    description: 'User with access to the system',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    edit: 'Edit',
    delete: 'Delete',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    confirmDelete: 'Are you sure you want to delete this user?',
    roles: {
      admin: 'Administrator',
      manager: 'Manager',
      member: 'Member',
      viewer: 'Viewer'
    },
    statuses: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending'
    }
  },
  error: {
    accessDenied: 'Access Denied',
    accessDeniedDesc: 'You do not have permission to access this page. Please contact administrator for appropriate permissions.',
    insufficientPermissions: 'Insufficient Permissions',
    roleRequired: 'Requires {role} role or higher',
    permissionRequired: 'Requires {permission} permission',
    cannotAssignRole: 'You do not have permission to assign this role',
    invalidRole: 'Invalid role',
    operationFailed: 'Operation failed',
    unauthorized: 'Unauthorized access'
  },
  permissions: {
    title: 'Permission Management',
    description: 'Manage user permissions and access control',
    resource: 'Resource',
    action: 'Action',
    granted: 'Granted',
    denied: 'Denied',
    roleDescriptions: {
      admin: 'Has full access to the system and can manage all features',
      manager: 'Can manage users and most system features, but cannot modify system settings',
      member: 'Can view and create content, but cannot manage other users',
      viewer: 'Can only view content, cannot make any modifications'
    }
  },
  menu: {
    home: 'Home',
    incident: 'Incidents',
    alert: 'Alerts',
    service: 'Services',
    settings: 'Settings',
    permissions: 'Permissions Demo'
  },
  common: {
    sort: 'Sort',
    status: 'Status',
    title: 'Title',
    actions: 'Actions',
    appName: 'Incident Management System',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    refresh: 'Refresh',
    clear: 'Clear',
    select: 'Select',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    expand: 'Expand',
    collapse: 'Collapse',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
    failed: 'Failed',
    completed: 'Completed',
    pending: 'Pending',
    processing: 'Processing',
    cancelled: 'Cancelled',
    expired: 'Expired',
    active: 'Active',
    inactive: 'Inactive',
    enabled: 'Enabled',
    disabled: 'Disabled',
    online: 'Online',
    offline: 'Offline',
    connected: 'Connected',
    disconnected: 'Disconnected',
    available: 'Available',
    unavailable: 'Unavailable',
    public: 'Public',
    private: 'Private',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    deleted: 'Deleted',
    all: 'All',
    none: 'None',
    other: 'Other',
    unknown: 'Unknown',
    optional: 'Optional',
    required: 'Required',
    recommended: 'Recommended',
    deprecated: 'Deprecated',
    beta: 'Beta',
    new: 'New',
    updated: 'Updated',
    createTime: "Created Time",
    updateTime: "Updated Time",
    profile: "Profile",
    goHome: 'Go Home'
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
  },
  auth: {
    login: 'Login',
    loginAccount: 'Login to your account',
    email: 'Email',
    emailRequired: 'Please enter your email address',
    password: 'Password',
    passwordRequired: 'Please enter your password',
    pleaseLogin: 'Please login to your account',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    welcomeBack: 'Welcome back',
    logout: 'Logout'
  }
}

export default en
