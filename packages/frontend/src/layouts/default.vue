<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import logo from '../assets/logo.svg';
import { useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const router = useRouter();
const { t } = useI18n();

interface MenuItem {
  label: string;
  icon: string;
  to: string;
  order: number;
}

const menuItems = computed<MenuItem[]>(() => {
  const routes = router.getRoutes();
  return routes
    .filter((route) => route.meta?.menu?.title)
    .map(route => ({
      label: t(`menu.${route.meta.menu!.title}`),
      icon: route.meta.menu!.icon || getDefaultIcon(route.path),
      to: route.path,
      order: route.meta.menu!.order || 99
    }))
    .sort((a, b) => a.order - b.order);
});

function getDefaultIcon(path: string): string {
  const iconMap: Record<string, string> = {
    '/': 'pi pi-home',
    '/incident': 'pi pi-exclamation-triangle',
    '/alert': 'pi pi-bell',
    '/service': 'pi pi-cog',
    '/settings': 'pi pi-sliders-h'
  };
  return iconMap[path] || 'pi pi-file';
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="fixed top-0 left-0 w-full h-16 bg-white shadow-sm z-50">
      <div class="flex justify-between items-center w-full px-4 h-full">
        <Menubar :model="menuItems" class="border-none bg-transparent flex-1">
          <template #start>
            <div class="flex items-center mr-4">
              <img :src="logo" alt="Incidents Logo" class="w-8 h-8" />
              <span class="ml-2 text-xl font-bold text-blue-500">Incidents</span>
            </div>
          </template>
          <template #item="{ item }">
            <router-link 
              v-if="item.to" 
              :to="item.to" 
              v-slot="{ href, navigate }" 
              custom
            >
              <a 
                :href="href" 
                @click="navigate"
                class="flex items-center px-5 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <i :class="[item.icon, 'mr-2']"></i>
                <span>{{ item.label }}</span>
              </a>
            </router-link>
          </template>
          <template #end>
            <div class="flex items-center gap-4">
              <!-- <span class="relative">
                <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <InputText placeholder="搜索关键词" class="pl-10 py-2 text-sm rounded-lg border border-gray-200" />
              </span> -->
              <div class="flex items-center gap-2">
                <LanguageSwitcher />
                <Button icon="pi pi-user" class="p-button-text !w-10 !h-10 !rounded-full hover:!bg-gray-100" />
              </div>
            </div>
          </template>
        </Menubar>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="pt-16 p-8">
      <RouterView />
    </div>
  </div>
</template>

<style>
.p-menubar {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}

.p-menubar-root-list {
  gap: 0.5rem !important;
}

.p-menuitem-link {
  padding: 0.75rem 1.25rem !important;
}

.p-button.p-button-text {
  background: transparent;
  color: var(--text-color);
  border-color: transparent;
}

.p-button.p-button-text:enabled:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-color);
  border-color: transparent;
}
</style>
