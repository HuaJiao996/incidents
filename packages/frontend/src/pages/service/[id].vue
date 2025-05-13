<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const serviceId = route.params.id as string;

// 定义服务数据结构
interface Service {
  id: string;
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  type: 'web' | 'database' | 'api' | 'infrastructure';
  lastChecked: string;
  uptime: string;
  metrics?: Metric[];
  incidents?: IncidentRef[];
}

interface Metric {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

interface IncidentRef {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'in_progress';
  createdAt: string;
}

// 状态数据
const service = ref<Service | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// 加载服务详情
const loadServiceDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch(`/api/services/${serviceId}`);
    // service.value = await response.json();

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟数据
    service.value = {
      id: serviceId,
      name: serviceId === '1' ? '用户认证服务' :
            serviceId === '2' ? '主数据库' :
            serviceId === '3' ? '网站前端' :
            serviceId === '4' ? '文件存储服务' : '消息队列',
      description: serviceId === '1' ? '处理用户登录、注册和授权的API服务。' :
                  serviceId === '2' ? '存储核心业务数据的主数据库服务。' :
                  serviceId === '3' ? '用户访问的主要网站界面。' :
                  serviceId === '4' ? '负责存储和管理用户上传的文件。' : '处理系统间异步消息传递的队列服务。',
      status: serviceId === '1' ? 'healthy' :
              serviceId === '2' ? 'warning' :
              serviceId === '3' ? 'healthy' :
              serviceId === '4' ? 'maintenance' : 'critical',
      type: serviceId === '1' ? 'api' :
            serviceId === '2' ? 'database' :
            serviceId === '3' ? 'web' : 'infrastructure',
      lastChecked: '2023-10-15T10:30:00Z',
      uptime: serviceId === '1' ? '99.98%' :
              serviceId === '2' ? '99.5%' :
              serviceId === '3' ? '99.9%' :
              serviceId === '4' ? '98.7%' : '95.2%',
      metrics: [
        {
          name: 'CPU使用率',
          value: serviceId === '1' ? '45' :
                serviceId === '2' ? '78' :
                serviceId === '3' ? '35' :
                serviceId === '4' ? '25' : '90',
          unit: '%',
          status: serviceId === '1' ? 'normal' :
                  serviceId === '2' ? 'warning' :
                  serviceId === '3' ? 'normal' :
                  serviceId === '4' ? 'normal' : 'critical'
        },
        {
          name: '内存使用率',
          value: serviceId === '1' ? '60' :
                serviceId === '2' ? '85' :
                serviceId === '3' ? '50' :
                serviceId === '4' ? '40' : '75',
          unit: '%',
          status: serviceId === '1' ? 'normal' :
                  serviceId === '2' ? 'warning' :
                  serviceId === '3' ? 'normal' :
                  serviceId === '4' ? 'normal' : 'warning'
        },
        {
          name: '响应时间',
          value: serviceId === '1' ? '120' :
                serviceId === '2' ? '350' :
                serviceId === '3' ? '180' :
                serviceId === '4' ? '200' : '500',
          unit: 'ms',
          status: serviceId === '1' ? 'normal' :
                  serviceId === '2' ? 'warning' :
                  serviceId === '3' ? 'normal' :
                  serviceId === '4' ? 'normal' : 'critical'
        }
      ],
      incidents: serviceId === '5' ? [
        {
          id: '2',
          title: '数据库连接失败',
          status: 'in_progress',
          createdAt: '2023-10-14T14:20:00Z'
        }
      ] : []
    };
  } catch (err) {
    console.error('加载服务详情失败:', err);
    error.value = '加载服务详情失败，请稍后重试';
    service.value = null;
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadServiceDetail();
});

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'healthy': return 'status-healthy';
    case 'warning': return 'status-warning';
    case 'critical': return 'status-critical';
    case 'maintenance': return 'status-maintenance';
    case 'normal': return 'status-normal';
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
  <div class="service-detail-page">
    <!-- 返回按钮 -->
    <div class="back-link">
      <router-link to="/service" class="back-button">
        <i class="pi pi-arrow-left"></i> 返回服务列表
      </router-link>
    </div>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div class="error-state" v-else-if="error">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="loadServiceDetail" class="retry-button">
        <i class="pi pi-refresh"></i> 重试
      </button>
    </div>

    <!-- 服务详情 -->
    <div class="service-detail" v-else-if="service">
      <div class="service-header">
        <div class="service-title">
          <i class="pi" :class="'pi-' + getTypeIcon(service.type)"></i>
          <h1>{{ service.name }}</h1>
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
          <span class="label">ID:</span>
          <span>{{ service.id }}</span>
        </div>
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

      <div class="service-description">
        <h2>描述</h2>
        <p>{{ service.description }}</p>
      </div>

      <!-- 指标信息 -->
      <div class="service-metrics" v-if="service.metrics && service.metrics.length > 0">
        <h2>性能指标</h2>
        <div class="metrics-grid">
          <div class="metric-card" v-for="metric in service.metrics" :key="metric.name">
            <div class="metric-header">
              <span class="metric-name">{{ metric.name }}</span>
              <span class="metric-status" :class="getStatusClass(metric.status)"></span>
            </div>
            <div class="metric-value">{{ metric.value }}{{ metric.unit }}</div>
          </div>
        </div>
      </div>

      <!-- 相关事件 -->
      <div class="service-incidents" v-if="service.incidents && service.incidents.length > 0">
        <h2>相关事件</h2>
        <div class="incidents-list">
          <div class="incident-item" v-for="incident in service.incidents" :key="incident.id">
            <div class="incident-title">
              <router-link :to="`/incident/${incident.id}`">{{ incident.title }}</router-link>
            </div>
            <div class="incident-meta">
              <span class="incident-status" :class="{
                'status-open': incident.status === 'open',
                'status-in-progress': incident.status === 'in_progress',
                'status-closed': incident.status === 'closed'
              }">
                {{ incident.status === 'open' ? '未解决' : incident.status === 'in_progress' ? '处理中' : '已解决' }}
              </span>
              <span class="incident-date">{{ formatDate(incident.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="service-actions">
        <Button
          label="重启服务"
          icon="pi pi-refresh"
          severity="success"
          class="mr-2"
        />
        <Button
          label="配置"
          icon="pi pi-cog"
          severity="secondary"
          class="mr-2"
        />
        <Button
          label="查看详细监控"
          icon="pi pi-chart-line"
          severity="secondary"
        />
      </div>
    </div>

    <!-- 未找到服务 -->
    <div class="not-found" v-else>
      <i class="pi pi-exclamation-circle"></i>
      <h2>未找到服务</h2>
      <p>找不到ID为 "{{ serviceId }}" 的服务</p>
      <router-link to="/service" class="back-link-button">
        返回服务列表
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.service-detail-page {
  @apply p-6;
}

.back-link {
  @apply mb-6;
}

.back-button {
  @apply flex items-center gap-2 text-text-color-secondary hover:text-text-color transition-colors;
}

.loading-state,
.error-state {
  @apply flex flex-col items-center justify-center p-12 text-text-color-secondary;
}

.loading-state i,
.error-state i {
  @apply text-4xl mb-4;
}

.retry-button {
  @apply mt-4 px-4 py-2 bg-surface-hover text-text-color rounded-lg hover:bg-surface-hover/80 transition-colors;
}

.service-detail {
  @apply space-y-6;
}

.service-header {
  @apply flex justify-between items-center bg-surface-card p-6 rounded-lg shadow-sm;
}

.service-title {
  @apply flex items-center gap-3;
}

.service-title i {
  @apply text-2xl text-text-color-secondary;
}

.service-title h1 {
  @apply text-2xl font-semibold text-text-color;
}

.service-status {
  @apply px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium;
}

.status-healthy {
  @apply bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400;
}

.status-warning {
  @apply bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400;
}

.status-critical {
  @apply bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400;
}

.status-maintenance {
  @apply bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400;
}

.status-normal {
  @apply bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400;
}

.service-info {
  @apply bg-surface-card p-6 rounded-lg shadow-sm;
}

.service-info-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

.info-item {
  @apply space-y-1;
}

.info-label {
  @apply text-sm text-text-color-secondary;
}

.info-value {
  @apply text-lg font-medium text-text-color;
}

.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.metric-card {
  @apply bg-surface-card p-6 rounded-lg shadow-sm;
}

.metric-header {
  @apply flex justify-between items-center mb-4;
}

.metric-name {
  @apply text-lg font-medium text-text-color;
}

.metric-value {
  @apply text-2xl font-semibold text-text-color;
}

.metric-unit {
  @apply text-sm text-text-color-secondary;
}

.incidents-list {
  @apply space-y-4;
}

.incident-item {
  @apply flex justify-between items-center p-4 bg-surface-hover rounded-lg;
}

.incident-info {
  @apply space-y-1;
}

.incident-title {
  @apply font-medium text-text-color;
}

.incident-date {
  @apply text-sm text-text-color-secondary;
}

.incident-status {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.status-open {
  @apply bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400;
}

.status-in_progress {
  @apply bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400;
}

.status-closed {
  @apply bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400;
}

.service-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.loading-state, .error-state, .not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-state i, .error-state i, .not-found i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.error-state i {
  color: #f44336;
}

.retry-button, .back-link-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #333;
}

.retry-button:hover, .back-link-button:hover {
  background-color: #e0e0e0;
}
</style>
