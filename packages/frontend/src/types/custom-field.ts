export type CustomFieldType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'DATE' | 'ARRAY'

export interface CustomField {
  id: number
  path: string
  type: CustomFieldType
  required: boolean
  enumValues: string[]
  serviceId?: number
}

export interface Service {
  id: number
  name: string
  customFields: CustomField[]
}
