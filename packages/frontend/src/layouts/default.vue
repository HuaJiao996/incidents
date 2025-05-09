<script setup lang="ts">
import { ref } from 'vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';

// 侧边栏状态控制
const sidebarVisible = ref(true);
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// 模拟菜单项
const menuItems = [
  { label: '仪表盘', icon: 'pi pi-home', to: '/dashboard' },
  {
    label: '事件管理',
    icon: 'pi pi-exclamation-circle',
    items: [
      { label: '事件列表', to: '/incident' },
      { label: '创建事件', to: '/incident/create' }
    ]
  },
  { label: '告警管理', icon: 'pi pi-bell', to: '/alert' },
  { label: '服务管理', icon: 'pi pi-server', to: '/service' },
  { label: '用户管理', icon: 'pi pi-user', to: '/user' }
];
</script>

<template>
  <div class="layout-wrapper">
    <!-- 顶部导航栏 -->
    <header class="layout-topbar">
      <div class="layout-topbar-left">
        <button class="menu-button p-link" @click="toggleSidebar">
          <i class="pi pi-bars"></i>
        </button>
        <div class="layout-topbar-logo">
          <span>Incidents</span>
        </div>
      </div>
      <div class="layout-topbar-right">
        <LanguageSwitcher class="language-switcher-topbar" />
        <button class="p-link">
          <i class="pi pi-bell"></i>
        </button>
        <button class="p-link">
          <i class="pi pi-user"></i>
        </button>
      </div>
    </header>

    <!-- 侧边菜单 -->
    <div class="layout-sidebar" :class="{ 'layout-sidebar-active': sidebarVisible }">
      <div class="layout-menu-container">
        <ul class="layout-menu">
          <li v-for="(item, index) in menuItems" :key="index" class="layout-menuitem">
            <router-link :to="item.to" class="layout-menuitem-link">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="layout-main">
      <div class="layout-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-ground, #f8f9fa);
}

.language-switcher-topbar {
  margin: 0;
  padding: 0;
  border: none;
}

.layout-topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  padding: 0 2rem;
  background-color: var(--surface-card, white);
  color: var(--text-color, #495057);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.layout-topbar-left {
  display: flex;
  align-items: center;
}

.layout-topbar-logo {
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 1rem;
}

.layout-topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-switcher-topbar :deep(.language-switcher) {
  margin: 0;
  padding: 0;
  border: none;
}

.language-switcher-topbar :deep(.language-options) {
  display: flex;
  gap: 5px;
  margin: 0;
}

.language-switcher-topbar :deep(h3) {
  display: none;
}

.language-switcher-topbar :deep(button) {
  padding: 3px 8px;
  font-size: 0.8rem;
  background-color: transparent;
  border: 1px solid var(--surface-border, #dee2e6);
  border-radius: 4px;
}

.menu-button,
.p-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: transparent;
  border: none;
  color: var(--text-color, #495057);
}

.menu-button:hover,
.p-link:hover {
  background-color: var(--surface-hover, #e9ecef);
}

.layout-sidebar {
  position: fixed;
  top: 4rem;
  left: 0;
  width: 250px;
  height: calc(100vh - 4rem);
  background-color: var(--surface-overlay, white);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  z-index: 998;
  transition: transform 0.2s, left 0.2s;
  overflow-y: auto;
}

.layout-sidebar:not(.layout-sidebar-active) {
  transform: translateX(-100%);
}

.layout-menu-container {
  padding: 1.5rem 0;
}

.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.layout-menuitem {
  padding: 0.5rem 1.5rem;
}

.layout-menuitem-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-color, #495057);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.layout-menuitem-link:hover {
  background-color: var(--surface-hover, #e9ecef);
}

.layout-menuitem-link i {
  margin-right: 0.5rem;
}

.layout-main {
  margin-top: 4rem;
  margin-left: 250px;
  min-height: calc(100vh - 4rem);
  padding: 2rem;
  transition: margin-left 0.2s;
}

.layout-sidebar:not(.layout-sidebar-active) + .layout-main {
  margin-left: 0;
}

.layout-content {
  background-color: var(--surface-card, white);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 991px) {
  .layout-sidebar {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .layout-main {
    margin-left: 0;
  }
}
</style>
