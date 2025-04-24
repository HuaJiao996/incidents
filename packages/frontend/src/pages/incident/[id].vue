<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const incidentId = route.params.id as string;

// 定义事件数据结构
interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'in_progress';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  timeline?: TimelineEvent[];
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'comment' | 'status_change';
  content: string;
  timestamp: string;
  user: string;
}

// 状态数据
const incident = ref<Incident | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// 加载事件详情
const loadIncidentDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch(`/api/incidents/${incidentId}`);
    // incident.value = await response.json();

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟数据
    incident.value = {
      id: incidentId,
      title: incidentId === '1' ? '服务器CPU使用率过高' : incidentId === '2' ? '数据库连接失败' : '网站响应缓慢',
      description: '详细描述内容...' + (incidentId === '1' ?
        '监控系统检测到服务器CPU使用率持续超过90%，已经持续30分钟。可能导致服务响应缓慢或不可用。' :
        incidentId === '2' ? '应用程序无法连接到主数据库，导致用户无法登录和访问数据。初步诊断显示可能是数据库服务器负载过高或网络连接问题。' :
        '用户报告网站页面加载时间超过10秒，影响了正常使用体验。初步检查显示可能是CDN缓存失效或后端服务响应慢导致。'),
      status: incidentId === '1' ? 'open' : incidentId === '2' ? 'in_progress' : 'closed',
      severity: incidentId === '1' ? 'high' : incidentId === '2' ? 'critical' : 'medium',
      assignee: incidentId === '2' ? '张工程师' : undefined,
      createdAt: incidentId === '1' ? '2023-10-15T08:30:00Z' : incidentId === '2' ? '2023-10-14T14:20:00Z' : '2023-10-10T11:05:00Z',
      updatedAt: incidentId === '1' ? '2023-10-15T09:15:00Z' : incidentId === '2' ? '2023-10-14T16:45:00Z' : '2023-10-12T13:30:00Z',
      timeline: [
        {
          id: '1',
          type: 'created',
          content: '事件已创建',
          timestamp: incidentId === '1' ? '2023-10-15T08:30:00Z' : incidentId === '2' ? '2023-10-14T14:20:00Z' : '2023-10-10T11:05:00Z',
          user: '系统'
        },
        {
          id: '2',
          type: 'comment',
          content: '已开始调查问题原因',
          timestamp: incidentId === '1' ? '2023-10-15T08:45:00Z' : incidentId === '2' ? '2023-10-14T14:35:00Z' : '2023-10-10T11:20:00Z',
          user: '李工程师'
        },
        {
          id: '3',
          type: 'status_change',
          content: incidentId === '3' ? '状态已更新: 未解决 -> 已解决' : '状态已更新: 未解决 -> 处理中',
          timestamp: incidentId === '1' ? '2023-10-15T09:15:00Z' : incidentId === '2' ? '2023-10-14T15:10:00Z' : '2023-10-12T13:30:00Z',
          user: incidentId === '2' ? '张工程师' : '李工程师'
        }
      ]
    };
  } catch (err) {
    console.error('加载事件详情失败:', err);
    error.value = '加载事件详情失败，请稍后重试';
    incident.value = null;
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadIncidentDetail();
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

// 获取时间线事件类型对应的图标
const getTimelineIcon = (type: string) => {
  switch (type) {
    case 'created': return 'pi-plus-circle';
    case 'updated': return 'pi-pencil';
    case 'comment': return 'pi-comment';
    case 'status_change': return 'pi-sync';
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
  <div class="incident-detail-page">
    <!-- 返回按钮 -->
    <div class="back-link">
      <router-link to="/incident" class="back-button">
        <i class="pi pi-arrow-left"></i> 返回事件列表
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
      <button @click="loadIncidentDetail" class="retry-button">
        <i class="pi pi-refresh"></i> 重试
      </button>
    </div>

    <!-- 事件详情 -->
    <div class="incident-detail" v-else-if="incident">
      <div class="incident-header">
        <h1>{{ incident.title }}</h1>
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

      <div class="incident-info">
        <div class="info-item">
          <span class="label">创建时间:</span>
          <span>{{ formatDate(incident.createdAt) }}</span>
        </div>
        <div class="info-item">
          <span class="label">更新时间:</span>
          <span>{{ formatDate(incident.updatedAt) }}</span>
        </div>
        <div class="info-item" v-if="incident.assignee">
          <span class="label">负责人:</span>
          <span>{{ incident.assignee }}</span>
        </div>
      </div>

      <div class="incident-description">
        <h2>描述</h2>
        <p>{{ incident.description }}</p>
      </div>

      <div class="incident-timeline" v-if="incident.timeline && incident.timeline.length > 0">
        <h2>时间线</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="event in incident.timeline" :key="event.id">
            <div class="timeline-icon">
              <i class="pi" :class="'pi-' + getTimelineIcon(event.type)"></i>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-user">{{ event.user }}</span>
                <span class="timeline-time">{{ formatDate(event.timestamp) }}</span>
              </div>
              <div class="timeline-body">{{ event.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加评论表单 -->
      <div class="add-comment">
        <h2>添加评论</h2>
        <textarea placeholder="输入您的评论..."></textarea>
        <button class="submit-button">
          <i class="pi pi-send"></i> 提交
        </button>
      </div>
    </div>

    <!-- 未找到事件 -->
    <div class="not-found" v-else>
      <i class="pi pi-exclamation-circle"></i>
      <h2>未找到事件</h2>
      <p>找不到ID为 "{{ incidentId }}" 的事件</p>
      <router-link to="/incident" class="back-link-button">
        返回事件列表
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.incident-detail-page {
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

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.incident-header h1 {
  margin: 0;
  font-size: 24px;
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

.incident-info {
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

.incident-description {
  margin-bottom: 30px;
}

.incident-description h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.incident-timeline h2 {
  font-size: 18px;
  margin-bottom: 15px;
}

.timeline {
  position: relative;
  padding-left: 30px;
  margin-bottom: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ddd;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-icon {
  position: absolute;
  left: -30px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
}

.timeline-icon i {
  font-size: 12px;
  color: #666;
}

.timeline-content {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.timeline-user {
  font-weight: 500;
}

.timeline-time {
  font-size: 12px;
  color: #666;
}

.add-comment {
  margin-top: 30px;
}

.add-comment h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.add-comment textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  resize: vertical;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
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
