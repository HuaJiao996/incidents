<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'
import type { AlertWithServiceDto } from '@/api/globals'

const { t } = useI18n()

interface Props {
  alert: AlertWithServiceDto | undefined
}

const visible = defineModel<boolean>({ required: true })
const { alert } = defineProps<Props>()

const openService = (serviceId: number) => {
  window.open(`/service/${serviceId}`, '_blank')
}

const openIncident = (incidentId: number) => {
  window.open(`/incident/${incidentId}`, '_blank')
}
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :header="`#${alert?.id}: ${alert?.title}`" :style="{ width: '50rem' }">
      <div v-if="alert" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="flex items-center gap-2">
              <label class="font-semibold w-24 shrink-0">{{ t('alert.service') }}:</label>
              <Button variant="link" class="p-0" :label="`${alert.service.name} (#${alert.service.id})`" @click="openService(alert.service.id)" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <label class="font-semibold w-24 shrink-0">{{ t('alert.relatedIncident') }}:</label>
              <template v-if="alert.incidentId">
                <Button variant="link" class="p-0" :label="`#${alert.incidentId}`" @click="openIncident(alert.incidentId)" />
              </template>
              <template v-else>{{ t('alert.noIncident') }}</template>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <label class="font-semibold w-24 shrink-0">{{ t('common.createTime') }}:</label>
              <span>{{ alert.createdAt }}</span>
            </div>
          </div>
          <div class="col-span-2">
            <div class="flex items-start gap-2">
              <label class="font-semibold w-24 shrink-0">{{ t('alert.content') }}:</label>
              <div class="whitespace-pre-wrap">{{ alert.content }}</div>
            </div>
          </div>
          <div v-if="alert.customFields" class="col-span-2">
            <Fieldset :legend="t('editor.alert.customFields')">
              <div class="space-y-2">
              <div v-for="(value, key) in alert.customFields" :key="key" class="flex gap-2">
                <span class="font-medium w-24 shrink-0">{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </div>
            </Fieldset>
          </div>
        </div>
      </div>
    </Dialog>
</template>
