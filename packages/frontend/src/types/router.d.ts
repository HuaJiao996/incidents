import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    menu?: {
      title: string
      icon?: string
      order?: number
    }
  }
} 