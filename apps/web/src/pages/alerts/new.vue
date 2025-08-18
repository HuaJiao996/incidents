<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Alert } from '@/api'

definePageMeta({
  title: 'Create Alert',
  icon: 'pi pi-bell',
})

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const services = ref([])
const alert = ref<Partial<Alert>>({
  title: '',
  description: '',
  content: '',
  severity: 'warning',
  status: 'open',
  source: 'manual',
  timestamp: new Date(),
})

const severityOptions = [
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Info', value: 'info' },
]

const fetchServices = async () => {
  try {
    const response = await Apis.service.findAll({
      params: { page: '1', pageSize: '100' }
    })
    services.value = response.data.map((service: any) => ({
      label: service.name,
      value: service.id,
    }))
  } catch (error) {
    console.error('Error fetching services:', error)
  }
}

const createAlert = async () => {
  if (!alert.value.title) {
    return
  }
  
  loading.value = true
  try {
    const createdAlert = await Apis.alerts.createAlert(alert.value as Alert)
    router.push(`/alerts/${createdAlert.id}`)
  } catch (error) {
    console.error('Error creating alert:', error)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/alerts')
}

onMounted(() => {
  fetchServices()
})
</script>

<template>
  <div class="create-alert-page">
    <div class="flex items-center gap-3 mb-6">
      <Button icon="pi pi-arrow-left" class="p-button-text" @click="router.push('/alerts')" />
      <h1 class="text-2xl font-bold">{{ t('alert.createNew') }}</h1>
    </div>
    
    <div class="card">
      <form @submit.prevent="createAlert" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.title') }} *</label>
              <InputText v-model="alert.title" class="w-full" required />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.description') }}</label>
              <Textarea v-model="alert.description" class="w-full" rows="3" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.content') }}</label>
              <Textarea v-model="alert.content" class="w-full" rows="6" />
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.severity') }} *</label>
              <Dropdown 
                v-model="alert.severity" 
                :options="severityOptions" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.source') }}</label>
              <InputText v-model="alert.source" class="w-full" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('alert.timestamp') }}</label>
              <Calendar v-model="alert.timestamp" showTime hourFormat="24" class="w-full" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('service.service') }}</label>
              <Dropdown 
                v-model="alert.serviceId" 
                :options="services" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                :placeholder="t('service.selectService')"
              />
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <Button 
            :label="t('common.cancel')" 
            icon="pi pi-times" 
            class="p-button-text" 
            type="button" 
            @click="cancel" 
          />
          <Button 
            :label="t('common.create')" 
            icon="pi pi-check" 
            type="submit" 
            :loading="loading" 
          />
        </div>
      </form>
    </div>
  </div>
</template>