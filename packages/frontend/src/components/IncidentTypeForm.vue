<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TemplateEditor from './editor/TemplateEditor.vue'
import JexlEditor from './editor/JexlEditor.vue'
import type { CustomField, Service } from '../types/custom-field'
import { generateTemplateOptions, generateJexlOptions, getBaseAlertFields, getBaseIncidentFields, operatorOptions } from '../utils/completion-options'

const { t } = useI18n()

interface IncidentType {
  id?: number
  name: string
  serviceId: number
  title: string
  description: string
  condition: string
  groupCondition: string | null
  priority: number
}

const props = defineProps<{
  modelValue: IncidentType
  service?: Service
  globalCustomFields?: CustomField[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IncidentType): void
}>()

function updateField<K extends keyof IncidentType>(field: K, value: IncidentType[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

const templateCompletions = computed(() =>
  generateTemplateOptions(getBaseAlertFields(), props.service, props.globalCustomFields)
)

const alertFieldCompletions = computed(() =>
  generateJexlOptions(getBaseAlertFields(), props.service, props.globalCustomFields)
)

const incidentFieldCompletions = computed(() =>
  generateJexlOptions(getBaseIncidentFields(), props.service, props.globalCustomFields, 'incident')
)

const groupConditionValue = computed({
  get: () => props.modelValue.groupCondition ?? '',
  set: (value: string) => updateField('groupCondition', value || null)
})
</script>

<template>
  <div class="incident-type-form">
    <div class="form-group">
      <label>{{ t('incident.type.form.name') }}</label>
      <input
        type="text"
        :value="modelValue.name"
        @input="e => updateField('name', (e.target as HTMLInputElement).value)"
        :placeholder="t('incident.type.form.name')"
      />
    </div>

    <div class="form-group">
      <label>{{ t('incident.type.form.title.label') }}</label>
      <TemplateEditor
        v-model="modelValue.title"
        :completions="templateCompletions"
        :placeholder="t('incident.type.form.title.placeholder')"
        min-height="60px"
        resizable
      />
    </div>

    <div class="form-group">
      <label>{{ t('incident.type.form.description.label') }}</label>
      <TemplateEditor
        v-model="modelValue.description"
        :completions="templateCompletions"
        :placeholder="t('incident.type.form.description.placeholder')"
        min-height="120px"
        max-height="400px"
        resizable
      />
    </div>

    <div class="form-group">
      <label>{{ t('incident.type.form.condition.label') }}</label>
      <JexlEditor
        v-model="modelValue.condition"
        :field-completions="alertFieldCompletions"
        :operator-completions="operatorOptions"
        :placeholder="t('incident.type.form.condition.placeholder')"
        min-height="60px"
        resizable
      />
    </div>

    <div class="form-group">
      <label>{{ t('incident.type.form.groupCondition.label') }}</label>
      <JexlEditor
        v-model="groupConditionValue"
        :field-completions="incidentFieldCompletions"
        :operator-completions="operatorOptions"
        :placeholder="t('incident.type.form.groupCondition.placeholder')"
        min-height="60px"
        resizable
      />
    </div>

    <div class="form-group">
      <label>{{ t('incident.type.form.priority') }}</label>
      <input
        type="number"
        :value="modelValue.priority"
        @input="e => updateField('priority', Number((e.target as HTMLInputElement).value))"
        min="0"
        step="1"
      />
    </div>
  </div>
</template>

<style scoped>
.incident-type-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type="number"] {
  width: 100px;
}
</style>
