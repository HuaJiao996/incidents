<script setup lang="ts">
import { ref, onMounted, effect } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { useRequest } from 'alova/client';
import Apis from '../../api'

const { t } = useI18n();

const { data: alerts , loading} = useRequest(Apis.alert.findAll)

const serviceOptions = ref([
  { label: '全部服务', value: '' },
  { label: '订单服务', value: '订单服务' },
  { label: '用户服务', value: '用户服务' },
  { label: '支付服务', value: '支付服务' }
]);

// 筛选条件
const filters = ref({
  type: '',
  service: '',
  dateRange: null,
  search: ''
});

// 排序
const sortField = ref('createdAt');
const sortOrder = ref(-1);

// 定义路由 meta
definePage({
  meta: {
    menu: {
      title: 'alert',
      icon: 'pi pi-bell',
      order: 3
    }
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">告警列表</h1>

    <!-- 筛选栏 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <Dropdown v-model="filters.service" :options="serviceOptions" optionLabel="label" optionValue="value"
        placeholder="服务" class="w-full" />
      <Calendar v-model="filters.dateRange" selectionMode="range" placeholder="开始时间 - 结束时间" class="w-full" showIcon />
      <span class="p-input-icon-left w-full">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search" />
          </InputGroupAddon>
          <InputText v-model="filters.search" placeholder="搜索告警标题" class="w-full" />
        </InputGroup>
      </span>
    </div>

    <!-- 排序标签 -->
    <div class="flex gap-2 mb-4">
      <Button class="p-button-text !py-1 !px-3 text-sm" :class="{ '!bg-gray-100': sortField === 'createdAt' }">
        创建时间
        <i class="pi pi-angle-down ml-1" v-if="sortField === 'createdAt' && sortOrder === 1"></i>
        <i class="pi pi-angle-up ml-1" v-if="sortField === 'createdAt' && sortOrder === -1"></i>
      </Button>
    </div>

    <!-- 数据表格 -->
    <DataTable :value="alerts" :loading="loading" stripedRows paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll">
      <Column field="id" header="ID" style="width: 8%" />
      <Column field="title" header="告警标题" style="width: 25%" />
      <Column field="service.name" header="服务" style="width: 15%" />
      <Column field="incidentId" header="关联事件" style="width: 15%" />
      <Column field="createdAt" header="创建时间" style="width: 17%" />
      <Column header="操作" style="width: 8%">
        <template #body>
          <Button icon="pi pi-eye" class="p-button-text p-button-sm" label="查看" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
