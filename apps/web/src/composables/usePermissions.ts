import { computed } from 'vue';
import { authClient } from '@/auth';
import { hasPermission, hasMinimumRole, getRoleLevel, getUserPermissions } from '@incidents/auth//access-control';

/**
 * 权限管理组合式函数
 * 基于 Better Auth Admin 插件的简化权限系统
 */
export function usePermissions() {
  // 获取当前用户
  const session = authClient.useSession();

  // 当前用户
  const currentUser = computed(() => session.value.data?.user || null);

  // 当前用户角色（从 Better Auth Admin 插件获取）
  const currentRole = computed(() => {
    return currentUser.value?.role || 'viewer';
  });

  // 当前用户权限级别
  const currentRoleLevel = computed(() => {
    return getRoleLevel(currentRole.value);
  });

  // 检查是否有指定权限
  const checkPermission = (resource: string, action: string): boolean => {
    if (!currentUser.value) return false;
    return hasPermission(currentRole.value, resource as any, action);
  };

  // 检查是否有最低角色要求
  const checkMinimumRole = (requiredRole: string): boolean => {
    if (!currentUser.value) return false;
    return hasMinimumRole(currentRole.value, requiredRole);
  };

  // 获取当前用户的所有权限
  const userPermissions = computed(() => {
    if (!currentUser.value) return [];
    return getUserPermissions(currentRole.value);
  });

  // 检查是否是管理员
  const isAdmin = computed(() => {
    return currentRole.value === 'admin';
  });

  // 检查是否是经理或更高级别
  const isManagerOrAbove = computed(() => {
    return checkMinimumRole('manager');
  });

  // 检查是否可以管理用户
  const canManageUsers = computed(() => {
    return checkPermission('user', 'update') || checkPermission('user', 'delete');
  });

  // 检查是否可以管理团队
  const canManageTeams = computed(() => {
    return checkPermission('team', 'manage_members');
  });

  // 检查是否可以管理事件
  const canManageIncidents = computed(() => {
    return checkPermission('incident', 'assign') || checkPermission('incident', 'resolve');
  });

  // 检查是否可以查看报告
  const canViewReports = computed(() => {
    return checkPermission('report', 'read');
  });

  // 检查是否可以导出报告
  const canExportReports = computed(() => {
    return checkPermission('report', 'export');
  });

  // 检查是否可以管理系统设置
  const canManageSettings = computed(() => {
    return checkPermission('settings', 'update');
  });

  return {
    // 用户信息
    currentUser,
    currentRole,
    currentRoleLevel,
    userPermissions,

    // 权限检查函数
    checkPermission,
    checkMinimumRole,

    // 便捷的权限检查
    isAdmin,
    isManagerOrAbove,
    canManageUsers,
    canManageTeams,
    canManageIncidents,
    canViewReports,
    canExportReports,
    canManageSettings,
  };
}
