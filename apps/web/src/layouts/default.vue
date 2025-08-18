<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import ThemeSwitcher from '../components/ThemeSwitcher.vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import logo from '../assets/logo.svg';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { authClient } from '../auth';

const router = useRouter();
const { t } = useI18n();
const toast = useToast();

const session = authClient.useSession();
const userMenu = ref();

interface MenuItem {
  label: string;
  icon: string;
  to: string;
  order: number;
}

const menuItems = computed<MenuItem[]>(() => {
  const routes = router.getRoutes();
  return routes
    .filter(route => route.meta?.menu?.title)
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

const userMenuItems = computed(() => [
  {
    label: t('common.profile'),
    icon: 'pi pi-user',
    command: () => router.push('/profile')
  },
  {
    separator: true
  },
  {
    label: t('auth.logout'),
    icon: 'pi pi-sign-out',
    command: async () => {
      try {
        await authClient.signOut();
        router.push('/login');
      } catch (error: any) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 3000 });
      }
    }
  }
]);
</script>

<template>
  <div class="min-h-screen">
    <!-- 顶部导航栏 -->
    <div class="fixed top-0 left-0 w-full shadow-sm z-50 bg-surface">
      <Menubar :model="menuItems" class="border-none bg-transparent flex-1">
        <template #start>
          <div class="flex items-center ml-2 mr-4">
            <img :src="logo" alt="Incidents Logo" class="w-8 h-8" />
            <span class="ml-2 text-xl font-bold text-primary">Incidents</span>
          </div>
        </template>
        <template #item="{ item }">
          <router-link v-if="item.to" :to="item.to" v-slot="{ href, navigate }" custom>
            <a :href="href" @click="navigate"
              class="flex items-center px-5 py-3 rounded-lg hover:bg-hover text-default">
              <i :class="[item.icon, 'mr-2']"></i>
              <span>{{ item.label }}</span>
            </a>
          </router-link>
        </template>
        <template #end>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Button
                :label="session.data?.user.name"
                icon="pi pi-user"
                class="p-button-text"
                @click="(event) => userMenu.toggle(event)" />
              <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
            </div>
          </div>
        </template>
      </Menubar>
    </div>

    <!-- 主内容区域 -->
    <div class="pt-16 p-8">
      <RouterView />
    </div>
  </div>
</template>
