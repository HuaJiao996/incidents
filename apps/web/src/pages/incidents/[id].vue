<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Incident, Alert } from '@/api'

definePageMeta({
  title: 'Incident Details',
  icon: 'pi pi-exclamation-triangle',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const incident = ref<Incident | null>(null)
const loading = ref(true)
const relatedAlerts = ref<Alert[]>([])
const showAddAlertDialog = ref(false)
const availableAlerts = ref<Alert[]>([])
const selectedAlertIds = ref<number[]>([])

const fetchIncident = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      throw new Error('Invalid incident ID')
    }
    
    incident.value = await Apis.incidents.getIncidentDetail({ id })
    
    // 获取相关告警
    if (incident.value?.id) {
      // 这里假设API支持通过incidentId查询告警
      const response = await Apis.alerts.getAlerts({ incidentId: incident.value.id })
      relatedAlerts.value = response.alerts
    }
  } catch (error) {
    console.error('Error fetching incident:', error)
  } finally {
    loading.value = false
  }
}

const fetchAvailableAlerts = async () => {
  try {
    // 获取未关联到事件的告警
    const response = await Apis.alerts.getAlerts({ incidentId: null })
    availableAlerts.value = response.alerts
  } catch (error) {
    console.error('Error fetching available alerts:', error)
  }
}

const resolveIncident = async () => {
  try {
    if (incident.value?.id) {
      await Apis.incidents.resolveIncident({ id: incident.value.id })
      await fetchIncident()
    }
  } catch (error) {
    console.error('Error resolving incident:', error)
  }
}

const acknowledgeIncident = async () => {
  try {
    if (incident.value?.id) {
      await Apis.incidents.acknowledgeIncident({ id: incident.value.id })
      await fetchIncident()
    }
  } catch (error) {
    console.error('Error acknowledging incident:', error)
  }
}

const addAlerts = async () => {
  try {
    if (incident.value?.id && selectedAlertIds.value.length > 0) {
      await Apis.incidents.associateAlerts({ 
        id: incident.value.id, 
        alertIds: selectedAlertIds.value 
      })
      await fetchIncident()
      showAddAlertDialog.value = false
      selectedAlertIds.value = []
    }
  } catch (error) {
    console.error('Error adding alerts to incident:', error)
  }
}

const openAddAlertDialog = async () => {
  await fetchAvailableAlerts()
  showAddAlertDialog.value = true
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

const getAlertSeverityClass = (severity: string) => {
  switch (severity?.toLowerCase()) {
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

onMounted(() => {
  fetchIncident()
})
</script>

<template>
  <div class="incident-detail">
    <div v-if="loading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!incident" class="p-8 text-center">
      <h2 class="text-xl font-bold mb-4">{{ t('incident.notFound') }}</h2>
      <Button :label="t('common.backToList')" icon="pi pi-arrow-left" @click="router.push('/incidents')" />
    </div>
    
    <div v-else>
      <!-- 事件头部 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="router.push('/incidents')" />
          <h1 class="text-2xl font-bold">{{ incident.title }}</h1>
        </div>
        
        <div class="flex gap-2">
          <Button 
            v-if="incident.status === 'open'" 
            :label="t('incident.acknowledge')" 
            icon="pi pi-bell" 
            class="p-button-warning" 
            @click="acknowledgeIncident" 
          />
          <Button 
            v-if="incident.status !== 'resolved'" 
            :label="t('incident.resolve')" 
            icon="pi pi-check" 
            class="p-button-success" 
            @click="resolveIncident" 
          />
        </div>
      </div>
      
      <!-- 事件详情 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="col-span-2">
          <div class="card">
            <h2 class="text-xl font-bold mb-4">{{ t('incident.details') }}</h2>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.severity') }}</div>
                <Tag :class="getSeverityClass(incident.severity)" :value="incident.severity" />
              </div>
              
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.status') }}</div>
                <Tag :class="getStatusClass(incident.status)" :value="incident.status" />
              </div>
              
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.createdAt') }}</div>
                <div>{{ formatDate(incident.createdAt) }}</div>
              </div>
              
              <div v-if="incident.acknowledgedAt">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.acknowledgedAt') }}</div>
                <div>{{ formatDate(incident.acknowledgedAt) }}</div>
              </div>
              
              <div v-if="incident.resolvedAt">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.resolvedAt') }}</div>
                <div>{{ formatDate(incident.resolvedAt) }}</div>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('incident.description') }}</div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {{ incident.description || t('common.noDescription') }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-span-1">
          <div class="card mb-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">{{ t('alert.relatedAlerts') }}</h2>
              <Button 
                icon="pi pi-plus" 
                class="p-button-sm" 
                @click="openAddAlertDialog" 
                :disabled="incident.status === 'resolved'"
              />
            </div>
            
            <div v-if="relatedAlerts.length === 0" class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>{{ t('alert.noRelatedAlerts') }}</div>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="alert in relatedAlerts" 
                :key="alert.id" 
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                @click="router.push(`/alerts/${alert.id}`)"
              >
                <div class="flex items-center gap-2 mb-1">
                  <Tag :class="getAlertSeverityClass(alert.severity)" :value="alert.severity" />
                  <Tag :class="getStatusClass(alert.status)" :value="alert.status" />
                </div>
                <div class="font-medium">{{ alert.title }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(alert.timestamp || alert.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加告警对话框 -->
    <Dialog 
      v-model:visible="showAddAlertDialog" 
      :header="t('alert.addToIncident')" 
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div v-if="availableAlerts.length === 0" class="text-center p-4">
        <div>{{ t('alert.noAvailableAlerts') }}</div>
      </div>
      
      <div v-else>
        <DataTable 
          :value="availableAlerts" 
          v-model:selection="selectedAlertIds" 
          dataKey="id"
          class="p-datatable-sm"
        >
          <Column selectionMode="multiple" style="width: 50px" />
          
          <Column field="severity" :header="t('alert.severity')" style="width: 100px">
            <template #body="{ data }">
              <Tag :class="getAlertSeverityClass(data.severity)" :value="data.severity" />
            </template>
          </Column>
          
          <Column field="title" :header="t('alert.title')">
            <template #body="{ data }">
              <div class="font-medium">{{ data.title }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ data.description }}
              </div>
            </template>
          </Column>
          
          <Column field="timestamp" :header="t('alert.timestamp')" style="width: 180px">
            <template #body="{ data }">
              {{ formatDate(data.timestamp || data.createdAt) }}
            </template>
          </Column>
        </DataTable>
      </div>
      
      <template #footer>
        <Button 
          :label="t('common.cancel')" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="showAddAlertDialog = false" 
        />
        <Button 
          :label="t('common.add')" 
          icon="pi pi-plus" 
          :disabled="selectedAlertIds.length === 0"
          @click="addAlerts" 
        />
      </template>
    </Dialog>
  </div>
</template>