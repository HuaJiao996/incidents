<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';

const { t } = useI18n();

// 定义事件数据结构
interface Incident {
  id: string;
  title: string;
  status: string;
  assignee: string;
  type: string;
  service: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const incidents = ref<Incident[]>([
  {
    id: '#2023001',
    title: '数据库连接异常',
    status: '已触发',
    assignee: '刘志强',
    createdAt: '2023-10-27 14:30',
    updatedAt: '2023-10-27 15:45',
    service: '数据库服务',
    type: '系统异常'
  },
  {
    id: '#2023002',
    title: 'API 响应超时',
    status: '处理中',
    assignee: '张雨萱',
    createdAt: '2023-10-27 10:15',
    updatedAt: '2023-10-27 11:30',
    service: 'API 网关',
    type: '性能问题'
  },
  {
    id: '#2023003',
    title: '服务器 CPU 使用率过高',
    status: '已解决',
    assignee: '王建国',
    createdAt: '2023-10-26 16:20',
    updatedAt: '2023-10-27 09:15',
    service: '计算服务',
    type: '资源告警'
  }
]);

// 筛选选项
const statusOptions = ref([
  { label: t('incident.status.all'), value: '' },
  { label: t('incident.status.triggered'), value: '已触发' },
  { label: t('incident.status.processing'), value: '处理中' },
  { label: t('incident.status.resolved'), value: '已解决' }
]);

const assigneeOptions = ref([
  { label: '全部负责人', value: '' },
  { label: '刘志强', value: '刘志强' },
  { label: '张雨萱', value: '张雨萱' },
  { label: '王建国', value: '王建国' }
]);

const typeOptions = ref([
  { label: '全部类型', value: '' },
  { label: '系统异常', value: '系统异常' },
  { label: '性能问题', value: '性能问题' },
  { label: '资源告警', value: '资源告警' }
]);

const serviceOptions = ref([
  { label: '全部服务', value: '' },
  { label: '数据库服务', value: '数据库服务' },
  { label: 'API 网关', value: 'API 网关' },
  { label: '计算服务', value: '计算服务' }
]);

// 筛选条件
const filters = ref({
  status: '',
  assignee: '',
  type: '',
  service: '',
  dateRange: null,
  search: ''
});

// 排序
const sortField = ref('createdAt');
const sortOrder = ref(-1);

// 分页
const totalRecords = ref(50);
const first = ref(0);

// 加载数据函数
const loading = ref(false);
const loadIncidents = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/incidents');
    // incidents.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载事件列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadIncidents();
});

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '已触发': return 'bg-red-50 text-red-600';
    case '处理中': return 'bg-yellow-50 text-yellow-600';
    case '已解决': return 'bg-green-50 text-green-600';
    default: return '';
  }
};

// 获取严重程度对应的样式类
const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'low': return 'severity-low';
    case 'medium': return 'severity-medium';
    case 'high': return 'severity-high';
    case 'critical': return 'severity-critical';
    default: return '';
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 定义路由 meta
definePage({
  meta: {
    menu: {
      title: 'incident',
      icon: 'pi pi-exclamation-triangle',
      order: 2
    }
  }
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">{{ t('incident.title') }}</h1>
      <div class="flex gap-2">
        <Button :label="t('incident.batchAssign')" icon="pi pi-users" class="p-button-outlined" />
        <Button :label="t('incident.batchResolve')" icon="pi pi-check" severity="success" />
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="grid grid-cols-6 gap-4 mb-6">
      <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value"
        :placeholder="t('common.status')" class="w-full" />
      <Dropdown v-model="filters.assignee" :options="assigneeOptions" optionLabel="label" optionValue="value"
        placeholder="负责人" class="w-full" />
      <Dropdown v-model="filters.type" :options="typeOptions" optionLabel="label" optionValue="value"
        placeholder="类型" class="w-full" />
      <Dropdown v-model="filters.service" :options="serviceOptions" optionLabel="label" optionValue="value"
        :placeholder="t('alert.service')" class="w-full" />
      <Calendar v-model="filters.dateRange" selectionMode="range" :placeholder="t('alert.dateRange')"
        class="w-full" showIcon />
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText v-model="filters.search" :placeholder="t('common.search')" class="w-full" />
      </span>
    </div>

    <!-- 排序标签 -->
    <div class="flex gap-2 mb-4">
      <Button class="p-button-text !py-1 !px-3 text-sm" :class="{ '!bg-gray-100': sortField === 'createdAt' }">
        {{ t('common.createTime') }}
        <i class="pi pi-angle-down ml-1" v-if="sortField === 'createdAt' && sortOrder === 1"></i>
        <i class="pi pi-angle-up ml-1" v-if="sortField === 'createdAt' && sortOrder === -1"></i>
      </Button>
      <Button class="p-button-text !py-1 !px-3 text-sm" :class="{ '!bg-gray-100': sortField === 'updatedAt' }">
        {{ t('common.updateTime') }}
        <i class="pi pi-angle-down ml-1" v-if="sortField === 'updatedAt' && sortOrder === 1"></i>
        <i class="pi pi-angle-up ml-1" v-if="sortField === 'updatedAt' && sortOrder === -1"></i>
      </Button>
      <Button class="p-button-text !py-1 !px-3 text-sm" :class="{ '!bg-gray-100': sortField === 'status' }">
        {{ t('common.status') }}
        <i class="pi pi-angle-down ml-1" v-if="sortField === 'status' && sortOrder === 1"></i>
        <i class="pi pi-angle-up ml-1" v-if="sortField === 'status' && sortOrder === -1"></i>
      </Button>
    </div>

    <!-- 数据表格 -->
    <DataTable :value="incidents" class="p-datatable-sm" responsiveLayout="scroll"
      :rows="10" :totalRecords="totalRecords" :first="first"
      stripedRows showGridlines>
      <Column field="id" header="ID" />
      <Column field="title" :header="t('common.title')" />
      <Column field="status" :header="t('common.status')">
        <template #body="{ data }">
          <span :class="['px-2 py-1 rounded text-sm', getStatusClass(data.status)]">
            {{ data.status }}
          </span>
        </template>
      </Column>
      <Column field="assignee" header="负责人" />
      <Column field="createdAt" :header="t('common.createTime')" />
      <Column field="updatedAt" :header="t('common.updateTime')" />
      <Column field="service" :header="t('alert.service')" />
      <Column field="type" header="类型" />
      <Column :header="t('common.actions')" :exportable="false" style="min-width:8rem">
        <template #body>
          <div class="flex gap-2">
            <Button icon="pi pi-eye" class="p-button-text p-button-sm" :aria-label="t('common.view')" />
            <Button icon="pi pi-user" class="p-button-text p-button-sm" :aria-label="t('common.edit')" />
            <Button icon="pi pi-check" class="p-button-text p-button-sm" :aria-label="t('common.confirm')" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-datatable-sm) {
  font-size: 0.875rem;
}

:deep(.p-datatable-sm .p-datatable-thead > tr > th) {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}

:deep(.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.5rem 1rem;
}

:deep(.p-button-sm) {
  padding: 0.25rem;
  font-size: 0.875rem;
}

:deep(.p-button-sm .p-button-icon) {
  font-size: 0.875rem;
}
</style>
