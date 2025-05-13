<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorView } from '@codemirror/view'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete'
import type { CompletionResult, Completion } from '@codemirror/autocomplete'
import { createEditor } from './codemirror'
import { transformOptions } from '../../utils/completion-options'

const model = defineModel<string>()

const props = defineProps<{
  placeholder?: string
  fieldCompletions: Completion[]
  operatorCompletions?: Completion[]
  minHeight?: string
  maxHeight?: string
  resizable?: boolean
}>()

const editorRef = ref<HTMLDivElement>()
let editor: EditorView | undefined

// 自动补全配置
function jexlCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[a-zA-Z0-9_.|]*$/)
  if (!word) return null

  // 处理 transform 补全
  if (word.text.includes('|')) {
    return {
      from: word.from + word.text.lastIndexOf('|') + 1,
      options: transformOptions,
      validFor: /^[a-zA-Z]*$/
    }
  }

  // 处理操作符补全
  if (context.matchBefore(/[|=!<>]/) || context.matchBefore(/\s+/)) {
    return {
      from: word.from,
      options: props.operatorCompletions ?? [],
      validFor: /^[|=!<>&]*$/
    }
  }

  // 处理字段补全
  const lastDotIndex = word.text.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    // 如果有点号，从点号后面开始补全
    const prefix = word.text.slice(0, lastDotIndex)
    const options = props.fieldCompletions.filter(option =>
      option.label.startsWith(prefix + '.')
    ).map(option => ({
      ...option,
      label: option.label.slice(prefix.length + 1) // 移除前缀
    }))
    return {
      from: word.from + lastDotIndex + 1,
      options,
      validFor: /^[a-zA-Z0-9_.]*$/
    }
  } else {
    // 如果没有点号，显示所有顶级字段
    const options = props.fieldCompletions.filter(option =>
      !option.label.slice(0, option.label.indexOf('.')).includes('.')
    )
    return {
      from: word.from,
      options,
      validFor: /^[a-zA-Z0-9_.]*$/
    }
  }
}

onMounted(() => {
  if (!editorRef.value) return

  editor = createEditor(
    editorRef.value,
    [
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          model.value = update.state.doc.toString()
        }
      }),
      autocompletion({
        override: [jexlCompletions],
        defaultKeymap: true,
        maxRenderedOptions: 50,
        activateOnTyping: true,
        icons: false
      })
    ],
    model.value,
    props.placeholder
  )
})

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<template>
  <div
    ref="editorRef"
    class="jexl-editor"
    :class="{ 'resizable': resizable }"
    :style="{
      minHeight: minHeight || '100px',
      maxHeight: maxHeight,
      resize: resizable ? 'vertical' : 'none'
    }"
  />
</template>

<style scoped>
.jexl-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--surface-ground);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  font-size: 1rem;
  font-family: var(--font-family, -apple-system);
  line-height: 1.5;
  width: 100%;
}

.jexl-editor:hover {
  border-color: var(--primary-color);
}

.jexl-editor:focus-within {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 2px var(--surface-ground), 0 0 0 4px var(--primary-color);
  border-color: var(--primary-color);
}

.jexl-editor.resizable {
  resize: vertical;
  overflow: auto;
}

.jexl-editor :deep(.cm-editor) {
  flex: 1;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
</style>

<style>
/* 语法高亮 */
.cm-editor .cm-operator {
  color: var(--primary-color) !important;
}

.cm-editor .cm-string {
  color: var(--green-500) !important;
}

.cm-editor .cm-number {
  color: var(--orange-500) !important;
}

.cm-editor .cm-atom {
  color: var(--primary-color) !important;
}

.cm-editor .cm-propertyName {
  color: var(--text-color) !important;
}

.cm-editor .cm-variableName {
  color: var(--text-color) !important;
}

.cm-editor .cm-punctuation {
  color: var(--text-secondary-color) !important;
}

.cm-editor .cm-bool {
  color: var(--primary-color) !important;
}

/* 自定义字段高亮 */
.cm-alert-field {
  background-color: var(--yellow-100);
  color: var(--yellow-900);
  border-radius: var(--border-radius);
  padding: 0 2px;
}

.cm-custom-field {
  background-color: var(--blue-100);
  color: var(--blue-900);
  border-radius: var(--border-radius);
  padding: 0 2px;
}

:root[data-theme="dark"] .cm-alert-field {
  background-color: var(--yellow-900);
  color: var(--yellow-100);
}

:root[data-theme="dark"] .cm-custom-field {
  background-color: var(--blue-900);
  color: var(--blue-100);
}
</style>
