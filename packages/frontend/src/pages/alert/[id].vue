<template>
  <div class="alert-detail-container">
    <h1>告警详情: #{{ alertId }} {{ alertTitle }}</h1>

    <!-- 主要信息区 -->
    <div class="main-info">
      <div class="basic-info">
        <h2>基本信息</h2>
        <div class="info-row">
          <span class="label">标题:</span>
          <span class="value">{{ alertDetail.title }}</span>
        </div>
        <div class="info-row">
          <span class="label">描述:</span>
          <span class="value">{{ alertDetail.description }}</span>
        </div>
        <div class="info-row">
          <span class="label">类型:</span>
          <span class="value">{{ alertDetail.type }}</span>
        </div>
        <div class="info-row">
          <span class="label">严重程度:</span>
          <span class="value">{{ alertDetail.severity }}</span>
        </div>
        <div class="info-row">
          <span class="label">来源:</span>
          <span class="value">{{ alertDetail.source }}</span>
        </div>
        <div class="info-row">
          <span class="label">服务:</span>
          <span class="value">{{ alertDetail.service }}</span>
        </div>
        <div class="info-row">
          <span class="label">关联事件:</span>
          <span class="value">{{ alertDetail.incident || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">创建时间:</span>
          <span class="value">{{ alertDetail.createdAt }}</span>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="detail-info">
        <h2>详细信息</h2>
        <div class="detail-content">
          <div v-for="(value, key) in alertDetail.details" :key="key" class="detail-row">
            <span class="detail-label">{{ key }}:</span>
            <span class="detail-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="action-section">
      <Button label="返回列表" @click="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';

const route = useRoute();
const router = useRouter();
const alertId = route.params.id as string;

// 模拟告警数据
const alertDetail = ref({
  title: '',
  description: '',
  type: '',
  severity: '',
  source: '',
  service: '',
  incident: '',
  createdAt: '',
  details: {}
});

const alertTitle = ref('');

// 加载告警详情
const loadAlertDetail = async () => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟数据
  alertDetail.value = {
    title: `Alert ${alertId}`,
    description: `Details about alert ${alertId}`,
    type: 'Trigger',
    severity: 'critical',
    source: 'monitoring-system',
    service: 'ServiceA',
    incident: alertId === '1' ? '#1' : '-',
    createdAt: '2023-10-27 10:00',
    details: {
      hostname: 'server-01',
      ip_address: '192.168.1.100',
      cpu_usage: '95%',
      memory_usage: '85%'
    }
  };

  alertTitle.value = alertDetail.value.title;
};

// 返回列表
const goBack = () => {
  router.push('/alert');
};

// 页面加载时获取数据
onMounted(() => {
  loadAlertDetail();
});
</script>

<style scoped>
.alert-detail-container {
  padding: 20px;
}

.main-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.basic-info, .detail-info {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.label {
  width: 100px;
  font-weight: bold;
}

.value {
  flex: 1;
}

.detail-content {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  width: 120px;
  font-weight: bold;
}

.detail-value {
  flex: 1;
}

.action-section {
  text-align: right;
  margin-top: 20px;
}
</style>
