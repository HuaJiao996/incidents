import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import vueHook from 'alova/vue'
import { createApis, withConfigType } from './createApis'
import apiDefinitions from './definitions'

export const alovaInstance = createAlova({
  baseURL: 'http://localhost:3000',
  statesHook: vueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest: (method) => {
    method.config.credentials = 'include'
  },
  responded: async (response) => {
    const json = await response.json()
    if (!response.ok) throw new Error(json.message || 'Request failed')
    return json
  },
})

export const $$userConfigMap = withConfigType({})

const Apis = {
  ...createApis(alovaInstance, $$userConfigMap),
  ...apiDefinitions
}

export default Apis
