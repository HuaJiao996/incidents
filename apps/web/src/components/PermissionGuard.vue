<script setup lang="ts">
import { usePermissions, type Permission } from '@/composables/usePermissions';
import { computed } from 'vue';

interface Props {
  /**
   * 需要的权限列表
   */
  permissions?: Permission[];
  
  /**
   * 单个权限 - 资源
   */
  resource?: Permission['resource'];
  
  /**
   * 单个权限 - 操作
   */
  action?: Permission['action'];
  
  /**
   * 最低角色要求
   */
  role?: string;
  
  /**
   * 权限检查模式
   * - 'any': 拥有任意一个权限即可 (默认)
   * - 'all': 需要拥有所有权限
   */
  mode?: 'any' | 'all';
  
  /**
   * 当没有权限时显示的内容
   */
  fallback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'any',
  fallback: false,
});

const { can, canAny, canAll, hasRole } = usePermissions();

/**
 * 检查是否有权限
 */
const hasPermission = computed(() => {
  // 如果指定了角色要求，检查角色
  if (props.role) {
    return hasRole(props.role as any);
  }
  
  // 如果指定了单个权限
  if (props.resource && props.action) {
    return can(props.resource, props.action);
  }
  
  // 如果指定了权限列表
  if (props.permissions && props.permissions.length > 0) {
    return props.mode === 'all' 
      ? canAll(props.permissions)
      : canAny(props.permissions);
  }
  
  // 默认允许访问
  return true;
});

/**
 * 是否显示内容
 */
const shouldShow = computed(() => {
  return props.fallback ? !hasPermission.value : hasPermission.value;
});
</script>

<template>
  <div v-if="shouldShow">
    <slot />
  </div>
</template>