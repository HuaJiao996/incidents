<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- 活动事件 -->
    <div class="col-span-2">
      <div class="bg-surface-card rounded-lg p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-text-color">{{ t('incident.title') }}</h2>
        </div>

        <!-- 事件列表 -->
        <div class="space-y-4">
          <!-- P1事件 -->
          <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-red-600 dark:text-red-400 font-medium">P1</span>
                  <span class="font-medium text-text-color">{{ t('incident.examples.p1.title') }}</span>
                </div>
                <p class="text-text-color-secondary">{{ t('incident.examples.p1.description') }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-text-color-secondary text-sm">2h 15m</span>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm" />
              </div>
            </div>
          </div>

          <!-- P2事件 -->
          <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-orange-600 dark:text-orange-400 font-medium">P2</span>
                  <span class="font-medium text-text-color">{{ t('incident.examples.p2.title') }}</span>
                </div>
                <p class="text-text-color-secondary">{{ t('incident.examples.p2.description') }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-text-color-secondary text-sm">45m</span>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm" />
              </div>
            </div>
          </div>

          <!-- P3事件 -->
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-yellow-600 dark:text-yellow-400 font-medium">P3</span>
                  <span class="font-medium text-text-color">{{ t('incident.examples.p3.title') }}</span>
                </div>
                <p class="text-text-color-secondary">{{ t('incident.examples.p3.description') }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-text-color-secondary text-sm">1h 30m</span>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 值班表 -->
      <div class="bg-surface-card rounded-lg p-6 shadow-sm mt-4">
        <h2 class="text-xl font-semibold mb-6 text-text-color">{{ t('home.dutySchedule.title') }}</h2>
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in t('home.dutySchedule.weekdays')" :key="day" 
            class="text-center text-text-color-secondary font-medium">
            {{ day }}
          </div>
          <div class="bg-primary-color/10 p-3 rounded-lg text-center">
            <div class="text-primary-color font-medium">{{ t('home.dutySchedule.onDuty') }}</div>
            <div class="text-sm text-text-color-secondary">James Wilson</div>
          </div>
          <div class="bg-surface-hover p-3 rounded-lg text-center">
            <div class="text-text-color">{{ t('home.dutySchedule.offDuty') }}</div>
            <div class="text-sm text-text-color-secondary">Sarah Chen</div>
          </div>
          <div class="bg-primary-color/10 p-3 rounded-lg text-center">
            <div class="text-primary-color font-medium">{{ t('home.dutySchedule.onDuty') }}</div>
            <div class="text-sm text-text-color-secondary">Michael Brown</div>
          </div>
          <div class="bg-surface-hover p-3 rounded-lg text-center">
            <div class="text-text-color">{{ t('home.dutySchedule.offDuty') }}</div>
            <div class="text-sm text-text-color-secondary">Emma Davis</div>
          </div>
          <div class="bg-primary-color/10 p-3 rounded-lg text-center">
            <div class="text-primary-color font-medium">{{ t('home.dutySchedule.onDuty') }}</div>
            <div class="text-sm text-text-color-secondary">David Kim</div>
          </div>
          <div class="bg-primary-color/10 p-3 rounded-lg text-center">
            <div class="text-primary-color font-medium">{{ t('home.dutySchedule.onDuty') }}</div>
            <div class="text-sm text-text-color-secondary">Lisa Wang</div>
          </div>
          <div class="bg-surface-hover p-3 rounded-lg text-center">
            <div class="text-text-color">{{ t('home.dutySchedule.offDuty') }}</div>
            <div class="text-sm text-text-color-secondary">Robert Taylor</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧栏 -->
    <div class="space-y-4">
      <!-- 团队状态 -->
      <div class="bg-surface-card rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-text-color">{{ t('home.teamStatus.title') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                JW
              </div>
              <div>
                <div class="font-medium text-text-color">James Wilson</div>
                <div class="text-sm text-green-500">{{ t('home.teamStatus.online') }}</div>
              </div>
            </div>
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center text-text-color">
                SC
              </div>
              <div>
                <div class="font-medium text-text-color">Sarah Chen</div>
                <div class="text-sm text-text-color-secondary">{{ t('home.teamStatus.away') }}</div>
              </div>
            </div>
            <div class="w-2 h-2 bg-surface-hover rounded-full"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                MB
              </div>
              <div>
                <div class="font-medium text-text-color">Michael Brown</div>
                <div class="text-sm text-orange-500">{{ t('home.teamStatus.inMeeting') }}</div>
              </div>
            </div>
            <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-surface-card rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-6 text-text-color">{{ t('home.recentActivity.title') }}</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
              <i class="pi pi-check"></i>
            </div>
            <div>
              <div class="font-medium text-text-color">{{ t('home.recentActivity.networkResolved') }}</div>
              <div class="text-sm text-text-color-secondary">{{ t('home.recentActivity.timeAgo.minutes', { minutes: 15 }) }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div>
              <div class="font-medium text-text-color">{{ t('home.recentActivity.newAlert') }}</div>
              <div class="text-sm text-text-color-secondary">{{ t('home.recentActivity.timeAgo.hours', { hours: 1 }) }}</div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500">
              <i class="pi pi-users"></i>
            </div>
            <div>
              <div class="font-medium text-text-color">{{ t('home.recentActivity.shiftHandover') }}</div>
              <div class="text-sm text-text-color-secondary">{{ t('home.recentActivity.timeAgo.hours', { hours: 2 }) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义路由 meta
definePage({
  meta: {
    menu: {
      title: 'home',
      icon: 'pi pi-home',
      order: 1
    }
  }
})
</script>

<style scoped>
.p-button-sm.p-button-text {
  padding: 0.25rem;
}

.p-button-sm.p-button-text .p-button-icon {
  font-size: 1rem;
}
</style>
