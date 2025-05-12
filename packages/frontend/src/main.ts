import './assets/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import PrimeVueConfig from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import i18n from './i18n';

async function bootstrap() {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: setupLayouts(routes),
  })
  const app = createApp(App)

  app.use(router)
  app.use(i18n)
  app.use(PrimeVueConfig, {
    theme: {
      preset: Aura,
      dark: false
    },
    ripple: true,
    inputStyle: 'filled'
  })

  app.mount('#app')
}

bootstrap()
