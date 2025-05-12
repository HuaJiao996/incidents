<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import Button from 'primevue/button';

const { locale } = useI18n();

interface LanguageOption {
  name: string;
  code: 'zh-CN' | 'en-US';
}

const languages: LanguageOption[] = [
  { name: '中文', code: 'zh-CN' },
  { name: 'English', code: 'en-US' }
];

const selectedLanguage = ref(languages.find(lang => lang.code === locale.value) || languages[0]);
const visible = ref(false);

watch(selectedLanguage, (newValue) => {
  locale.value = newValue.code;
  visible.value = false;
});

const toggleMenu = () => {
  visible.value = !visible.value;
};

const selectLanguage = (lang: LanguageOption) => {
  selectedLanguage.value = lang;
};
</script>

<template>
  <div class="language-switcher relative">
    <Button 
      @click="toggleMenu"
      class="p-button-text !px-3 !py-2 !text-gray-600 hover:!bg-gray-100 !border !border-gray-200 !rounded-lg"
    >
      <span class="font-normal">{{ selectedLanguage.name }}</span>
      <i class="pi pi-chevron-down ml-1 text-xs"></i>
    </Button>
    
    <!-- 下拉菜单 -->
    <div v-if="visible" 
      class="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px]"
      @click.stop
    >
      <div
        v-for="lang in languages"
        :key="lang.code"
        class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-600"
        :class="{ 'bg-gray-50': selectedLanguage.code === lang.code }"
        @click="selectLanguage(lang)"
      >
        {{ lang.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
