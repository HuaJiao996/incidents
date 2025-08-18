<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Alert, Incident } from '@/api'

definePageMeta({
  title: 'Alert Details',
  icon: 'pi pi-bell',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const alert = ref<Alert | null>(null)
const loading = ref(true)
const relatedIncidents = ref<Incident[]>([])
const showCreateIncidentDialog = ref(false)
const newIncident = ref<Partial<Incident>>({
  title: '',
  description: '',
  severity: 'P2',
  status: 'open',
})

const fetchAlert = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      throw new Error('Invalid alert ID')
    }
    
    alert.value = await Apis.alerts.getAlertDetail({ id })
    
    // 预填充新事件表单
    if (alert.value) {
      newIncident.value.title = `Incident from alert: ${alert.value.title}`
      newIncident.value.description = alert.value.description || ''
      newIncident.value.serviceId = alert.value.serviceId
      
      // 根据告警严重性设置事件严重性
      switch (alert.value.severity?.toLowerCase()) {
        case 'critical':
          newIncident.value.severity = 'P1'
          break
        case 'warning':
          newIncident.value.severity = 'P2'
          break
        case 'info':
          newIncident.value.severity = 'P3'
          break
      }
    }
    
    // 获取相关事件
    if (alert.value?.incidentId) {
      const incident = await Apis.incidents.getIncidentDetail({ id: alert.value.incidentId })
      relatedIncidents.value = [incident]
    } else {
      relatedIncidents.value = []
    }
  } catch (error) {
    console.error('Error fetching alert:', error)
  } finally {
    loading.value = false
  }
}

const resolveAlert = async () => {
  try {
    if (alert.value?.id) {
      await Apis.alerts.resolveAlert({ id: alert.value.id })
      await fetchAlert()
    }
  } catch (error) {
    console.error('Error resolving alert:', error)
  }
}

const createIncident = async () => {
  try {
    if (!newIncident.value.title) {
      return
    }
    
    const incident = await Apis.incidents.createIncident(newIncident.value as Incident)
    
    // 关联告警到事件
    if (alert.value?.id && incident.id) {
      await Apis.incidents.associateAlerts({ id: incident.id, alertIds: [alert.value.id] })
      await fetchAlert()
    }
    
    showCreateIncidentDialog.value = false
    router.push(`/incidents/${incident.id}`)
  } catch (error) {
    console.error('Error creating incident:', error)
  }
}

const linkToExistingIncident = async (incidentId: number) => {
  try {
    if (alert.value?.id) {
      await Apis.incidents.associateAlerts({ id: incidentId, alertIds: [alert.value.id] })
      await fetchAlert()
    }
  } catch (error) {
    console.error('Error linking to incident:', error)
  }
}

const getSeverityClass = (severity: string) => {
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
  switch (status?.toLowerCase()) {
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
  fetchAlert()
})
</script>

<template>
  <div class="alert-detail">
    <div v-if="loading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!alert" class="p-8 text-center">
      <h2 class="text-xl font-bold mb-4">{{ t('alert.notFound') }}</h2>
      <Button :label="t('common.backToList')" icon="pi pi-arrow-left" @click="router.push('/alerts')" />
    </div>
    
    <div v-else>
      <!-- 告警头部 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="router.push('/alerts')" />
          <h1 class="text-2xl font-bold">{{ alert.title }}</h1>
        </div>
        
        <div class="flex gap-2">
          <Button 
            v-if="alert.status !== 'resolved'" 
            :label="t('alert.resolve')" 
            icon="pi pi-check" 
            class="p-button-success" 
            @click="resolveAlert" 
          />
          <Button 
            v-if="!alert.incidentId" 
            :label="t('incident.create')" 
            icon="pi pi-plus" 
            @click="showCreateIncidentDialog = true" 
          />
        </div>
      </div>
      
      <!-- 告警详情 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="col-span-2">
          <div class="card">
            <h2 class="text-xl font-bold mb-4">{{ t('alert.details') }}</h2>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.severity') }}</div>
                <Tag :class="getSeverityClass(alert.severity)" :value="alert.severity" />
              </div>
              
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.status') }}</div>
                <Tag :class="getStatusClass(alert.status)" :value="alert.status" />
              </div>
              
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.source') }}</div>
                <div>{{ alert.source || t('common.notAvailable') }}</div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.timestamp') }}</div>
                <div>{{ formatDate(alert.timestamp) }}</div>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.description') }}</div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {{ alert.description || t('common.noDescription') }}
              </div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('alert.content') }}</div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap font-mono text-sm">
                {{ alert.content || t('common.noContent') }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-span-1">
          <div class="card mb-4">
            <h2 class="text-xl font-bold mb-4">{{ t('incident.relatedIncidents') }}</h2>
            
            <div v-if="relatedIncidents.length === 0" class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="mb-2">{{ t('incident.noRelatedIncidents') }}</div>
              <Button 
                :label="t('incident.linkToExisting')" 
                icon="pi pi-link" 
                class="p-button-sm p-button-outlined mb-2" 
                @click="router.push('/incidents?selectForAlert=' + alert.id)" 
              />
              <Button 
                :label="t('incident.createNew')" 
                icon="pi pi-plus" 
                class="p-button-sm" 
                @click="showCreateIncidentDialog = true" 
              />
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="incident in relatedIncidents" 
                :key="incident.id" 
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                @click="router.push(`/incidents/${incident.id}`)"
              >
                <div class="flex items-center gap-2 mb-1">
                  <Tag :class="getSeverityClass(incident.severity)" :value="incident.severity" />
                  <Tag :class="getStatusClass(incident.status)" :value="incident.status" />
                </div>
                <div class="font-medium">{{ incident.title }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(incident.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建事件对话框 -->
    <Dialog 
      v-model:visible="showCreateIncidentDialog" 
      :header="t('incident.create')" 
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('incident.title') }}</label>
          <InputText v-model="newIncident.title" class="w-full" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('incident.description') }}</label>
          <Textarea v-model="newIncident.description" class="w-full" rows="4" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('incident.severity') }}</label>
          <Dropdown 
            v-model="newIncident.severity" 
            :options="['P1', 'P2', 'P3', 'P4']" 
            class="w-full" 
          />
        </div>
      </div>
      
      <template #footer>
        <Button 
          :label="t('common.cancel')" 
          icon="pi pi-times" 
          class="p-button-text" 
          @click="showCreateIncidentDialog = false" 
        />
        <Button 
          :label="t('common.create')" 
          icon="pi pi-check" 
          @click="createIncident" 
        />
      </template>
    </Dialog>
  </div>
</template>