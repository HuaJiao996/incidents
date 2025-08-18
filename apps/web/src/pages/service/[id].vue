<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Card from 'primevue/card'

const { t } = useI18n()
const route = useRoute()
const serviceId = route.params.id as string

// 定义服务数据结构
interface Service {
  id: string
  name: string
  description: string
}

// 状态数据
const service = ref<Service | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('basic')

// 示例请求数据
const examplePayload = ref<string>(
  JSON.stringify(
    {
      title: '系统告警示例',
      description: '详细告警信息...',
      severity: 'critical',
      source: '监控系统',
      details: {
        hostname: 'server-01',
        ip_address: '192.168.1.100',
      },
    },
    null,
    2,
  ),
)

// 加载服务详情
const loadServiceDetail = async () => {
  loading.value = true
  error.value = null

  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))
    service.value = {
      id: serviceId,
      name: 'ServiceA',
      description: '核心业务服务',
    }
  } catch (err) {
    console.error('加载服务详情失败:', err)
    error.value = '加载服务详情失败，请稍后重试'
    service.value = null
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadServiceDetail()
})

// 事件类型数据
const incidentTypes = ref([
  { id: 1, name: 'TypeA', description: 'Default type', createdAt: '2023-10-27' },
  { id: 2, name: 'TypeB', description: 'Critical type', createdAt: '2023-10-27' },
])

// 路由配置数据
const routes = ref([{ id: 1, service: 'ServiceA', target: 'Team A', createdAt: '2023-10-27' }])

// 自定义字段数据
const customFields = ref([
  { id: 1, service: 'ServiceA', name: 'hostname', type: 'Text', createdAt: '2023-10-27' },
])
</script>

