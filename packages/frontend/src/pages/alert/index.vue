<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DataTable, { type DataTableSortMeta } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import { usePagination } from 'alova/client'
import Apis from '@/api'
import { startOfDay, endOfDay, format } from 'date-fns'
import type { AlertWithServiceDto } from '@/api/globals'

const { t } = useI18n()
const router = useRouter()

const dialogVisible = ref(false)
const selectedAlert = ref<AlertWithServiceDto>()

const multiSortMeta = ref<DataTableSortMeta[]>([])
const filters = ref({
  service: '',
  title: '',
  incidentId: '',
  dateRange: [startOfDay(new Date()), endOfDay(new Date())]
})

const multiSort = computed(() => multiSortMeta.value?.map(item => item.field).join(','))
const multiSortOrders = computed(() => multiSortMeta.value?.map(item => item.order === 1 ? 'asc' : 'desc').join(','))

const {
  data: alerts,
  loading,
  page,
  pageSize,
  pageCount,
  total,
} = usePagination((page, pageSize) => Apis.alert.findAll({
  params: {
    page: String(page),
    pageSize: String(pageSize),
    sortFields: multiSort.value,
    sortOrders: multiSortOrders.value,
    titleValue: filters.value.title,
    serviceValue: filters.value.service,
    incidentIdValue: filters.value.incidentId,
    startTime: filters.value.dateRange[0] ? format(filters.value.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
    endTime: filters.value.dateRange[1] ? format(filters.value.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
  }
}), {
  watchingStates: [multiSort, multiSortOrders, filters],
  debounce: 1000,
})

const first = computed({
  get() {
    return (page.value - 1) * pageSize.value
  },
  set(v) {
    page.value = (v + pageSize.value) / pageSize.value
  },
})

const rows = computed({
  get() {
    return pageSize.value
  },
  set(v) {
    if (v !== pageSize.value) {
      page.value = 1
      pageSize.value = v
    }
  },
})

const openService = (serviceId: number) => {
  window.open(`/service/${serviceId}`, '_blank')
}

const openIncident = (incidentId: number) => {
  window.open(`/incident/${incidentId}`, '_blank')
}

definePage({
  meta: {
    menu: {
      title: 'alert',
      icon: 'pi pi-bell',
      order: 3,
    },
  },
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">{{ t('alert.title') }}</h1>

    <DataTable :value="alerts" :loading="loading" stripedRows responsiveLayout="scroll" lazy dataKey="id" paginator
      v-model:rows="rows" v-model:first="first" :rowsPerPageOptions="[5, 10, 20, 50]" :totalRecords="total"
      :pageCount="pageCount" filterDisplay="row" v-model:multi-sort-meta="multiSortMeta"
      sort-mode="multiple">
      <Column field="id" header="ID" style="width: 8%" />
      <Column field="title" sortable :header="t('common.title')" style="width: 25%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.title" type="text" />
        </template>
      </Column>
      <Column field="service" sortable :header="t('alert.service')" style="width: 15%" :showFilterMenu="false">
        <template #body="slotProps">
          <Button variant="link" :label="`${slotProps.data.service.name} (#${slotProps.data.service.id})`" @click="openService(slotProps.data.service.id)" />
        </template>
        <template #filter>
          <InputText v-model="filters.service" type="text" />
        </template>
      </Column>
      <Column field="incidentId" sortable :header="t('alert.relatedIncident')" style="width: 15%" :showFilterMenu="false">
        <template #body="slotProps">
          <Button variant="link" :label="`#${slotProps.data.incidentId}`" @click="openIncident(slotProps.data.incidentId)" />
        </template>
        <template #filter>
          <InputText v-model="filters.incidentId" type="text" />
        </template>
      </Column>
      <Column field="createdAt" sortable :header="t('common.createTime')" style="width: 17%" :showFilterMenu="false">
        <template #filter>
          <Calendar v-model="filters.dateRange" selectionMode="range" :showTime="true" :showIcon="true"
            :placeholder="t('common.dateRange')" class="w-full" />
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body="slotProps">
          <Button icon="pi pi-eye" variant="text" :label="t('common.view')" @click="selectedAlert = slotProps.data; dialogVisible = true" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" :modal="true" :header="`#${selectedAlert?.id}: ${selectedAlert?.title}`" :style="{ width: '50rem' }">
      <div v-if="selectedAlert" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">{{ t('alert.service') }}:</label>
            <div>
              <Button variant="link" class="p-0" :label="`${selectedAlert.service.name} (#${selectedAlert.service.id})`" @click="openService(selectedAlert.service.id)" />
            </div>
          </div>
          <div>
            <label class="font-semibold">{{ t('alert.relatedIncident') }}:</label>
            <div>
              <template v-if="selectedAlert.incidentId">
                <Button variant="link" class="p-0" :label="`#${selectedAlert.incidentId}`" @click="openIncident(selectedAlert.incidentId)" />
              </template>
              <template v-else>{{ t('alert.noIncident') }}</template>
            </div>
          </div>
          <div>
            <label class="font-semibold">{{ t('common.createTime') }}:</label>
            <div>{{ selectedAlert.createdAt }}</div>
          </div>
          <div v-if="selectedAlert.customFields" class="col-span-2">
            <label class="font-semibold">{{ t('editor.alert.customFields') }}:</label>
            <div class="space-y-2 mt-2 pl-4">
              <div v-for="(value, key) in selectedAlert.customFields" :key="key" class="flex gap-2">
                <span class="font-medium">{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

