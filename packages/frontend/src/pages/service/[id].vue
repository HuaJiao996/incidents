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
        <button class="action-button primary">
          <i class="pi pi-refresh"></i> 重启服务
        </button>
        <button class="action-button">
          <i class="pi pi-cog"></i> 配置
        </button>
        <button class="action-button">
          <i class="pi pi-chart-line"></i> 查看详细监控
        </button>
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
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #666;
  text-decoration: none;
}

.back-button:hover {
  color: #333;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.service-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.service-title i {
  font-size: 24px;
  color: #666;
}

.service-title h1 {
  margin: 0;
  font-size: 24px;
}

.service-status {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.status-healthy, .status-normal {
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
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  gap: 5px;
}

.info-item .label {
  font-weight: 500;
  color: #666;
}

.service-description {
  margin-bottom: 30px;
}

.service-description h2, .service-metrics h2, .service-incidents h2 {
  font-size: 18px;
  margin-bottom: 15px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.metric-card {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.metric-name {
  font-weight: 500;
  color: #666;
}

.metric-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.metric-value {
  font-size: 24px;
  font-weight: 500;
}

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.incident-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.incident-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.incident-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.incident-status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.status-open {
  background-color: #ffecb3;
  color: #856404;
}

.status-in-progress {
  background-color: #b3e0ff;
  color: #004085;
}

.status-closed {
  background-color: #c3e6cb;
  color: #155724;
}

.incident-date {
  color: #666;
}

.service-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.primary {
  background-color: #4caf50;
  color: white;
  border: none;
}

.action-button.primary:hover {
  background-color: #45a049;
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
