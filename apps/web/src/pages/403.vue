<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const { t } = useI18n();
const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50">
    <div class="text-center">
      <div class="mb-6">
        <i class="pi pi-lock text-6xl text-red-500"></i>
      </div>
      
      <h1 class="text-4xl font-bold text-color mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-color mb-4">{{ t('error.accessDenied') }}</h2>
      <p class="text-color-secondary mb-8 max-w-md">
        {{ t('error.accessDeniedDesc') }}
      </p>
      
      <div class="flex gap-4 justify-center">
        <Button 
          :label="t('common.goBack')" 
          severity="secondary" 
          @click="goBack" 
        />
        <Button 
          :label="t('common.goHome')" 
          @click="goHome" 
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: false
</route>