<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Apis, { Alert, AlertsQuery } from '@/api'

const { t } = useI18n()

const props = defineProps<{
  filter?: Partial<AlertsQuery>
  limit?: number
  showPagination?: boolean
  showHeader?: boolean
  showActions?: boolean
  emptyMessage?: string
}>()

const emit = defineEmits<{
  'select': [alert: Alert]
  'resolve': [alert: Alert]
  'refresh': []
}>()

const alerts = ref<Alert[]>([])
const loading = ref(true)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(props.limit || 10)

const query = computed(() => ({
  page: currentPage.value,
  pageSize: pageSize.value,
  ...props.filter,
}))

const fetchAlerts = async () => {
  loading.value = true
  try {
    const response = await Apis.alerts.getAlerts(query.value)
    alerts.value = response.alerts
    total.value = response.total
  } catch (error) {
    console.error('Error fetching alerts:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSelect = (alert: Alert) => {
  emit('select', alert)
}

const handleResolve = async (alert: Alert) => {
  try {
    if (alert.id) {
      await Apis.alerts.resolveAlert({ id: alert.id })
      emit('resolve', alert)
      fetchAlerts()
    }
  } catch (error) {
    console.error('Error resolving alert:', error)
  }
}

const refresh = () => {
  fetchAlerts()
  emit('refresh')
}

const getSeverityClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-500'
    case 'warning':
      return 'bg-orange-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

watch(() => props.filter, fetchAlerts, { deep: true })

onMounted(() => {
  fetchAlerts()
})
</script>

<template>
  <div class="alert-list">
    <div v-if="showHeader" class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ t('alert.title') }}</h2>
      <Button icon="pi pi-refresh" @click="refresh" :loading="loading" />
    </div>

    <DataTable
      :value="alerts"
      :loading="loading"
      :paginator="showPagination"
      :rows="pageSize"
      :totalRecords="total"
      @page="handlePageChange($event.page)"
      :rowHover="true"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      :emptyMessage="props.emptyMessage || t('common.noData')"
    >
      <Column field="severity" :header="t('alert.severity')" style="width: 100px">
        <template #body="{ data }">
          <Tag :class="getSeverityClass(data.severity)" :value="data.severity.toUpperCase()" />
        </template>
      </Column>
      
      <Column field="title" :header="t('alert.title')">
        <template #body="{ data }">
          <div class="cursor-pointer" @click="handleSelect(data)">
            <div class="font-medium">{{ data.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ data.description }}
            </div>
          </div>
        </template>
      </Column>
      
      <Column field="source" :header="t('alert.source')" style="width: 120px" />
      
      <Column field="timestamp" :header="t('alert.timestamp')" style="width: 180px">
        <template #body="{ data }">
          {{ formatDate(data.timestamp) }}
        </template>
      </Column>
      
      <Column v-if="showActions" :header="t('common.actions')" style="width: 100px">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm"
              @click="handleSelect(data)"
              :title="t('common.view')"
            />
            <Button
              v-if="data.status !== 'resolved'"
              icon="pi pi-check"
              class="p-button-text p-button-sm p-button-success"
              @click="handleResolve(data)"
              :title="t('alert.resolve')"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>