<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TemplateEditor from '../../components/editor/TemplateEditor.vue'
import JexlEditor from '../../components/editor/JexlEditor.vue'
import { generateTemplateOptions, generateJexlOptions, getBaseAlertFields, getBaseIncidentFields, operatorOptions, transformOptions } from '../../utils/completion-options'
import type { CustomField, Service } from '../../types/custom-field'

const { t } = useI18n()

// 模拟数据
const mockService = ref<Service>({
  id: 1,
  name: 'Test Service',
  customFields: [
    {
      id: 1,
      path: 'severity',
      type: 'ENUM',
      required: true,
      enumValues: ['low', 'medium', 'high', 'critical']
    },
    {
      id: 2,
      path: 'region',
      type: 'STRING',
      required: false,
      enumValues: []
    }
  ]
})

const mockGlobalFields = ref<CustomField[]>([
  {
    id: 3,
    path: 'environment',
    type: 'ENUM',
    required: true,
    enumValues: ['dev', 'staging', 'prod']
  },
  {
    id: 4,
    path: 'team',
    type: 'STRING',
    required: false,
    enumValues: []
  }
])

// 编辑器的值
const templateValue = ref('#{alert.title} - #{alert.customFields.severity}')
const conditionValue = ref('alert.customFields.severity == "critical" && alert.customFields.environment|matches("^prod")')
const groupConditionValue = ref('incident.status == "OPEN" && alert.customFields.region == incident.alerts[0].customFields.region')

// 生成补全选项
const templateCompletions = computed(() =>
  generateTemplateOptions(getBaseAlertFields(), mockService.value, mockGlobalFields.value)
)

const alertFieldCompletions = computed(() =>
  generateJexlOptions(getBaseAlertFields(), mockService.value, mockGlobalFields.value)
)

const incidentFieldCompletions = computed(() =>
  generateJexlOptions(getBaseIncidentFields(), mockService.value, mockGlobalFields.value, 'incident')
)

// 测试表达式
const testContext = {
  alert: {
    title: 'High CPU Usage',
    content: 'CPU usage is above 90%',
    createdAt: '2024-03-15T10:00:00Z',
    customFields: {
      severity: 'critical',
      region: 'us-east-1',
      environment: 'prod',
      team: 'infrastructure'
    }
  },
  incident: {
    status: 'OPEN',
    createdAt: '2024-03-15T09:50:00Z',
    alerts: [{
      customFields: {
        region: 'us-east-1'
      }
    }]
  }
}

// 表达式求值结果
const evaluationResult = ref('')

// 测试表达式求值
async function evaluateExpression(expression: string) {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expression,
        context: testContext
      })
    })
    const result = await response.json()
    evaluationResult.value = JSON.stringify(result, null, 2)
  } catch (error) {
    evaluationResult.value = `Error: ${error}`
  }
}
</script>

<template>
  <div class="editor-test">
    <h1>{{ t('editor.test.title') }}</h1>

    <section class="test-section">
      <h2>{{ t('editor.test.templateEditor') }}</h2>
      <div class="editor-container">
        <TemplateEditor
          v-model="templateValue"
          :completions="templateCompletions"
          :placeholder="t('editor.test.templatePlaceholder')"
        />
      </div>
      <div class="preview">
        <h3>{{ t('editor.test.preview') }}</h3>
        <pre>{{ templateValue }}</pre>
      </div>
    </section>

    <section class="test-section">
      <h2>{{ t('editor.test.conditionEditor') }}</h2>
      <div class="editor-container">
        <JexlEditor
          v-model="conditionValue"
          :field-completions="alertFieldCompletions"
          :operator-completions="operatorOptions"
          :transform-completions="transformOptions"
          :placeholder="t('editor.test.conditionPlaceholder')"
        />
      </div>
      <div class="preview">
        <h3>{{ t('editor.test.expression') }}</h3>
        <pre>{{ conditionValue }}</pre>
        <button @click="evaluateExpression(conditionValue)">
          {{ t('editor.test.evaluate') }}
        </button>
      </div>
    </section>

    <section class="test-section">
      <h2>{{ t('editor.test.groupConditionEditor') }}</h2>
      <div class="editor-container">
        <JexlEditor
          v-model="groupConditionValue"
          :field-completions="incidentFieldCompletions"
          :operator-completions="operatorOptions"
          :transform-completions="transformOptions"
          :placeholder="t('editor.test.groupConditionPlaceholder')"
        />
      </div>
      <div class="preview">
        <h3>{{ t('editor.test.expression') }}</h3>
        <pre>{{ groupConditionValue }}</pre>
        <button @click="evaluateExpression(groupConditionValue)">
          {{ t('editor.test.evaluate') }}
        </button>
      </div>
    </section>

    <section class="test-section">
      <h2>{{ t('editor.test.context') }}</h2>
      <pre>{{ JSON.stringify(testContext, null, 2) }}</pre>
    </section>

    <section class="test-section" v-if="evaluationResult">
      <h2>{{ t('editor.test.result') }}</h2>
      <pre>{{ evaluationResult }}</pre>
    </section>
  </div>
</template>

<style scoped>
.editor-test {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.test-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.editor-container {
  margin-bottom: 1rem;
}

.preview {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.preview h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

pre {
  margin: 0;
  padding: 1rem;
  background: #2d2d2d;
  color: #fff;
  border-radius: 4px;
  overflow-x: auto;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>
