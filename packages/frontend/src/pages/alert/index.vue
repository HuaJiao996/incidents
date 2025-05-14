<script setup lang="ts">
import { ref, onMounted, effect } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { useRequest, usePagination } from 'alova/client';
import Apis from '@/api'

const { t } = useI18n();

const {data: alerts, loading} = usePagination((page, pageSize) => Apis.alert.findAll({ params: { page, pageSize }}))


// 定义路由 meta
definePage({
  meta: {
    menu: {
      title: 'alert',
      icon: 'pi pi-bell',
      order: 3
    }
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">{{ t('alert.title') }}</h1>
    <DataTable :value="alerts" :loading="loading" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll">
      <Column field="id" header="ID" style="width: 8%" />
      <Column field="title" :header="t('common.title')" style="width: 25%" />
      <Column field="service" :header="t('alert.service')" style="width: 15%" >
        <template #body="slotProps">
          <Button variant="link" :label="`#${slotProps.data.service.id}:${slotProps.data.service.name}`" />
        </template>
      </Column>
      <Column field="incidentId" :header="t('alert.relatedIncident')" style="width: 15%" >
        <template #body="slotProps">
          <Button variant="link" :label="`#${slotProps.data.incidentId}`" />
        </template>
      </Column>
      <Column field="createdAt" :header="t('common.createTime')" style="width: 17%" />
      <Column :header="t('common.actions')" style="width: 8%">
        <template #body>
          <Button icon="pi pi-eye" variant="text" :label="t('common.view')" />
        </template>
      </Column>

    </DataTable>
  </div>
</template>
