<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义设置项数据结构
interface Setting {
  id: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  description?: string;
}

// 模拟数据
const settings = ref<Setting[]>([
  {
    id: '1',
    name: '系统名称',
    value: '事件管理系统',
    type: 'text',
    description: '系统显示名称'
  },
  {
    id: '2',
    name: '自动刷新间隔',
    value: 30,
    type: 'number',
    description: '数据自动刷新间隔(秒)'
  },
  {
    id: '3',
    name: '启用暗黑模式',
    value: false,
    type: 'boolean',
    description: '切换系统主题'
  },
  {
    id: '4',
    name: '默认语言',
    value: 'zh-CN',
    type: 'select',
    options: ['zh-CN', 'en-US'],
    description: '系统默认语言'
  }
]);

// 加载数据函数
const loading = ref(false);
const loadSettings = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，现在使用模拟数据
    // const response = await fetch('/api/settings');
    // settings.value = await response.json();
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载系统设置失败:', error);
  } finally {
    loading.value = false;
  }
};

// 保存设置
const saveSettings = async () => {
  try {
    // 这里应该是API调用
    // await fetch('/api/settings', {
    //   method: 'POST',
    //   body: JSON.stringify(settings.value)
    // });
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('保存系统设置失败:', error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadSettings();
});

// 定义路由 meta
definePage({
  meta: {
    menu: {
      title: 'settings',
      icon: 'pi pi-sliders-h',
      order: 5
    }
  }
})
</script>

<template>
  <div class="settings-page">
    <h1>系统设置</h1>

    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>加载中...</p>
    </div>

    <!-- 设置表单 -->
    <div class="settings-form" v-else>
      <div class="setting-item" v-for="setting in settings" :key="setting.id">
        <div class="setting-info">
          <h3>{{ setting.name }}</h3>
          <p class="setting-description" v-if="setting.description">{{ setting.description }}</p>
        </div>

        <div class="setting-control">
          <input
            v-if="setting.type === 'text'"
            type="text"
            v-model="setting.value"
            class="setting-input"
          />

          <input
            v-if="setting.type === 'number'"
            type="number"
            v-model="setting.value"
            class="setting-input"
          />

          <select
            v-if="setting.type === 'select' && setting.options"
            v-model="setting.value"
            class="setting-select"
          >
            <option v-for="option in setting.options" :value="option" :key="option">
              {{ option }}
            </option>
          </select>

          <input
            v-if="setting.type === 'boolean'"
            type="checkbox"
            v-model="setting.value"
            class="setting-checkbox"
          />
        </div>
      </div>

      <button class="save-button" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.setting-info {
  flex: 1;
}

.setting-description {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.setting-control {
  margin-left: 20px;
}

.setting-input, .setting-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.setting-checkbox {
  width: 20px;
  height: 20px;
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
