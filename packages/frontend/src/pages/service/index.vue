<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable, { type DataTableSortMeta } from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import { usePagination } from 'alova/client';
import Apis from '@/api';
import { usePageOffset } from '@/composables/usePageOffset';
import { format } from 'date-fns';

const { t } = useI18n();

const multiSortMeta = ref<DataTableSortMeta[]>([]);
const filters = ref({
  id: '',
  name: '',
  description: '',
  dateRange: undefined as [Date | null, Date | null] | undefined,
});

const multiSort = computed(() => multiSortMeta.value?.map(item => item.field).join(','));
const multiSortOrders = computed(() => multiSortMeta.value?.map(item => item.order === 1 ? 'asc' : 'desc').join(','));

const {
  data: services,
  loading,
  page,
  pageSize,
  pageCount,
  total,
} = usePagination((page, pageSize) => Apis.service.findAll({
  params: {
    page: String(page),
    pageSize: String(pageSize),
    sortFields: multiSort.value,
    sortOrders: multiSortOrders.value,
    idValue: filters.value.id,
    nameValue: filters.value.name,
    descriptionValue: filters.value.description,
    startTime: filters.value.dateRange?.[0] ? format(filters.value.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
    endTime: filters.value.dateRange?.[1] ? format(filters.value.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
  }
}), {
  watchingStates: [multiSort, multiSortOrders, filters],
  debounce: 1000,
});

const { first, rows } = usePageOffset(page, pageSize);

const openService = (serviceId: number) => {
  window.open(`/service/${serviceId}`, '_blank');
};

definePage({
  meta: {
    menu: {
      title: 'service',
      icon: 'pi pi-server',
      order: 4,
    },
  },
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">{{ t('service.title') }}</h1>
      <Button icon="pi pi-plus" :label="t('service.create')" severity="success" />
    </div>

    <DataTable
      :value="services"
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
      filterDisplay="row"
      v-model:multi-sort-meta="multiSortMeta"
      sort-mode="multiple"
      @row-click="(e) => openService(e.data.id)"
    >
      <Column field="id" header="ID" sortable style="width: 8%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.id" type="text" class="w-full" />
        </template>
      </Column>
      <Column field="name" sortable :header="t('service.name')" style="width: 20%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.name" type="text" class="w-full" />
        </template>
      </Column>
      <Column field="description" sortable :header="t('service.description')" style="width: 44%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.description" type="text" class="w-full" />
        </template>
      </Column>
      <Column field="createdAt" sortable :header="t('common.createTime')" style="width: 20%" :showFilterMenu="false">
        <template #filter>
          <DatePicker v-model="filters.dateRange" selectionMode="range" :showTime="true" :showIcon="true" showButtonBar
            :placeholder="t('common.dateRange')" class="w-full" :manualInput="false" />
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" variant="text" severity="info" :aria-label="t('common.edit')" />
            <Button icon="pi pi-trash" variant="text" severity="danger" :aria-label="t('common.delete')" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

