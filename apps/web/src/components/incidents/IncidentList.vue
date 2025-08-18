<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Apis, { Incident, IncidentsQuery } from '@/api'

const { t } = useI18n()

const props = defineProps<{
  filter?: Partial<IncidentsQuery>
  limit?: number
  showPagination?: boolean
  showHeader?: boolean
  showActions?: boolean
  emptyMessage?: string
}>()

const emit = defineEmits<{
  'select': [incident: Incident]
  'acknowledge': [incident: Incident]
  'resolve': [incident: Incident]
  'refresh': []
}>()

const incidents = ref<Incident[]>([])
const loading = ref(true)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(props.limit || 10)

const query = computed(() => ({
  page: currentPage.value,
  pageSize: pageSize.value,
  ...props.filter,
}))

const fetchIncidents = async () => {
  loading.value = true
  try {
    const response = await Apis.incidents.getIncidents(query.value)
    incidents.value = response.incidents
    total.value = response.total
  } catch (error) {
    console.error('Error fetching incidents:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSelect = (incident: Incident) => {
  emit('select', incident)
}

const handleAcknowledge = async (incident: Incident) => {
  try {
    if (incident.id) {
      await Apis.incidents.acknowledgeIncident({ id: incident.id })
      emit('acknowledge', incident)
      fetchIncidents()
    }
  } catch (error) {
    console.error('Error acknowledging incident:', error)
  }
}

const handleResolve = async (incident: Incident) => {
  try {
    if (incident.id) {
      await Apis.incidents.resolveIncident({ id: incident.id })
      emit('resolve', incident)
      fetchIncidents()
    }
  } catch (error) {
    console.error('Error resolving incident:', error)
  }
}

const refresh = () => {
  fetchIncidents()
  emit('refresh')
}

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'P1':
      return 'bg-red-500'
    case 'P2':
      return 'bg-orange-500'
    case 'P3':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-red-500'
    case 'acknowledged':
      return 'bg-orange-500'
    case 'resolved':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

watch(() => props.filter, fetchIncidents, { deep: true })

onMounted(() => {
  fetchIncidents()
})
</script>

<template>
  <div class="incident-list">
    <div v-if="showHeader" class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ t('incident.title') }}</h2>
      <Button icon="pi pi-refresh" @click="refresh" :loading="loading" />
    </div>

    <DataTable
      :value="incidents"
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
      <Column field="severity" :header="t('incident.severity')" style="width: 80px">
        <template #body="{ data }">
          <Tag :class="getSeverityClass(data.severity)" :value="data.severity" />
        </template>
      </Column>
      
      <Column field="status" :header="t('incident.status')" style="width: 120px">
        <template #body="{ data }">
          <Tag :class="getStatusClass(data.status)" :value="t(`incident.status.${data.status}`)" />
        </template>
      </Column>
      
      <Column field="title" :header="t('incident.title')">
        <template #body="{ data }">
          <div class="cursor-pointer" @click="handleSelect(data)">
            <div class="font-medium">{{ data.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ data.description }}
            </div>
          </div>
        </template>
      </Column>
      
      <Column field="createdAt" :header="t('incident.createdAt')" style="width: 180px">
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>
      
      <Column v-if="showActions" :header="t('common.actions')" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-sm"
              @click="handleSelect(data)"
              :title="t('common.view')"
            />
            <Button
              v-if="data.status === 'open'"
              icon="pi pi-bell"
              class="p-button-text p-button-sm p-button-warning"
              @click="handleAcknowledge(data)"
              :title="t('incident.acknowledge')"
            />
            <Button
              v-if="data.status !== 'resolved'"
              icon="pi pi-check"
              class="p-button-text p-button-sm p-button-success"
              @click="handleResolve(data)"
              :title="t('incident.resolve')"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>