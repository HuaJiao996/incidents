<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义告警数据结构
interface Alert {
  id: string;
  title: string;
  status: 'active' | 'resolved' | 'suppressed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  service?: string;
}

// 模拟数据
const alerts = ref<Alert[]>([
  {
    id: '1',
    title: 'CPU使用率超过阈值',
    status: 'active',
    severity: 'high',
    createdAt: '2023-10-15T08:30:00Z',
    service: '用户认证服务'
  },
  {
    id: '2',
    title: '内存不足警告',
    status: 'resolved',
    severity: 'medium',
    createdAt: '2023-10-14T14:20:00Z',
    service: '主数据库'
  },
  {
    id: '3',
    title: '网络延迟增加',
    status: 'suppressed',
    severity: 'low',
    createdAt: '2023-10-10T11:05:00Z',
    service: '网站前端'
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
    console.error('加载告警列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadAlerts();
});

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'status-active';
    case 'resolved': return 'status-resolved';
    case 'suppressed': return 'status-suppressed';
    default: return '';
  }
};

// 获取严重性对应的样式类
const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'critical': return 'severity-critical';
    case 'high': return 'severity-high';
    case 'medium': return 'severity-medium';
    case 'low': return 'severity-low';
    default: return '';
  }
};
</script>

<template>
  <div class="alert-list-page">
    <h1>告警列表</h1>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>

    <!-- 告警列表 -->
    <div class="alert-list" v-else>
      <div class="alert-item" v-for="alert in alerts" :key="alert.id">
        <div class="alert-header">
          <div class="alert-title">
            <router-link :to="`/alert/${alert.id}`">{{ alert.title }}</router-link>
          </div>
          <div class="alert-meta">
            <span class="alert-status" :class="getStatusClass(alert.status)">
              {{ alert.status === 'active' ? '活跃' : alert.status === 'resolved' ? '已解决' : '已抑制' }}
            </span>
            <span class="alert-severity" :class="getSeverityClass(alert.severity)">
              {{ alert.severity === 'critical' ? '严重' : alert.severity === 'high' ? '高' : alert.severity === 'medium' ? '中' : '低' }}
            </span>
          </div>
        </div>

        <div class="alert-body">
          <div class="alert-service" v-if="alert.service">
            <span class="label">关联服务:</span>
            <span>{{ alert.service }}</span>
          </div>
          <div class="alert-date">
            <span class="label">创建时间:</span>
            <span>{{ formatDate(alert.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-list-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alert-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-title {
  font-weight: 500;
}

.alert-meta {
  display: flex;
  gap: 10px;
}

.alert-status, .alert-severity {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #ffecb3;
  color: #856404;
}

.status-resolved {
  background-color: #c3e6cb;
  color: #155724;
}

.status-suppressed {
  background-color: #d1ecf1;
  color: #0c5460;
}

.severity-critical {
  background-color: #f8d7da;
  color: #721c24;
}

.severity-high {
  background-color: #fff3cd;
  color: #856404;
}

.severity-medium {
  background-color: #bee5eb;
  color: #0c5460;
}

.severity-low {
  background-color: #d4edda;
  color: #155724;
}

.alert-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.alert-service, .alert-date {
  display: flex;
  gap: 5px;
}

.label {
  font-weight: 500;
  color: #666;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}
</style>
