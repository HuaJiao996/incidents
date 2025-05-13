<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorView, Decoration } from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete'
import type { CompletionResult, Completion } from '@codemirror/autocomplete'
import { StateField, StateEffect } from '@codemirror/state'
import { createEditor } from './codemirror'

const model = defineModel<string>()

const props = defineProps<{
  placeholder?: string
  completions: Completion[]
  minHeight?: string
  maxHeight?: string
  resizable?: boolean
}>()

const editorRef = ref<HTMLDivElement>()
let editor: EditorView | undefined

// 创建装饰器效果
const addDecoration = StateEffect.define<DecorationSet>()

// 创建装饰器状态字段
const decorationField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(decorations, tr) {
    for (let e of tr.effects) {
      if (e.is(addDecoration)) {
        return e.value
      }
    }
    return decorations.map(tr.changes)
  },
  provide: f => EditorView.decorations.from(f)
})

// 自动补全配置
function templateCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/#\{[^}]*$/)
  if (!word) return null

  return {
    from: word.from + 2, // Skip #{ prefix
    options: props.completions,
    validFor: /^[a-zA-Z0-9_.]*$/
  }
}

onMounted(() => {
  if (!editorRef.value) return

  editor = createEditor(
    editorRef.value,
    [
      decorationField,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          model.value = update.state.doc.toString()
        }
      }),
      autocompletion({
        override: [templateCompletions],
        defaultKeymap: true,
        maxRenderedOptions: 50,
        activateOnTyping: true,
        icons: false
      }),
      // 添加自定义语法高亮
      EditorView.theme({
        '.cm-template-expression': {
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--border-radius)',
          padding: '0 2px',
          margin: '0 1px'
        },
        '.cm-template-bracket': {
          color: 'var(--primary-500)'
        },
        '.cm-template-field': {
          color: 'var(--text-color)',
          fontWeight: '500'
        }
      }),
      EditorView.lineWrapping,
      EditorView.updateListener.of(update => {
        // 更新模板表达式的样式
        const doc = update.state.doc
        const decorations: Array<{ from: number; to: number; class: string }> = []
        let pos = 0

        while (pos < doc.length) {
          const startMatch = doc.sliceString(pos).match(/#\{/)
          if (!startMatch) break

          const startPos = pos + startMatch.index!
          const endMatch = doc.sliceString(startPos).match(/}/)
          if (!endMatch) break

          const endPos = startPos + endMatch.index! + 1

          // 添加整体背景
          decorations.push({
            from: startPos,
            to: endPos,
            class: 'cm-template-expression'
          })

          // 添加括号样式
          decorations.push({
            from: startPos,
            to: startPos + 2,
            class: 'cm-template-bracket'
          })
          decorations.push({
            from: endPos - 1,
            to: endPos,
            class: 'cm-template-bracket'
          })

          // 添加字段样式
          decorations.push({
            from: startPos + 2,
            to: endPos - 1,
            class: 'cm-template-field'
          })

          pos = endPos
        }

        if (editor) {
          const decorationSet = Decoration.set(
            decorations.map(({ from, to, class: className }) =>
              Decoration.mark({ class: className }).range(from, to)
            )
          )
          editor.dispatch({
            effects: addDecoration.of(decorationSet)
          })
        }
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
    class="template-editor"
    :class="{ 'resizable': resizable }"
    :style="{
      minHeight: minHeight || '100px',
      maxHeight: maxHeight,
      resize: resizable ? 'vertical' : 'none'
    }"
  />
</template>

<style scoped>
.template-editor {
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

.template-editor:hover {
  border-color: var(--primary-color);
}

.template-editor:focus-within {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 2px var(--surface-ground), 0 0 0 4px var(--primary-color);
  border-color: var(--primary-color);
}

.template-editor.resizable {
  resize: vertical;
  overflow: auto;
}

.template-editor :deep(.cm-editor) {
  flex: 1;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
</style>

<style>
/* 模板表达式样式 */
.cm-template-expression {
  background-color: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--border-radius);
  padding: 0 2px;
  margin: 0 1px;
}

.cm-template-bracket {
  color: var(--primary-500);
}

.cm-template-field {
  color: var(--text-color);
  font-weight: 500;
}
</style>
