<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
//  TODO: 页面内容
</script>

<template>
  <div class="index-page">
    <h1>{{ t('pages.index.title') }}</h1>
    <p>{{ t('common.welcome') }}</p>
  </div>
</template>

<style scoped>
.index-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
