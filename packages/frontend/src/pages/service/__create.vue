<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Form, FormField } from '@primevue/forms';
import { ref } from 'vue';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import Apis from '@/api';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

const { t } = useI18n();

const router = useRouter();

const visible = defineModel<boolean>({ required: true });

const schema = z.object({
  name: z.string().min(1, t('common.required')),
  description: z.string().optional(),
});

const resolver = ref(zodResolver(schema));

const handleCreate = async (event: { valid: boolean; values: any }) => {
  if (!event.valid) return;

  try {
    const id = await Apis.service.create({
      data: {
        name: event.values.name.trim(),
        description: event.values.description?.trim() || '',
      }
    });

    visible.value = false;
    if (id) {
      router.push(`/service/${id}`);
    }
  } catch (error) {
    console.error('Failed to create service:', error);
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :header="t('service.create')" class="w-[500px]">
    <Form :resolver="resolver" @submit="handleCreate" class="flex flex-col gap-4">
      <FormField v-slot="{ error }" name="name" class="flex flex-col gap-1">
        <label class="font-medium">{{ t('service.name') }} <span class="text-red-500">*</span></label>
        <InputText type="text" class="w-full" />
        <Message v-if="error" severity="error" size="small">{{ error.message }}</Message>
      </FormField>

      <FormField v-slot="{ error }" name="description" class="flex flex-col gap-1">
        <label class="font-medium">{{ t('service.description') }}</label>
        <InputText type="text" class="w-full" />
        <Message v-if="error" severity="error" size="small">{{ error.message }}</Message>
      </FormField>

      <div class="flex justify-end gap-2">
        <Button type="button" :label="t('common.cancel')" severity="secondary" @click="visible = false" />
        <Button type="submit" :label="t('common.create')" severity="success" />
      </div>
    </Form>
  </Dialog>
</template>
