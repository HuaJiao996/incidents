<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Alert, AlertsQuery } from '@/api'
import AlertList from '@/components/alerts/AlertList.vue'

definePageMeta({
  title: 'Alerts',
  icon: 'pi pi-bell',
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const filters = ref<Partial<AlertsQuery>>({
  status: 'open',
  page: 1,
  pageSize: 10,
})

const severityOptions = [
  { label: t('common.all'), value: null },
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Info', value: 'info' },
]

const statusOptions = [
  { label: t('common.all'), value: null },
  { label: t('alert.status.open'), value: 'open' },
  { label: t('alert.status.resolved'), value: 'resolved' },
]

const handleAlertSelect = (alert: Alert) => {
  router.push(`/alerts/${alert.id}`)
}

const handleAlertResolve = async (alert: Alert) => {
  try {
    if (alert.id) {
      await Apis.alerts.resolveAlert({ id: alert.id })
      refreshAlerts()
    }
  } catch (error) {
    console.error('Error resolving alert:', error)
  }
}

const refreshAlerts = () => {
  // 刷新告警列表组件
  // 这里不需要做任何事情，因为AlertList组件会自己处理刷新
}

const handleFilterChange = () => {
  // 重置页码
  filters.value.page = 1
}

const createNewAlert = () => {
  router.push('/alerts/new')
}

onMounted(() => {
  // 如果URL中有查询参数，应用到过滤器
  const queryParams = route.query
  if (queryParams.status) filters.value.status = queryParams.status as string
  if (queryParams.severity) filters.value.severity = queryParams.severity as string
  if (queryParams.serviceId) filters.value.serviceId = Number(queryParams.serviceId)
  if (queryParams.source) filters.value.source = queryParams.source as string
  if (queryParams.search) filters.value.search = queryParams.search as string
})
</script>

<template>
  <div class="alerts-page">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ t('alert.alerts') }}</h1>
      <Button :label="t('alert.createNew')" icon="pi pi-plus" @click="createNewAlert" />
    </div>
    
    <!-- 过滤器 -->
    <div class="card mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('alert.status') }}</label>
          <Dropdown 
            v-model="filters.status" 
            :options="statusOptions" 
            optionLabel="label" 
            optionValue="value" 
            class="w-full" 
            @change="handleFilterChange"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('alert.severity') }}</label>
          <Dropdown 
            v-model="filters.severity" 
            :options="severityOptions" 
            optionLabel="label" 
            optionValue="value" 
            class="w-full" 
            @change="handleFilterChange"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('alert.source') }}</label>
          <InputText v-model="filters.source" class="w-full" @input="handleFilterChange" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('common.search') }}</label>
          <InputText v-model="filters.search" class="w-full" @input="handleFilterChange" />
        </div>
      </div>
    </div>
    
    <!-- 告警列表 -->
    <div class="card">
      <AlertList 
        :filter="filters" 
        :showPagination="true" 
        :showHeader="false" 
        :showActions="true" 
        @select="handleAlertSelect" 
        @resolve="handleAlertResolve" 
        @refresh="refreshAlerts"
      />
    </div>
  </div>
</template>