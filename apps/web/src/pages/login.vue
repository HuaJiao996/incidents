<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-surface-50 p-4">
    <div class="w-full max-w-md p-6 bg-surface rounded-xl shadow-lg">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-primary mb-2">{{ t('auth.loginAccount') }}</h1>
        <p class="text-color-secondary">{{ t('auth.pleaseLogin') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm text-color-secondary">{{ t('auth.email') }}</label>
          <InputText 
            v-model="email" 
            type="email"
            class="w-full" 
            :class="{ 'p-invalid': submitted && !email }" 
            required 
            autocomplete="email"
          />
          <small v-if="submitted && !email" class="text-red-500">{{ t('auth.emailRequired') }}</small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm text-color-secondary">{{ t('auth.password') }}</label>
          <Password 
            v-model="password" 
            class="w-full" 
            :class="{ 'p-invalid': submitted && !password }" 
            :feedback="false" 
            toggleMask 
            required 
            autocomplete="current-password"
          />
          <small v-if="submitted && !password" class="text-red-500">{{ t('auth.passwordRequired') }}</small>
        </div>

        <div class="pt-4">
          <Button 
            type="submit" 
            :label="t('auth.login')" 
            class="w-full" 
            :loading="loading" 
          />
        </div>
      </form>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { authClient } from '../auth';

// 定义页面布局
definePage({
  meta: {
    layout: 'public'
  }
});

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();

const loading = ref(false);
const submitted = ref(false);

const email = ref('');
const password = ref('');

/**
 * 处理用户登录
 */
async function handleLogin() {
  submitted.value = true;
  if (!email.value || !password.value) return;

  loading.value = true;
  try {
    const result = await authClient.signIn.email({
      email: email.value,
      password: password.value,
    });

    if (result.error) {
      throw result.error;
    }

    toast.add({ 
      severity: 'success', 
      summary: t('auth.loginSuccess'), 
      detail: t('auth.welcomeBack'), 
      life: 3000 
    });

    // 登录成功，跳转到之前要去的页面或首页
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch (error: any) {
    toast.add({ 
      severity: 'error', 
      summary: t('auth.loginFailed'), 
      detail: error.message, 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
}
</script>
