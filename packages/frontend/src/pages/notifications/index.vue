<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义通知配置数据结构
interface NotificationConfig {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'webhook' | 'slack';
  enabled: boolean;
  recipients: string[];
  triggers: string[];
}

// 模拟数据
const configs = ref<NotificationConfig[]>([
  {
    id: '1',
    name: '邮件通知',
    type: 'email',
    enabled: true,
    recipients: ['admin@example.com', 'ops@example.com'],
    triggers: ['critical', 'high']
  },
  {
    id: '2',
    name: '短信通知',
    type: 'sms',
    enabled: false,
    recipients: ['+8613800000000'],
    triggers: ['critical']
  },
  {
    id: '3',
    name: 'Slack通知',
    type: 'slack',
    enabled: true,
    recipients: ['https://hooks.slack.com/services/xxx'],
    triggers: ['critical', 'high', 'medium']
  }
]);

// 加载数据函数
const loading = ref(false);
const loadConfigs = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/notifications/configs');
    // configs.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载通知配置失败:', error);
  } finally {
    loading.value = false;
  }
};

// 保存配置
const saveConfigs = async () => {
  try {
    // 这里应该是API调用
    // await fetch('/api/notifications/configs', {
    //   method: 'POST',
    //   body: JSON.stringify(configs.value)
    // });
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('保存通知配置失败:', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadConfigs();
});
</script>

<template>
  <div class="notifications-page">
    <h1>通知配置</h1>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>

    <!-- 配置列表 -->
    <div class="configs-list" v-else>
      <div class="config-item" v-for="config in configs" :key="config.id">
        <div class="config-header">
          <div class="config-title">
            <h3>{{ config.name }}</h3>
            <span class="config-type">{{ config.type }}</span>
          </div>
          <div class="config-toggle">
            <input type="checkbox" v-model="config.enabled" class="toggle-input" />
            <span class="toggle-label">{{ config.enabled ? '启用' : '禁用' }}</span>
          </div>
        </div>

        <div class="config-body">
          <div class="config-recipients">
            <span class="label">接收人:</span>
            <span>{{ config.recipients.join(', ') }}</span>
          </div>
          <div class="config-triggers">
            <span class="label">触发条件:</span>
            <span>{{ config.triggers.join(', ') }}</span>
          </div>
        </div>
      </div>

      <button class="save-button" @click="saveConfigs">保存配置</button>
    </div>
  </div>
</template>

<style scoped>
.notifications-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.configs-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.config-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.config-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-type {
  font-size: 12px;
  padding: 2px 6px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.config-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-input {
  width: 20px;
  height: 20px;
}

.config-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.config-recipients, .config-triggers {
  display: flex;
  gap: 5px;
}

.label {
  font-weight: 500;
  color: #666;
}

.save-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
}

.save-button:hover {
  background-color: #45a049;
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
