<template>
  <PermissionGuard resource="user" action="read">
    <div class="container mx-auto p-6">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('users.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ $t('users.description') }}
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          :value="users"
          :loading="loading"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
          class="p-datatable-sm"
        >
          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-users text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400">{{ $t('common.noData') }}</p>
            </div>
          </template>

          <Column field="name" :header="$t('users.name')" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <img
                  v-if="data.image"
                  :src="data.image"
                  :alt="data.name"
                  class="w-8 h-8 rounded-full mr-3"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3"
                >
                  <i class="pi pi-user text-gray-500 dark:text-gray-400"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ data.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ data.email }}</div>
                </div>
              </div>
            </template>
          </Column>

          <Column field="role" :header="$t('users.role')" sortable>
            <template #body="{ data }">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getRoleClass(data.role)"
              >
                {{ $t(`roles.${data.role}`) }}
              </span>
            </template>
          </Column>

          <Column field="status" :header="$t('users.status')" sortable>
            <template #body="{ data }">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': data.status === 'active',
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': data.status === 'inactive',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': data.status === 'pending'
                }"
              >
                {{ $t(`users.statuses.${data.status}`) }}
              </span>
            </template>
          </Column>

          <Column field="lastLogin" :header="$t('users.lastLogin')" sortable>
            <template #body="{ data }">
              <span v-if="data.lastLogin" class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(data.lastLogin) }}
              </span>
              <span v-else class="text-sm text-gray-400 dark:text-gray-500">
                {{ $t('users.neverLoggedIn') }}
              </span>
            </template>
          </Column>

          <Column :header="$t('common.actions')" style="width: 120px">
            <template #body="{ data }">
              <div class="flex space-x-2">
                <PermissionGuard resource="user" action="update">
                  <button
                    v-if="canEditUser(data)"
                    @click="editUser(data)"
                    class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    :title="$t('users.editUser')"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                </PermissionGuard>
                <PermissionGuard resource="user" action="delete">
                  <button
                    v-if="canDeleteUser(data)"
                    @click="confirmDelete(data)"
                    class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    :title="$t('users.deleteUser')"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </PermissionGuard>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Edit User Dialog -->
      <Dialog
        v-model:visible="editDialog"
        :header="$t('users.editUser')"
        modal
        style="width: 450px"
      >
        <form @submit.prevent="updateUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('users.role') }}
            </label>
            <select
              v-model="editForm.role"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option
                v-for="role in getAvailableRolesForEdit(selectedUser)"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
            <p v-if="editForm.role" class="mt-1 text-sm text-gray-500">
              {{ getRoleDescription(editForm.role) }}
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="editDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="updateLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <i v-if="updateLoading" class="pi pi-spin pi-spinner mr-2"></i>
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </Dialog>

      <!-- Delete Confirmation Dialog -->
      <Dialog
        v-model:visible="deleteDialog"
        :header="$t('users.deleteConfirmTitle')"
        modal
        style="width: 450px"
      >
        <div class="flex items-center mb-4">
          <i class="pi pi-exclamation-triangle text-orange-500 text-2xl mr-3"></i>
          <span>{{ $t('users.deleteConfirmMessage', { name: selectedUser?.name }) }}</span>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="deleteDialog = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="deleteUser"
            :disabled="deleteLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50"
          >
            <i v-if="deleteLoading" class="pi pi-spin pi-spinner mr-2"></i>
            {{ $t('common.delete') }}
          </button>
        </div>
      </Dialog>
    </div>
  </PermissionGuard>

  <!-- 无权限时显示的内容 -->
  <PermissionGuard resource="user" action="read" fallback>
    <div class="container mx-auto p-6">
      <div class="text-center">
        <i class="pi pi-lock text-4xl text-red-500 mb-4"></i>
        <h2 class="text-xl font-semibold mb-2">{{ $t('error.insufficientPermissions') }}</h2>
        <p class="text-gray-600">{{ $t('error.permissionRequired', { permission: $t('permissions.actions.read') }) }}</p>
      </div>
    </div>
  </PermissionGuard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import { authClient } from '@/auth'
import { usePermissions } from '@/composables/usePermissions'
import PermissionGuard from '@/components/PermissionGuard.vue'

definePage({
  meta: {
    title: 'users.title',
    icon: 'pi pi-users',
    menu: {
      title: 'users.title',
      icon: 'pi pi-users',
      order: 6
    },
    requiresAuth: true,
    permissions: {
      resource: 'user',
      action: 'read'
    }
  }
})

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'admin' | 'manager' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  joinedAt: string
}

const { t } = useI18n()
const toast = useToast()
const { currentRole, checkMinimumRole, currentUser } = usePermissions()

