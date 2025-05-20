<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import Select from 'primevue/select';

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

watch(selectedLanguage, (newValue) => {
  locale.value = newValue.code;
});
</script>

<template>
  <Select v-model="selectedLanguage" :options="languages" optionLabel="name" :pt="{
    root: { class: 'min-w-[100px]' },
    input: { class: 'font-normal' }
  }">
    <template #value="slotProps">
      <div class="flex align-items-center">
        <span>{{ slotProps.value?.name || slotProps.placeholder }}</span>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex align-items-center">
        <span>{{ slotProps.option.name }}</span>
      </div>
    </template>
  </Select>
</template>
