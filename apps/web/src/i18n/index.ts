import { createI18n } from 'vue-i18n'
import zhCN, { type MessageSchema } from './locales/zh-CN'
import enUS from './locales/en-US'



const i18n = createI18n<[MessageSchema], 'zh-CN' | 'en-US'>({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
