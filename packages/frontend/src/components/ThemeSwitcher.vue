<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Button from 'primevue/button';

const isDark = ref(false);

// 检查系统主题偏好
const checkSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// 初始化主题
onMounted(() => {
  // 从本地存储获取主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    // 如果没有保存的主题设置，则使用系统主题
    isDark.value = checkSystemTheme();
  }
  updateTheme();
});

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

// 更新主题
const updateTheme = () => {
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');

  // 更新 HTML 元素的 data-theme 属性
  const html = document.documentElement;
  if (isDark.value) {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  } else {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark');
  }
};

// 监听系统主题变化
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches;
      updateTheme();
    }
  });
});
</script>

<template>
  <Button
    @click="toggleTheme"
    class="p-button-text !px-3 !py-2 !text-gray-600 hover:!bg-gray-100 !border !border-gray-200 !rounded-lg"
  >
    <i v-if="isDark" class="pi pi-moon text-lg"></i>
    <i v-else class="pi pi-sun text-lg"></i>
  </Button>
</template>

<style>
:root[data-theme='dark'] {
  color-scheme: dark;
}

:root[data-theme='light'] {
  color-scheme: light;
}

/* 暗黑模式下的全局样式 */
:root[data-theme='dark'] {
  --surface-ground: #121212;
  --surface-section: #1e1e1e;
  --surface-card: #262626;
  --surface-overlay: #2e2e2e;
  --surface-border: #383838;
  --text-color: #f5f5f5;
  --text-color-secondary: #e0e0e0;
  --primary-color: #90caf9;
  --primary-color-text: #121212;

  /* PrimeVue 组件样式覆盖 */
  --primary-50: #1a1a1a;
  --primary-100: #262626;
  --primary-200: #333333;
  --primary-300: #404040;
  --primary-400: #595959;
  --primary-500: #737373;
  --primary-600: #8c8c8c;
  --primary-700: #a6a6a6;
  --primary-800: #bfbfbf;
  --primary-900: #d9d9d9;

  --surface-0: #121212;
  --surface-50: #1e1e1e;
  --surface-100: #262626;
  --surface-200: #2e2e2e;
  --surface-300: #363636;
  --surface-400: #3e3e3e;
  --surface-500: #464646;
  --surface-600: #4e4e4e;
  --surface-700: #565656;
  --surface-800: #5e5e5e;
  --surface-900: #666666;
}

/* 亮色模式下的全局样式 */
:root[data-theme='light'] {
  --surface-ground: #f8f9fa;
  --surface-section: #ffffff;
  --surface-card: #ffffff;
  --surface-overlay: #ffffff;
  --surface-border: #dee2e6;
  --text-color: #495057;
  --text-color-secondary: #6c757d;
  --primary-color: #3b82f6;
  --primary-color-text: #ffffff;

  /* PrimeVue 组件样式覆盖 */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;

  --surface-0: #ffffff;
  --surface-50: #f8f9fa;
  --surface-100: #f1f3f5;
  --surface-200: #e9ecef;
  --surface-300: #dee2e6;
  --surface-400: #ced4da;
  --surface-500: #adb5bd;
  --surface-600: #868e96;
  --surface-700: #495057;
  --surface-800: #343a40;
  --surface-900: #212529;
}

/* 应用主题变量 */
.min-h-screen {
  background-color: var(--surface-ground);
  color: var(--text-color);
}

.bg-white {
  background-color: var(--surface-section) !important;
}

.text-gray-600 {
  color: var(--text-color) !important;
}

.border-gray-200 {
  border-color: var(--surface-border) !important;
}

.hover\:bg-gray-100:hover {
  background-color: var(--surface-overlay) !important;
}

/* PrimeVue 组件暗黑模式适配 */
:root[data-theme='dark'] {
  .p-component {
    color: var(--text-color);
    background-color: var(--surface-card);
  }

  .p-button {
    color: var(--text-color);
    background-color: var(--primary-color);

    &.p-button-text {
      background-color: transparent;

      &:hover {
        background-color: var(--surface-overlay);
      }
    }
  }

  .p-menubar {
    background-color: var(--surface-section);
    border-color: var(--surface-border);
  }

  .p-datatable {
    background-color: var(--surface-card);

    .p-datatable-header {
      background-color: var(--surface-section);
      border-color: var(--surface-border);
    }

    .p-datatable-tbody > tr {
      background-color: var(--surface-card);

      &:hover {
        background-color: var(--surface-overlay);
      }
    }
  }

  .p-dropdown {
    background-color: var(--surface-card);
    border-color: var(--surface-border);

    .p-dropdown-panel {
      background-color: var(--surface-overlay);
    }
  }

  .p-inputtext {
    background-color: var(--surface-card);
    border-color: var(--surface-border);
    color: var(--text-color);
  }
}
</style>
