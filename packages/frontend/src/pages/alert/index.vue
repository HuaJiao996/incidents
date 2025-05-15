<script setup lang="ts">
import { ref, onMounted, effect, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable, { type DataTableFilterMeta } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useRequest, usePagination } from 'alova/client'
import Apis from '@/api'
import Paginator from 'primevue/paginator'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const { t } = useI18n()

const statusOptions = [
  { label: t('alert.status.all'), value: null },
  { label: t('alert.status.active'), value: 'active' },
  { label: t('alert.status.resolved'), value: 'resolved' }
]

const {
  data: alerts,
  loading,
  page,
  pageSize,
  pageCount,
  total,
} = usePagination((page, pageSize) => Apis.alert.findAll({ params: { page, pageSize } }))

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

const filters = ref<DataTableFilterMeta>({
  service: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  incidentId: { value: null, matchMode: FilterMatchMode.CONTAINS },
  createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },

})

effect(() => {
  console.log(filters.value)
})



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

    <DataTable
      :value="alerts"
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      lazy
      dataKey="id"

      paginator
      v-model:rows="rows"
      v-model:first="first"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :totalRecords="total"
      :pageCount="pageCount"

      v-model:filters="filters"
      filterDisplay="row"
    >
      <Column field="id" header="ID" style="width: 8%" />
      <Column field="title" sortable :header="t('common.title')" style="width: 25%" >
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" />
        </template>
      </Column>
      <Column field="service" :header="t('alert.service')" style="width: 15%">
        <template #body="slotProps">
          <Button
            variant="link"
            :label="`#${slotProps.data.service.id}:${slotProps.data.service.name}`"
          />
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" />
        </template>
      </Column>
      <Column field="incidentId" :header="t('alert.relatedIncident')" style="width: 15%">
        <template #body="slotProps">
          <Button variant="link" :label="`#${slotProps.data.incidentId}`" />
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" />
        </template>
      </Column>
      <Column field="createdAt" :header="t('common.createTime')" style="width: 17%" >
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" />
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body>
          <Button icon="pi pi-eye" variant="text" :label="t('common.view')" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
