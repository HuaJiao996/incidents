<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import DataTable, { type DataTableSortMeta } from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import { usePagination } from 'alova/client';
import Apis from '@/api';
import { startOfDay, endOfDay, format } from 'date-fns';
import { usePageOffset } from '@/composables/usePageOffset';
import type { IncidentResponseDto } from '@/api/globals';

const { t } = useI18n();

const multiSortMeta = ref<DataTableSortMeta[]>([]);
const selectedIncidents = ref<IncidentResponseDto[]>([]);

const filters = ref({
  service: [] as string[],
  title: '',
  incidentId: '',
  status: [] as string[],
  assignee: [] as string[],
  updatedAtRange: undefined as [Date | null, Date | null] | undefined,
  dateRange: [startOfDay(new Date()), endOfDay(new Date())] as [Date, Date]
});

const multiSort = computed(() => multiSortMeta.value?.map(item => item.field).join(','));
const multiSortOrders = computed(() => multiSortMeta.value?.map(item => item.order === 1 ? 'asc' : 'desc').join(','));

const {
  data: incidents,
  loading,
  page,
  pageSize,
  pageCount,
  total,
} = usePagination((page, pageSize) => Apis.incident.findAll({
  params: {
    page: String(page),
    pageSize: String(pageSize),
    sortFields: multiSort.value,
    sortOrders: multiSortOrders.value,
    titleValue: filters.value.title,
    serviceValue: filters.value.service.join(','),
    incidentIdValue: filters.value.incidentId,
    statusValue: filters.value.status.join(','),
    assigneeValue: filters.value.assignee.join(','),
    startTime: filters.value.dateRange[0] ? format(filters.value.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
    endTime: filters.value.dateRange[1] ? format(filters.value.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
    updatedAtStart: filters.value.updatedAtRange?.[0] ? format(filters.value.updatedAtRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
    updatedAtEnd: filters.value.updatedAtRange?.[1] ? format(filters.value.updatedAtRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
  }
}), {
  watchingStates: [multiSort, multiSortOrders, filters],
  debounce: 1000,
});

const { first, rows } = usePageOffset(page, pageSize)

const openService = (serviceId: number) => {
  window.open(`/service/${serviceId}`, '_blank');
};

const openIncident = (incidentId: number) => {
  window.open(`/incident/${incidentId}`, '_blank');
};

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '已触发': return 'bg-red-50 text-red-600';
    case '处理中': return 'bg-yellow-50 text-yellow-600';
    case '已解决': return 'bg-green-50 text-green-600';
    default: return '';
  }
};


definePage({
  meta: {
    menu: {
      title: 'incident',
      icon: 'pi pi-exclamation-triangle',
      order: 2,
    },
  },
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">{{ t('incident.title') }}</h1>
    </div>

    <DataTable :value="incidents" :loading="loading" stripedRows responsiveLayout="scroll" lazy dataKey="id" paginator
      v-model:rows="rows" v-model:first="first" :rowsPerPageOptions="[5, 10, 20, 50]" :totalRecords="total"
      :pageCount="pageCount" filterDisplay="row" v-model:multi-sort-meta="multiSortMeta" sort-mode="multiple"
      v-model:selection="selectedIncidents" selectionMode="multiple" @row-click="(e) => openIncident(e.data.id)"
      :metaKeySelection="false">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-sm">已选择 {{ selectedIncidents.length }} 个事件</span>
          <div class="flex gap-2">
            <Button :label="t('incident.batchAssign')" icon="pi pi-users" class="p-button-outlined"
              :disabled="!selectedIncidents.length" />
            <Button :label="t('incident.batchResolve')" icon="pi pi-check" severity="success"
              :disabled="!selectedIncidents.length" />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" :exportable="false">
        <template #header>
          <div class="flex items-center justify-center">
            <i class="pi pi-list text-sm text-gray-500"></i>
          </div>
        </template>
      </Column>
      <Column field="id" header="ID" sortable style="width: 8%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.incidentId" type="text" />
        </template>
      </Column>
      <Column field="title" sortable :header="t('common.title')" style="width: 25%" :showFilterMenu="false">
        <template #filter>
          <InputText v-model="filters.title" type="text" />
        </template>
      </Column>
      <Column field="status" sortable :header="t('common.status')" style="width: 10%" :showFilterMenu="false">
        <template #filter>
          <MultiSelect v-model="filters.status" :options="['已触发', '处理中', '已解决']" :placeholder="t('common.status')"
            class="w-full" />
        </template>
        <template #body="{ data }">
          <span :class="['px-2 py-1 rounded text-sm', getStatusClass(data.status)]">
            {{ data.status }}
          </span>
        </template>
      </Column>
      <Column field="service" sortable :header="t('alert.service')" style="width: 15%" :showFilterMenu="false">
        <template #body="slotProps">
          <Button variant="link" :label="`${slotProps.data.service.name} (#${slotProps.data.service.id})`"
            @click="openService(slotProps.data.service.id)" />
        </template>
        <template #filter>
          <MultiSelect v-model="filters.service" :options="[]" :placeholder="t('alert.service')" class="w-full"
            optionLabel="name" />
        </template>
      </Column>
      <Column field="assignee" sortable :header="t('incident.assignee')" style="width: 10%" :showFilterMenu="false">
        <template #filter>
          <MultiSelect v-model="filters.assignee" :options="[]" :placeholder="t('incident.assignee')" class="w-full" />
        </template>
      </Column>
      <Column field="createdAt" sortable :header="t('common.createTime')" style="width: 17%" :showFilterMenu="false">
        <template #filter>
          <DatePicker v-model="filters.dateRange" selectionMode="range" :showTime="true" :showIcon="true" showButtonBar
            :placeholder="t('common.dateRange')" class="w-full" />
        </template>
      </Column>
      <Column field="updatedAt" sortable :header="t('common.updateTime')" style="width: 17%" :showFilterMenu="false">
        <template #filter>
          <DatePicker v-model="filters.updatedAtRange" selectionMode="range" :showTime="true" :showIcon="true" showButtonBar
            :placeholder="t('common.dateRange')" class="w-full" />
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body>
          <div class="flex gap-2">
            <Button icon="pi pi-user" variant="text" :label="t('common.assign')" />
            <Button icon="pi pi-check" variant="text" :label="t('common.resolve')" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
