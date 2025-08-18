import { EditorState } from '@codemirror/state'
import type { Extension } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'

export const baseTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '1rem',
    lineHeight: '1.5',
    fontFamily: 'var(--font-family, -apple-system)',
    color: 'var(--text-color)',
    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s'
  },
  '.cm-scroller': {
    fontFamily: 'inherit',
    height: '100% !important',
    minHeight: 'inherit',
    maxHeight: 'inherit',
    overflow: 'auto'
  },
  '.cm-content': {
    whiteSpace: 'pre-wrap',
    height: '100%',
    padding: '0.75rem !important',
    minHeight: '100%'
  },
  '.cm-line': {
    padding: '0 !important'
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-overlay) !important',
    color: 'var(--text-color) !important',
    border: '1px solid var(--surface-border) !important',
    borderRadius: 'var(--border-radius) !important',
    boxShadow: 'var(--overlay-shadow) !important'
  },
  '.cm-tooltip .cm-completionLabel': {
    color: 'var(--text-color) !important'
  },
  '.cm-tooltip .cm-completionDetail': {
    color: 'var(--text-secondary-color) !important'
  },
  '.cm-tooltip .cm-completionMatchedText': {
    color: 'var(--primary-color) !important',
    textDecoration: 'none !important',
    fontWeight: '600'
  },
  '.cm-tooltip li[aria-selected]': {
    backgroundColor: 'var(--surface-hover) !important'
  },
  '.cm-placeholder': {
    color: 'var(--text-secondary-color) !important',
    fontFamily: 'inherit'
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--text-color) !important'
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--highlight-bg) !important'
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--highlight-bg) !important'
  }
})

export const baseExtensions = [
  history(),
  javascript(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  keymap.of([...defaultKeymap, ...historyKeymap]),
  baseTheme,
  oneDark
]

export function createEditor(
  parent: HTMLElement,
  extensions: Extension[],
  doc = '',
  placeholderText = ''
) {
  const state = EditorState.create({
    doc,
    extensions: [
      ...baseExtensions,
      ...(placeholderText ? [placeholder(placeholderText)] : []),
      ...extensions
    ]
  })

  return new EditorView({
    state,
    parent
  })
}
