import './assets/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import PrimeVueConfig from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import i18n from './i18n';

const CustomAuraPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // 这是logo的主色
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    }
  }
});

async function bootstrap() {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: setupLayouts(routes),
  })
  const app = createApp(App)

  // 创建 PrimeVue 配置
  const primeVueConfig = {
    theme: {
      preset: CustomAuraPreset,
      options: {
        darkModeSelector: '.dark',
      }
    },
    ripple: true,
    inputStyle: 'filled',
  }

  app.use(router)
  app.use(i18n)
  app.use(PrimeVueConfig, primeVueConfig)

  app.mount('#app')
}

bootstrap()
