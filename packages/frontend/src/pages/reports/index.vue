<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义报表数据结构
interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  lastRun: string;
  nextRun: string;
  status: 'success' | 'failed' | 'running';
}

// 模拟数据
const reports = ref<Report[]>([
  {
    id: '1',
    name: '每日事件汇总',
    type: 'daily',
    lastRun: '2023-10-15T08:00:00Z',
    nextRun: '2023-10-16T08:00:00Z',
    status: 'success'
  },
  {
    id: '2',
    name: '每周性能报告',
    type: 'weekly',
    lastRun: '2023-10-14T08:00:00Z',
    nextRun: '2023-10-21T08:00:00Z',
    status: 'success'
  },
  {
    id: '3',
    name: '月度系统健康报告',
    type: 'monthly',
    lastRun: '2023-10-01T08:00:00Z',
    nextRun: '2023-11-01T08:00:00Z',
    status: 'running'
  }
]);

// 加载数据函数
const loading = ref(false);
const loadReports = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/reports');
    // reports.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载报表列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 运行报表
const runReport = async (reportId: string) => {
  try {
    // 这里应该是API调用
    // await fetch(`/api/reports/${reportId}/run`);
    // 模拟运行延迟
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('运行报表失败:', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadReports();
});

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'success': return 'status-success';
    case 'failed': return 'status-failed';
    case 'running': return 'status-running';
    default: return '';
  }
};
</script>

<template>
  <div class="reports-page">
    <h1>报表统计</h1>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>

    <!-- 报表列表 -->
    <div class="reports-list" v-else>
      <div class="report-item" v-for="report in reports" :key="report.id">
        <div class="report-header">
          <div class="report-title">
            <h3>{{ report.name }}</h3>
            <span class="report-type">{{ report.type === 'daily' ? '每日' : report.type === 'weekly' ? '每周' : '月度' }}</span>
          </div>
          <div class="report-status" :class="getStatusClass(report.status)">
            {{ report.status === 'success' ? '成功' : report.status === 'failed' ? '失败' : '运行中' }}
          </div>
        </div>

        <div class="report-body">
          <div class="report-time">
            <span class="label">上次运行:</span>
            <span>{{ formatDate(report.lastRun) }}</span>
          </div>
          <div class="report-time">
            <span class="label">下次运行:</span>
            <span>{{ formatDate(report.nextRun) }}</span>
          </div>
        </div>

        <button class="run-button" @click="runReport(report.id)">立即运行</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.reports-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.report-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.report-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-type {
  font-size: 12px;
  padding: 2px 6px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.report-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-failed {
  background-color: #f8d7da;
  color: #721c24;
}

.status-running {
  background-color: #fff3cd;
  color: #856404;
}

.report-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 15px;
}

.report-time {
  display: flex;
  gap: 5px;
}

.label {
  font-weight: 500;
  color: #666;
}

.run-button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.run-button:hover {
  background-color: #0069d9;
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
