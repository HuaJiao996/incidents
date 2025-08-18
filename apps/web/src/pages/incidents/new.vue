<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Apis, { Incident } from '@/api'

definePageMeta({
  title: 'Create Incident',
  icon: 'pi pi-exclamation-triangle',
})

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const services = ref([])
const incidentTypes = ref([])
const incident = ref<Partial<Incident>>({
  title: '',
  description: '',
  severity: 'P3',
  status: 'open',
  createdAt: new Date(),
})

const severityOptions = [
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
  { label: 'P4', value: 'P4' },
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

const fetchIncidentTypes = async () => {
  try {
    const response = await Apis.incidentType.findAll({
      params: { page: '1', pageSize: '100' }
    })
    incidentTypes.value = response.data.map((type: any) => ({
      label: type.name,
      value: type.id,
    }))
  } catch (error) {
    console.error('Error fetching incident types:', error)
  }
}

const createIncident = async () => {
  if (!incident.value.title) {
    return
  }
  
  loading.value = true
  try {
    const createdIncident = await Apis.incidents.createIncident(incident.value as Incident)
    router.push(`/incidents/${createdIncident.id}`)
  } catch (error) {
    console.error('Error creating incident:', error)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/incidents')
}

onMounted(() => {
  fetchServices()
  fetchIncidentTypes()
})
</script>

<template>
  <div class="create-incident-page">
    <div class="flex items-center gap-3 mb-6">
      <Button icon="pi pi-arrow-left" class="p-button-text" @click="router.push('/incidents')" />
      <h1 class="text-2xl font-bold">{{ t('incident.createNew') }}</h1>
    </div>
    
    <div class="card">
      <form @submit.prevent="createIncident" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('incident.title') }} *</label>
              <InputText v-model="incident.title" class="w-full" required />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('incident.description') }}</label>
              <Textarea v-model="incident.description" class="w-full" rows="6" />
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('incident.severity') }} *</label>
              <Dropdown 
                v-model="incident.severity" 
                :options="severityOptions" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('service.service') }}</label>
              <Dropdown 
                v-model="incident.serviceId" 
                :options="services" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                :placeholder="t('service.selectService')"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('incident.type') }}</label>
              <Dropdown 
                v-model="incident.typeId" 
                :options="incidentTypes" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full" 
                :placeholder="t('incident.selectType')"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">{{ t('incident.createdAt') }}</label>
              <Calendar v-model="incident.createdAt" showTime hourFormat="24" class="w-full" />
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