const loading = ref(false)
const updateLoading = ref(false)
const deleteLoading = ref(false)
const users = ref<User[]>([])

const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<User | null>(null)

const editForm = reactive({
  role: ''
})

// 角色样式映射
const getRoleClass = (role: string) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    member: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[role as keyof typeof classes] || classes.viewer
}

// 获取角色描述
const getRoleDescription = (role: string) => {
  const descriptions = {
    viewer: t('permissions.roleDescriptions.viewer'),
    member: t('permissions.roleDescriptions.member'),
    manager: t('permissions.roleDescriptions.manager'),
    admin: t('permissions.roleDescriptions.admin')
  }
  return descriptions[role as keyof typeof descriptions] || ''
}

// 检查是否可以编辑用户
const canEditUser = (user: User) => {
  // 不能编辑自己
  if (user.id === currentUser.value?.id) return false

  // 只有更高级别的角色才能编辑
  const roleHierarchy = ['viewer', 'member', 'manager', 'admin']
  const currentRoleIndex = roleHierarchy.indexOf(currentRole.value || 'viewer')
  const targetRoleIndex = roleHierarchy.indexOf(user.role)

  return currentRoleIndex > targetRoleIndex
}

// 检查是否可以删除用户
const canDeleteUser = (user: User) => {
  // 不能删除自己
  if (user.id === currentUser.value?.id) return false

  // 不能删除管理员（除非自己也是管理员）
  if (user.role === 'admin' && currentRole.value !== 'admin') return false

  // 只有管理员及以上可以删除用户
  if (!checkMinimumRole('admin')) return false

  // 只有更高级别的角色才能删除
  const roleHierarchy = ['viewer', 'member', 'manager', 'admin']
  const currentRoleIndex = roleHierarchy.indexOf(currentRole.value || 'viewer')
  const targetRoleIndex = roleHierarchy.indexOf(user.role)

  return currentRoleIndex > targetRoleIndex
}

// 获取编辑时可用的角色
const getAvailableRolesForEdit = (user: User | null) => {
  if (!user) return []

  const roles = [
    { value: 'viewer', label: t('roles.viewer') },
    { value: 'member', label: t('roles.member') }
  ]

  // 管理员及以上可以分配管理员角色
  if (checkMinimumRole('manager')) {
    roles.push({ value: 'manager', label: t('roles.manager') })
  }

  // 管理员及以上可以分配管理员角色
  if (checkMinimumRole('admin')) {
    roles.push({ value: 'admin', label: t('roles.admin') })
  }

  // 只有所有者可以分配所有者角色，且不能将自己的所有者角色转让给别人
  if (currentRole.value === 'owner' && user.id !== currentUser.value?.id) {
    roles.push({ value: 'owner', label: t('roles.owner') })
  }

  // 过滤掉比当前用户角色更高的选项
  const roleHierarchy = ['viewer', 'member', 'manager', 'admin', 'owner']
  const currentRoleIndex = roleHierarchy.indexOf(currentRole.value || 'viewer')

  return roles.filter(role => {
    const roleIndex = roleHierarchy.indexOf(role.value)
    return roleIndex <= currentRoleIndex
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const loadUsers = async () => {
  loading.value = true
  try {
    // 使用 Admin 插件的用户管理功能
    const response = await authClient.admin.listUsers({
      query: {
      }
    })
    if (response.data) {
      users.value = response.data.users.map((user) => ({
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        image: user.image,
        role: user.role || 'viewer',
        status: user.banned ? 'inactive' : 'active',
        lastLogin: user.lastLogin,
        joinedAt: user.createdAt
      }))
    }
  } catch (error: any) {
    console.error('Load users error:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.message || t('common.unknownError'),
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const editUser = (user: User) => {
  selectedUser.value = user
  editForm.role = user.role
  editDialog.value = true
}

const updateUser = async () => {
  if (!selectedUser.value) return

  updateLoading.value = true
  try {
    // 使用 Admin 插件更新用户角色
    await authClient.admin.updateUser(selectedUser.value.id, {
      role: editForm.role
    })

    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('users.roleUpdated'),
      life: 3000
    })

    editDialog.value = false
    await loadUsers()
  } catch (error: any) {
    console.error('Update user error:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.message || t('users.updateFailed'),
      life: 5000
    })
  } finally {
    updateLoading.value = false
  }
}

const confirmDelete = (user: User) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  if (!selectedUser.value) return

  deleteLoading.value = true
  try {
    // 使用 Admin 插件删除用户
    await authClient.admin.deleteUser(selectedUser.value.id)

    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('users.userRemoved'),
      life: 3000
    })

    deleteDialog.value = false
    await loadUsers()
  } catch (error: any) {
    console.error('Delete user error:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.message || t('users.deleteFailed'),
      life: 5000
    })
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
