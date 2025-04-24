<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义事件数据结构
interface Incident {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'in_progress';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const incidents = ref<Incident[]>([
  {
    id: '1',
    title: '服务器CPU使用率过高',
    status: 'open',
    severity: 'high',
    createdAt: '2023-10-15T08:30:00Z',
    updatedAt: '2023-10-15T09:15:00Z'
  },
  {
    id: '2',
    title: '数据库连接失败',
    status: 'in_progress',
    severity: 'critical',
    createdAt: '2023-10-14T14:20:00Z',
    updatedAt: '2023-10-14T16:45:00Z'
  },
  {
    id: '3',
    title: '网站响应缓慢',
    status: 'closed',
    severity: 'medium',
    createdAt: '2023-10-10T11:05:00Z',
    updatedAt: '2023-10-12T13:30:00Z'
  }
]);

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
    case 'open': return 'status-open';
    case 'in_progress': return 'status-in-progress';
    case 'closed': return 'status-closed';
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
</script>

<template>
  <div class="incidents-page">
    <div class="page-header">
      <h1>事件列表</h1>
      <button class="refresh-button" @click="loadIncidents" :disabled="loading">
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
        刷新
      </button>
    </div>

    <div class="incidents-list" v-if="incidents.length > 0">
      <div class="incident-card" v-for="incident in incidents" :key="incident.id">
        <div class="incident-header">
          <h3>
            <router-link :to="`/incident/${incident.id}`">{{ incident.title }}</router-link>
          </h3>
          <div class="incident-meta">
            <span class="incident-id">#{{ incident.id }}</span>
            <span class="incident-status" :class="getStatusClass(incident.status)">
              {{ incident.status === 'open' ? '未解决' : incident.status === 'in_progress' ? '处理中' : '已解决' }}
            </span>
            <span class="incident-severity" :class="getSeverityClass(incident.severity)">
              {{
                incident.severity === 'low' ? '低' :
                incident.severity === 'medium' ? '中' :
                incident.severity === 'high' ? '高' : '严重'
              }}
            </span>
          </div>
        </div>
        <div class="incident-times">
          <div>创建时间: {{ formatDate(incident.createdAt) }}</div>
          <div>更新时间: {{ formatDate(incident.updatedAt) }}</div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="!loading">
      <i class="pi pi-info-circle"></i>
      <p>暂无事件记录</p>
    </div>

    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.incidents-page {
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

.incidents-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.incident-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.incident-header h3 {
  margin: 0;
  font-size: 18px;
}

.incident-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.incident-id {
  color: #666;
  font-size: 14px;
}

.incident-status, .incident-severity {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

.severity-low {
  background-color: #d4edda;
  color: #155724;
}

.severity-medium {
  background-color: #fff3cd;
  color: #856404;
}

.severity-high {
  background-color: #f8d7da;
  color: #721c24;
}

.severity-critical {
  background-color: #dc3545;
  color: white;
}

.incident-times {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
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
