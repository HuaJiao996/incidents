<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  const html = document.documentElement;
  if (isDark) {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  } else {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark');
  }
});
</script>

<template>
  <RouterView/>
</template>

