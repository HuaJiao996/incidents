import type { Completion } from '@codemirror/autocomplete'
import type { CustomField, Service } from '../types/custom-field'
import i18n from '../i18n'

const { t } = i18n.global

export interface BaseField {
  label: string
  detail: string
  type?: string
  class?: string
}

export function getFieldTypeDescription(field: CustomField): string {
  const typeMap: Record<string, string> = {
    STRING: t('editor.fieldType.string'),
    NUMBER: t('editor.fieldType.number'),
    BOOLEAN: t('editor.fieldType.boolean'),
    ENUM: `${t('editor.fieldType.enum')} [${field.enumValues.join(', ')}]`,
    DATE: t('editor.fieldType.date'),
    ARRAY: t('editor.fieldType.array')
  }
  return `${typeMap[field.type]}${field.required ? ` (${t('editor.fieldType.required')})` : ''}`
}

export function generateTemplateOptions(
  baseFields: BaseField[],
  service?: Service,
  globalCustomFields?: CustomField[],
  prefix = 'alert'
) {
  const options = baseFields.map(field => ({
    label: `${prefix}.${field.label}`,
    detail: field.detail
  }))

  // 添加全局自定义字段
  if (globalCustomFields) {
    globalCustomFields.forEach(field => {
      options.push({
        label: `${prefix}.customFields.${field.path}`,
        detail: `${t('editor.field.global')} - ${getFieldTypeDescription(field)}`
      })
    })
  }

  // 添加服务特定的自定义字段
  if (service?.customFields) {
    service.customFields.forEach(field => {
      options.push({
        label: `${prefix}.customFields.${field.path}`,
        detail: `${t('editor.field.service')} - ${getFieldTypeDescription(field)}`
      })
    })
  }

  return options
}

export function generateJexlOptions(
  baseFields: BaseField[],
  service?: Service,
  globalCustomFields?: CustomField[],
  prefix = 'alert'
): Completion[] {
  const options = baseFields.map(field => ({
    label: `${prefix}.${field.label}`,
    detail: field.detail,
    type: field.type || 'property',
    class: field.class
  }))

  // 添加全局自定义字段
  if (globalCustomFields) {
    globalCustomFields.forEach(field => {
      options.push({
        label: `${prefix}.customFields.${field.path}`,
        detail: `${t('editor.field.global')} - ${getFieldTypeDescription(field)}`,
        type: 'property',
        class: 'cm-custom-field'
      })
    })
  }

  // 添加服务特定的自定义字段
  if (service?.customFields) {
    service.customFields.forEach(field => {
      options.push({
        label: `${prefix}.customFields.${field.path}`,
        detail: `${t('editor.field.service')} - ${getFieldTypeDescription(field)}`,
        type: 'property',
        class: 'cm-custom-field'
      })
    })
  }

  return options
}

// 预定义的基础字段
export function getBaseAlertFields(): BaseField[] {
  return [
    { label: 'title', detail: t('editor.alert.title'), type: 'property', class: 'cm-alert-field' },
    { label: 'content', detail: t('editor.alert.content'), type: 'property', class: 'cm-alert-field' },
    { label: 'createdAt', detail: t('editor.alert.createdAt'), type: 'property', class: 'cm-alert-field' },
    { label: 'customFields', detail: t('editor.alert.customFields'), type: 'property', class: 'cm-alert-field' }
  ]
}

export function getBaseIncidentFields(): BaseField[] {
  return [
    { label: 'status', detail: t('editor.incident.status'), type: 'property', class: 'cm-incident-field' },
    { label: 'createdAt', detail: t('editor.incident.createdAt'), type: 'property', class: 'cm-incident-field' },
    { label: 'serviceId', detail: t('editor.incident.serviceId'), type: 'property', class: 'cm-incident-field' },
    { label: 'alerts', detail: t('editor.incident.alerts'), type: 'property', class: 'cm-incident-field' }
  ]
}

export const transformOptions: Completion[] = [
  // 日期转换
  {
    label: '|date',
    detail: t('editor.transform.date'),
    type: 'function',
    info: t('editor.transform.dateInfo')
  },
  {
    label: '|after',
    detail: t('editor.transform.after'),
    type: 'function',
    info: t('editor.transform.afterInfo')
  },
  {
    label: '|before',
    detail: t('editor.transform.before'),
    type: 'function',
    info: t('editor.transform.beforeInfo')
  },
  // 字符串匹配
  {
    label: '|contains',
    detail: t('editor.transform.contains'),
    type: 'function',
    info: t('editor.transform.containsInfo')
  },
  {
    label: '|startsWith',
    detail: t('editor.transform.startsWith'),
    type: 'function',
    info: t('editor.transform.startsWithInfo')
  },
  {
    label: '|endsWith',
    detail: t('editor.transform.endsWith'),
    type: 'function',
    info: t('editor.transform.endsWithInfo')
  },
  {
    label: '|matches',
    detail: t('editor.transform.matches'),
    type: 'function',
    info: t('editor.transform.matchesInfo')
  }
]

export const operatorOptions: Completion[] = [
  { label: '==', detail: t('editor.operator.equals'), type: 'operator' },
  { label: '!=', detail: t('editor.operator.notEquals'), type: 'operator' },
  { label: '>', detail: t('editor.operator.greaterThan'), type: 'operator' },
  { label: '>=', detail: t('editor.operator.greaterThanOrEqual'), type: 'operator' },
  { label: '<', detail: t('editor.operator.lessThan'), type: 'operator' },
  { label: '<=', detail: t('editor.operator.lessThanOrEqual'), type: 'operator' },
  { label: '&&', detail: t('editor.operator.and'), type: 'operator' },
  { label: '||', detail: t('editor.operator.or'), type: 'operator' }
]
