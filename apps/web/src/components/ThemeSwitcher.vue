<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
    class="p-button-text !px-3 !py-2 !border !rounded-lg"
  >
    <i v-if="isDark" class="pi pi-moon text-lg"></i>
    <i v-else class="pi pi-sun text-lg"></i>
  </Button>
</template>

