<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Incident, IncidentsQuery } from '@/api'
import IncidentList from '@/components/incidents/IncidentList.vue'

definePageMeta({
  title: 'Incidents',
  icon: 'pi pi-exclamation-triangle',
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const filters = ref<Partial<IncidentsQuery>>({
  status: 'open',
  page: 1,
  pageSize: 10,
})

const severityOptions = [
  { label: t('common.all'), value: null },
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
  { label: 'P4', value: 'P4' },
]

const statusOptions = [
  { label: t('common.all'), value: null },
  { label: t('incident.status.open'), value: 'open' },
  { label: t('incident.status.acknowledged'), value: 'acknowledged' },
  { label: t('incident.status.resolved'), value: 'resolved' },
]

const handleIncidentSelect = (incident: Incident) => {
  router.push(`/incidents/${incident.id}`)
}

const handleIncidentAcknowledge = async (incident: Incident) => {
  try {
    if (incident.id) {
      await Apis.incidents.acknowledgeIncident({ id: incident.id })
      refreshIncidents()
    }
  } catch (error) {
    console.error('Error acknowledging incident:', error)
  }
}

const handleIncidentResolve = async (incident: Incident) => {
  try {
    if (incident.id) {
      await Apis.incidents.resolveIncident({ id: incident.id })
      refreshIncidents()
    }
  } catch (error) {
    console.error('Error resolving incident:', error)
  }
}

const refreshIncidents = () => {
  // 刷新事件列表组件
  // 这里不需要做任何事情，因为IncidentList组件会自己处理刷新
}

const handleFilterChange = () => {
  // 重置页码
  filters.value.page = 1
}

const createNewIncident = () => {
  router.push('/incidents/new')
}

onMounted(() => {
  // 如果URL中有查询参数，应用到过滤器
  const queryParams = route.query
  if (queryParams.status) filters.value.status = queryParams.status as string
  if (queryParams.severity) filters.value.severity = queryParams.severity as string
  if (queryParams.serviceId) filters.value.serviceId = Number(queryParams.serviceId)
  if (queryParams.typeId) filters.value.typeId = Number(queryParams.typeId)
  if (queryParams.search) filters.value.search = queryParams.search as string
})
</script>

<template>
  <div class="incidents-page">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ t('incident.incidents') }}</h1>
      <Button :label="t('incident.createNew')" icon="pi pi-plus" @click="createNewIncident" />
    </div>
    
    <!-- 过滤器 -->
    <div class="card mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('incident.status') }}</label>
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
          <label class="block text-sm font-medium mb-1">{{ t('incident.severity') }}</label>
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
          <label class="block text-sm font-medium mb-1">{{ t('common.startDate') }}</label>
          <Calendar v-model="filters.startDate" dateFormat="yy-mm-dd" class="w-full" @date-select="handleFilterChange" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('common.search') }}</label>
          <InputText v-model="filters.search" class="w-full" @input="handleFilterChange" />
        </div>
      </div>
    </div>
    
    <!-- 事件列表 -->
    <div class="card">
      <IncidentList 
        :filter="filters" 
        :showPagination="true" 
        :showHeader="false" 
        :showActions="true" 
        @select="handleIncidentSelect" 
        @acknowledge="handleIncidentAcknowledge" 
        @resolve="handleIncidentResolve" 
        @refresh="refreshIncidents"
      />
    </div>
  </div>
</template>