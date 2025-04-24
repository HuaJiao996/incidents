<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义警报数据结构
interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  timestamp: string;
  acknowledged: boolean;
  relatedServiceId?: string;
}

// 模拟数据
const alerts = ref<Alert[]>([
  {
    id: '1',
    title: 'CPU使用率超过阈值',
    message: '服务器CPU使用率已超过90%，持续30分钟',
    type: 'warning',
    source: '系统监控',
    timestamp: '2023-10-15T08:30:00Z',
    acknowledged: false,
    relatedServiceId: '1'
  },
  {
    id: '2',
    title: '数据库连接失败',
    message: '主数据库连接失败，尝试重连5次均失败',
    type: 'critical',
    source: '数据库监控',
    timestamp: '2023-10-14T14:20:00Z',
    acknowledged: true,
    relatedServiceId: '2'
  },
  {
    id: '3',
    title: '磁盘空间不足',
    message: '文件存储服务磁盘空间使用率已达到85%',
    type: 'warning',
    source: '存储监控',
    timestamp: '2023-10-15T07:15:00Z',
    acknowledged: false,
    relatedServiceId: '4'
  },
  {
    id: '4',
    title: '消息队列积压',
    message: '消息队列中有超过10000条未处理消息',
    type: 'error',
    source: '队列监控',
    timestamp: '2023-10-15T09:45:00Z',
    acknowledged: false,
    relatedServiceId: '5'
  },
  {
    id: '5',
    title: '系统更新通知',
    message: '系统将于今晚22:00进行例行维护更新',
    type: 'info',
    source: '系统管理',
    timestamp: '2023-10-15T10:00:00Z',
    acknowledged: true
  }
]);

// 加载数据函数
const loading = ref(false);
const loadAlerts = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/alerts');
    // alerts.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载警报列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadAlerts();
});

// 获取警报类型对应的样式类
const getAlertTypeClass = (type: string) => {
  switch (type) {
    case 'info': return 'alert-info';
    case 'warning': return 'alert-warning';
    case 'error': return 'alert-error';
    case 'critical': return 'alert-critical';
    default: return '';
  }
};

// 获取警报类型对应的图标
const getAlertTypeIcon = (type: string) => {
  switch (type) {
    case 'info': return 'pi-info-circle';
    case 'warning': return 'pi-exclamation-triangle';
    case 'error': return 'pi-times-circle';
    case 'critical': return 'pi-ban';
    default: return 'pi-bell';
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 确认警报
const acknowledgeAlert = (alert: Alert) => {
  alert.acknowledged = true;
  // 这里应该有API调用来更新服务器端状态
  // await fetch(`/api/alerts/${alert.id}/acknowledge`, { method: 'POST' });
};

// 筛选选项
const filterOptions = ref({
  showAcknowledged: true,
  selectedTypes: ['info', 'warning', 'error', 'critical']
});

// 筛选警报
const filteredAlerts = computed(() => {
  return alerts.value.filter(alert => {
    // 根据确认状态筛选
    if (!filterOptions.value.showAcknowledged && alert.acknowledged) {
      return false;
    }

    // 根据类型筛选
    if (!filterOptions.value.selectedTypes.includes(alert.type)) {
      return false;
    }

    return true;
  });
});
</script>

<template>
  <div class="alerts-page">
    <div class="page-header">
      <h1>警报中心</h1>
      <button class="refresh-button" @click="loadAlerts" :disabled="loading">
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
        刷新
      </button>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <label class="filter-label">显示已确认警报</label>
        <input type="checkbox" v-model="filterOptions.showAcknowledged">
      </div>

      <div class="filter-group">
        <label class="filter-label">警报类型</label>
        <div class="filter-options">
          <label class="filter-option">
            <input type="checkbox" v-model="filterOptions.selectedTypes" value="info">
            <span class="filter-text info">信息</span>
          </label>
          <label class="filter-option">
            <input type="checkbox" v-model="filterOptions.selectedTypes" value="warning">
            <span class="filter-text warning">警告</span>
          </label>
          <label class="filter-option">
            <input type="checkbox" v-model="filterOptions.selectedTypes" value="error">
            <span class="filter-text error">错误</span>
          </label>
          <label class="filter-option">
            <input type="checkbox" v-model="filterOptions.selectedTypes" value="critical">
            <span class="filter-text critical">严重</span>
          </label>
        </div>
      </div>
    </div>

    <div class="alerts-list" v-if="filteredAlerts.length > 0">
      <div class="alert-card" v-for="alert in filteredAlerts" :key="alert.id" :class="{ 'acknowledged': alert.acknowledged }">
        <div class="alert-icon" :class="getAlertTypeClass(alert.type)">
          <i class="pi" :class="'pi-' + getAlertTypeIcon(alert.type)"></i>
        </div>
        <div class="alert-content">
          <div class="alert-header">
            <h3>{{ alert.title }}</h3>
            <div class="alert-meta">
              <span class="alert-time">{{ formatDate(alert.timestamp) }}</span>
              <span class="alert-source">{{ alert.source }}</span>
            </div>
          </div>
          <p class="alert-message">{{ alert.message }}</p>
          <div class="alert-actions">
            <button
              v-if="!alert.acknowledged"
              class="acknowledge-button"
              @click="acknowledgeAlert(alert)"
            >
              <i class="pi pi-check"></i> 确认
            </button>
            <router-link
              v-if="alert.relatedServiceId"
              :to="`/service/${alert.relatedServiceId}`"
              class="view-service-link"
            >
              <i class="pi pi-external-link"></i> 查看相关服务
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="!loading">
      <i class="pi pi-info-circle"></i>
      <p>暂无符合条件的警报</p>
    </div>

    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.alerts-page {
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

.refresh-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #e0e0e0;
}

.refresh-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eee;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-label {
  font-weight: 500;
  font-size: 14px;
  color: #666;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.filter-text {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.filter-text.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.filter-text.warning {
  background-color: #fff3cd;
  color: #856404;
}

.filter-text.error {
  background-color: #f8d7da;
  color: #721c24;
}

.filter-text.critical {
  background-color: #dc3545;
  color: white;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alert-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.alert-card.acknowledged {
  opacity: 0.7;
  background-color: #f9f9f9;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  color: white;
}

.alert-icon i {
  font-size: 24px;
}

.alert-icon.alert-info {
  background-color: #17a2b8;
}

.alert-icon.alert-warning {
  background-color: #ffc107;
}

.alert-icon.alert-error {
  background-color: #dc3545;
}

.alert-icon.alert-critical {
  background-color: #6f1a07;
}

.alert-content {
  flex: 1;
  padding: 15px;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.alert-header h3 {
  margin: 0;
  font-size: 18px;
}

.alert-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.alert-time, .alert-source {
  font-size: 12px;
  color: #666;
}

.alert-message {
  margin: 0 0 15px 0;
  color: #333;
}

.alert-actions {
  display: flex;
  gap: 10px;
}

.acknowledge-button, .view-service-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
}

.acknowledge-button {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.acknowledge-button:hover {
  background-color: #45a049;
}

.view-service-link {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.view-service-link:hover {
  background-color: #e0e0e0;
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
