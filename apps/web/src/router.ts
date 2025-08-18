import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { authClient } from './auth'
import { hasPermission, hasMinimumRole } from '@incidents/auth/src/access-control'

console.log('Routes:', setupLayouts(routes))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

/**
 * 获取用户角色
 */
async function getUserRole(): Promise<string | null> {
  try {
    const session = await authClient.getSession()
    
    if (!session.data?.user) {
      return null
    }
    
    // 从用户会话中获取角色信息
    return session.data.user.role || 'viewer'
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * 检查路由权限
 */
function checkRoutePermissions(to: any, userRole: string | null): boolean {
  // 如果路由没有定义权限要求，默认允许访问
  if (!to.meta?.permissions && !to.meta?.role) {
    return true
  }
  
  // 如果没有用户角色，拒绝访问
  if (!userRole) {
    return false
  }
  
  // 检查角色要求
  if (to.meta.role) {
    return hasMinimumRole(userRole, to.meta.role)
  }
  
  // 检查权限要求
  if (to.meta.permissions) {
    const permissions = Array.isArray(to.meta.permissions) 
      ? to.meta.permissions 
      : [to.meta.permissions]
    
    return permissions.some((permission: any) => {
      if (typeof permission === 'object' && permission.resource && permission.action) {
        return hasPermission(userRole, permission.resource, permission.action)
      }
      return false
    })
  }
  
  return true
}

/**
 * 路由前置守卫
 * 处理用户认证和权限检查
 */
router.beforeEach(async (to, from) => {
  const session = await authClient.getSession().catch(() => null)
  console.log('Session:', session)
  console.log('Navigating from:', from.path, 'to:', to.path)

  // 通过auth字段的存在性判断是否为公开页面
  // 有auth字段表示需要登录，没有auth字段表示公开页面
  const isPublicPage = !to.meta?.auth

  // 公开页面处理（包括登录页面）
  if (isPublicPage) {
    // 对于登录页面，如果已登录则重定向
    if (to.path.includes('/login') && session?.data) {
      const redirect = (to.query.redirect as string) || '/'
      return redirect
    }
    
    return true
  }

  // 未登录处理
  if (!session?.data) {
    // 未登录，跳转到登录页
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 权限检查
  try {
    const userRole = await getUserRole()
    console.log('User role:', userRole)
    
    if (!checkRoutePermissions(to, userRole)) {
      console.warn('Access denied: insufficient permissions for route', to.path)
      // 权限不足，可以跳转到无权限页面或显示错误
      return { path: '/403' } // 需要创建403页面
    }
  } catch (error) {
    console.error('Error checking permissions:', error)
    // 权限检查失败，为了安全起见拒绝访问
    return { path: '/error' }
  }

  return true
})

export { router }
