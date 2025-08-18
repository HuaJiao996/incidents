import 'vue-router'

export {}

/**
 * 页面布局类型
 */
export type LayoutType = 'default' | 'public'

/**
 * 扩展 Vue Router 的 RouteMeta 接口
 * 添加项目中使用的路由元数据类型定义
 */
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面布局类型
     * - 'default': 默认布局，需要登录认证
     * - 'public': 公开布局，无需登录认证
     */
    layout?: LayoutType
    
    /**
     * 页面标题
     */
    title?: string
    
    /**
     * 页面图标
     */
    icon?: string
    
    /**
     * 菜单配置
     */
    menu?: {
      /** 菜单标题 */
      title: string
      /** 菜单图标 */
      icon?: string
      /** 菜单排序 */
      order?: number
      /** 是否隐藏菜单 */
      hidden?: boolean
    }
    
    /**
     * 权限配置
     */
    auth?: {
      /** 需要的角色 */
      roles?: string[]
      /** 需要的权限 */
      permissions?: string[]
    }
    
    /**
     * 页面缓存配置
     */
    keepAlive?: boolean
    
    /**
     * 面包屑配置
     */
    breadcrumb?: {
      /** 是否显示面包屑 */
      show?: boolean
      /** 自定义面包屑标题 */
      title?: string
    }
  }
}