<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';

const { locale } = useI18n();

interface LanguageOption {
  name: string;
  code: 'zh-CN' | 'en-US';
}

const languages: LanguageOption[] = [
  { name: 'common.chinese', code: 'zh-CN' },
  { name: 'common.english', code: 'en-US' }
];

const selectedLanguage = ref(languages.find(lang => lang.code === locale.value) || languages[0]);

watch(selectedLanguage, (newValue) => {
  locale.value = newValue.code;
});
</script>

<template>
  <div class="language-switcher">
    <div class="language-dropdown">
      <Dropdown
        v-model="selectedLanguage"
        :options="languages"
        optionLabel="name"
        :placeholder="$t('components.languageSwitcher.select')"
        class="language-select"
      >
        <template #option="slotProps">
          <div class="language-option">
            {{ $t(slotProps.option.name) }}
          </div>
        </template>
        <template #value="slotProps">
          <div class="language-value" v-if="slotProps.value">
            {{ $t(slotProps.value.name) }}
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  margin: 20px 0;
  padding: 12px;
  border: 1px solid var(--surface-border, #eee);
  border-radius: 8px;
  background-color: var(--surface-card, #fff);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.language-dropdown {
  margin-top: 12px;
}

.language-select {
  width: 100%;
  max-width: 200px;
}

.language-option,
.language-value {
  display: flex;
  align-items: center;
  font-weight: 500;
}

:deep(.language-switcher-topbar) .language-dropdown {
  margin-top: 0;
}

:deep(.language-switcher-topbar) .language-select {
  max-width: 120px;
  font-size: 0.85rem;
}

:deep(.language-switcher-topbar) h3 {
  display: none;
}
</style>
