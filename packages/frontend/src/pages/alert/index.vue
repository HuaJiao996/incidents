<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DataTable, { type DataTableSortMeta } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import { usePagination } from 'alova/client'
import Apis from '@/api'
import { startOfDay, endOfDay, format } from 'date-fns'
import type { AlertWithServiceDto } from '@/api/globals'
import AlertDetailDialog from '@/components/AlertDetailDialog.vue'
import { usePageOffset } from '@/composables/usePageOffset'

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

const { first, rows } = usePageOffset(page, pageSize)

const openDetailDialog = (alert: AlertWithServiceDto) => {
  selectedAlert.value = alert
  dialogVisible.value = true
}

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
          <DatePicker v-model="filters.dateRange" selectionMode="range" :showTime="true" :showIcon="true"
            :placeholder="t('common.dateRange')" class="w-full" />
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body="slotProps">
          <Button icon="pi pi-eye" variant="text" :label="t('common.view')"  @click="openDetailDialog(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <AlertDetailDialog v-model="dialogVisible" :alert="selectedAlert" />
  </div>
</template>