<template>
  <div class="surface-ground">
    <!-- 页面标题 -->
    <div class="surface-section px-4 py-2 flex align-items-center border-bottom-1 surface-border">
      <div class="flex align-items-center gap-2">
        <span class="text-xl">服务详情: ServiceA</span>
        <Button class="p-button-text p-button-plain" link>
          <i class="pi pi-arrow-left mr-1" style="font-size: 0.8rem" />
          <span class="text-sm">返回列表</span>
        </Button>
      </div>
    </div>

    <div class="p-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="surface-section p-4 border-round">
        <div class="flex align-items-center justify-content-center">
          <ProgressSpinner />
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="surface-section p-4 border-round">
        <div class="flex flex-column align-items-center gap-2">
          <Message severity="error" :text="error" />
          <Button icon="pi pi-refresh" label="重试" @click="loadServiceDetail" />
        </div>
      </div>

      <!-- 服务详情内容 -->
      <div v-else-if="service" class="surface-section border-round">
        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab value="basic">
              <div class="flex align-items-center">
                <i class="pi pi-home mr-2" style="font-size: 0.875rem" />
                <span>基本信息</span>
              </div>
            </Tab>
            <Tab value="incident-types">
              <div class="flex align-items-center">
                <i class="pi pi-list mr-2" style="font-size: 0.875rem" />
                <span>事件类型</span>
              </div>
            </Tab>
            <Tab value="routes">
              <div class="flex align-items-center">
                <i class="pi pi-sitemap mr-2" style="font-size: 0.875rem" />
                <span>路由配置</span>
              </div>
            </Tab>
            <Tab value="custom-fields">
              <div class="flex align-items-center">
                <i class="pi pi-cog mr-2" style="font-size: 0.875rem" />
                <span>自定义字段</span>
              </div>
            </Tab>
            <Tab value="schedules">
              <div class="flex align-items-center">
                <i class="pi pi-calendar mr-2" style="font-size: 0.875rem" />
                <span>排班管理</span>
              </div>
            </Tab>
          </TabList>

          <TabPanels class="p-4">
            <!-- 基本信息面板 -->
            <TabPanel value="basic">
              <div class="flex flex-column gap-6">
                <!-- 基本信息部分 -->
                <div>
                  <div class="text-lg mb-4">基本信息</div>
                  <div class="flex flex-column gap-4">
                    <div class="flex align-items-center">
                      <label class="w-8rem text-500">名称:</label>
                      <div class="flex-1 flex align-items-center gap-2">
                        <InputText v-model="service.name" class="flex-1" />
                        <Button icon="pi pi-pencil" text severity="secondary" />
                      </div>
                    </div>
                    <div class="flex align-items-center">
                      <label class="w-8rem text-500">描述:</label>
                      <div class="flex-1 flex align-items-center gap-2">
                        <InputText v-model="service.description" class="flex-1" />
                        <Button icon="pi pi-pencil" text severity="secondary" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- API集成部分 -->
                <div>
                  <div class="text-lg mb-4">告警 API 集成</div>
                  <div class="flex flex-column gap-4">
                    <div class="flex align-items-center">
                      <label class="w-8rem text-500">接口地址:</label>
                      <div class="flex-1 flex align-items-center gap-2">
                        <div class="flex-1 bg-gray-50 p-3 border-round font-mono text-sm">
                          POST /api/v1/services/{service_id}/alerts
                        </div>
                        <Button icon="pi pi-copy" text severity="secondary" />
                      </div>
                    </div>
                    <div class="flex">
                      <label class="w-8rem text-500">请求示例:</label>
                      <div class="flex-1">
                        <Textarea
                          v-model="examplePayload"
                          :readonly="true"
                          rows="10"
                          class="w-full font-mono text-sm"
                        />
                        <div class="flex justify-content-end mt-2">
                          <Button class="p-button-text p-button-plain" severity="secondary">
                            <i class="pi pi-refresh mr-1" style="font-size: 0.8rem" />
                            <span class="text-sm">生成新示例</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- 事件类型面板 -->
            <TabPanel value="incident-types">
              <Card class="mt-4">
                <template #title>
                  <div class="flex justify-content-between align-items-center">
                    <span>事件类型列表</span>
                    <Button label="管理" icon="pi pi-cog" />
                  </div>
                </template>
                <template #content>
                  <DataTable :value="incidentTypes" stripedRows>
                    <Column field="id" header="ID" />
                    <Column field="name" header="名称" />
                    <Column field="description" header="描述" />
                    <Column field="createdAt" header="创建时间" />
                  </DataTable>
                </template>
              </Card>
            </TabPanel>

            <!-- 路由配置面板 -->
            <TabPanel value="routes">
              <Card class="mt-4">
                <template #title>
                  <div class="flex justify-content-between align-items-center">
                    <span>路由列表</span>
                    <Button label="管理" icon="pi pi-cog" />
                  </div>
                </template>
                <template #content>
                  <DataTable :value="routes" stripedRows>
                    <Column field="id" header="ID" />
                    <Column field="service" header="服务" />
                    <Column field="target" header="目标团队/用户" />
                    <Column field="createdAt" header="创建时间" />
                  </DataTable>
                </template>
              </Card>
            </TabPanel>

            <!-- 自定义字段面板 -->
            <TabPanel value="custom-fields">
              <Card class="mt-4">
                <template #title>
                  <div class="flex justify-content-between align-items-center">
                    <span>自定义字段列表</span>
                    <Button label="管理" icon="pi pi-cog" />
                  </div>
                </template>
                <template #content>
                  <DataTable :value="customFields" stripedRows>
                    <Column field="id" header="ID" />
                    <Column field="service" header="服务" />
                    <Column field="name" header="名称" />
                    <Column field="type" header="类型" />
                    <Column field="createdAt" header="创建时间" />
                  </DataTable>
                </template>
              </Card>
            </TabPanel>

            <!-- 排班管理面板 -->
            <TabPanel value="schedules">
              <Card class="mt-4">
                <template #content>
                  <h2>排班管理功能开发中...</h2>
                </template>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>
