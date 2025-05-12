<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const { t } = useI18n();

definePage({
  meta: {
    menu: {
      title: 'service',
      icon: 'pi pi-server',
      order: 4
    },
  }
})

interface Service {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

// 模拟数据
const services = ref<Service[]>([
  {
    id: 1,
    name: 'Payment Service',
    description: 'Handles all payment processing and transactions',
    createdAt: '2024-03-20 10:30:00'
  },
  {
    id: 2,
    name: 'Order Service',
    description: 'Manages order creation and fulfillment',
    createdAt: '2024-03-20 09:15:00'
  },
  {
    id: 3,
    name: 'Auth Service',
    description: 'Provides authentication and authorization',
    createdAt: '2024-03-20 08:00:00'
  }
]);

// 搜索
const searchQuery = ref('');

// 加载数据
const loading = ref(false);
const loadServices = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载服务列表失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadServices();
});

// 添加新服务
const addNewService = () => {
  // 实现添加新服务的逻辑
};

// 操作按钮
const onView = (service: Service) => {
  // 实现查看服务详情的逻辑
};

const onEdit = (service: Service) => {
  // 实现编辑服务的逻辑
};

const onDelete = (service: Service) => {
  // 实现删除服务的逻辑
};
</script>

<template>
  <div class="space-y-4">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center">
      <Button icon="pi pi-plus" :label="t('service.create')" />
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="searchQuery" :placeholder="t('service.searchPlaceholder')" class="w-64" />
      </span>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :value="services"
      :loading="loading"
      dataKey="id"
      stripedRows
      showGridlines
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" style="width: 8%"></Column>
      <Column field="name" :header="t('service.name')" style="width: 20%"></Column>
      <Column field="description" :header="t('service.description')" style="width: 52%"></Column>
      <Column field="createdAt" :header="t('common.createTime')" style="width: 12%"></Column>
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body>
          <div class="flex space-x-1">
            <Button icon="pi pi-eye" class="p-button-text p-button-sm" :aria-label="t('common.view')" />
            <Button icon="pi pi-pencil" class="p-button-text p-button-sm" :aria-label="t('common.edit')" />
            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" :aria-label="t('common.delete')" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.p-button-sm.p-button-text {
  padding: 0.25rem;
}

.p-button-sm.p-button-text .p-button-icon {
  font-size: 1rem;
}
</style>
