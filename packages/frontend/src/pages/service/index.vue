<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义服务数据结构
interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  type: 'web' | 'database' | 'api' | 'infrastructure';
  lastChecked: string;
  uptime: string;
}

// 模拟数据
const services = ref<Service[]>([
  {
    id: '1',
    name: '用户认证服务',
    status: 'healthy',
    type: 'api',
    lastChecked: '2023-10-15T10:30:00Z',
    uptime: '99.98%'
  },
  {
    id: '2',
    name: '主数据库',
    status: 'warning',
    type: 'database',
    lastChecked: '2023-10-15T10:25:00Z',
    uptime: '99.5%'
  },
  {
    id: '3',
    name: '网站前端',
    status: 'healthy',
    type: 'web',
    lastChecked: '2023-10-15T10:28:00Z',
    uptime: '99.9%'
  },
  {
    id: '4',
    name: '文件存储服务',
    status: 'maintenance',
    type: 'infrastructure',
    lastChecked: '2023-10-15T09:15:00Z',
    uptime: '98.7%'
  },
  {
    id: '5',
    name: '消息队列',
    status: 'critical',
    type: 'infrastructure',
    lastChecked: '2023-10-15T10:20:00Z',
    uptime: '95.2%'
  }
]);

// 加载数据函数
const loading = ref(false);
const loadServices = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/services');
    // services.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载服务列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadServices();
});

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'healthy': return 'status-healthy';
    case 'warning': return 'status-warning';
    case 'critical': return 'status-critical';
    case 'maintenance': return 'status-maintenance';
    default: return '';
  }
};

// 获取服务类型对应的图标
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'web': return 'pi-globe';
    case 'database': return 'pi-database';
    case 'api': return 'pi-server';
    case 'infrastructure': return 'pi-cog';
    default: return 'pi-circle';
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<template>
  <div class="services-page">
    <div class="page-header">
      <h1>服务列表</h1>
      <Button
        label="刷新"
        icon="pi pi-refresh"
        :loading="loading"
        @click="loadServices"
        severity="secondary"
      />
    </div>

    <div class="services-list" v-if="services.length > 0">
      <div class="service-card" v-for="service in services" :key="service.id">
        <div class="service-header">
          <div class="service-title">
            <i class="pi" :class="'pi-' + getTypeIcon(service.type)"></i>
            <h3>
              <router-link :to="`/service/${service.id}`">{{ service.name }}</router-link>
            </h3>
          </div>
          <div class="service-status" :class="getStatusClass(service.status)">
            {{
              service.status === 'healthy' ? '正常' :
              service.status === 'warning' ? '警告' :
              service.status === 'critical' ? '严重' : '维护中'
            }}
          </div>
        </div>
        <div class="service-info">
          <div class="info-item">
            <span class="label">类型:</span>
            <span>{{
              service.type === 'web' ? '网站' :
              service.type === 'database' ? '数据库' :
              service.type === 'api' ? 'API服务' : '基础设施'
            }}</span>
          </div>
          <div class="info-item">
            <span class="label">上次检查:</span>
            <span>{{ formatDate(service.lastChecked) }}</span>
          </div>
          <div class="info-item">
            <span class="label">可用率:</span>
            <span>{{ service.uptime }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="!loading">
      <i class="pi pi-info-circle"></i>
      <p>暂无服务记录</p>
    </div>

    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.services-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}



.services-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.service-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.service-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.service-title i {
  font-size: 18px;
  color: #666;
}

.service-title h3 {
  margin: 0;
  font-size: 18px;
}

.service-status {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.status-healthy {
  background-color: #c3e6cb;
  color: #155724;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-critical {
  background-color: #f8d7da;
  color: #721c24;
}

.status-maintenance {
  background-color: #d1ecf1;
  color: #0c5460;
}

.service-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 5px;
}

.info-item .label {
  font-weight: 500;
  color: #666;
}

.empty-state, .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
}

.empty-state i, .loading-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}
</style>
