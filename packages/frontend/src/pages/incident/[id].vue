<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Textarea from 'primevue/textarea';
import Badge from 'primevue/badge';

const { t } = useI18n();
const route = useRoute();
const incidentId = route.params.id as string;

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface Alert {
  name: string;
  status: string;
}

interface RelatedIncident {
  id: string;
  title: string;
}

interface TimelineEvent {
  timestamp: string;
  content: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  type: string;
  created: string;
  updated: string;
  alerts: Alert[];
  relatedIncidents: RelatedIncident[];
  timeline: TimelineEvent[];
  comments: Comment[];
}

const incident = ref<Incident>({
  id: '#1',
  title: 'Network Latency Issue',
  description: 'High latency detected in US-West region affecting customer response times. Multiple services reporting increased response times above threshold.',
  status: 'Triggered',
  assignee: {
    name: 'James Wilson'
  },
  type: 'Infrastructure',
  created: '2023-10-27 09:45 UTC',
  updated: '2023-10-27 10:30 UTC',
  alerts: [
    { name: 'Latency Alert - US-West-1', status: 'Triggered' },
    { name: 'Response Time Alert - API Gateway', status: 'Triggered' }
  ],
  relatedIncidents: [
    { id: '#3', title: 'Database Connection Issues' }
  ],
  timeline: [
    { timestamp: '2023-10-27 09:45 UTC', content: 'Incident created automatically by monitoring system' },
    { timestamp: '2023-10-27 09:50 UTC', content: 'Assigned to James Wilson' },
    { timestamp: '2023-10-27 10:15 UTC', content: 'Status changed to Investigating' },
    { timestamp: '2023-10-27 10:30 UTC', content: 'Related incident #3 created' }
  ],
  comments: [
    {
      id: '1',
      user: {
        name: 'James Wilson',
        avatar: ''
      },
      content: 'Initial investigation shows increased latency in US-West region. Looking into potential network bottlenecks.',
      timestamp: '10:15 UTC'
    },
    {
      id: '2',
      user: {
        name: 'Sarah Chen',
        avatar: ''
      },
      content: 'Noticed similar patterns in database connection times. Created related incident #3 to track.',
      timestamp: '10:20 UTC'
    }
  ]
});

const newComment = ref('');

const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  incident.value.comments.push({
    id: Date.now().toString(),
    user: {
      name: 'Current User',
      avatar: ''
    },
    content: newComment.value,
    timestamp: new Date().toLocaleTimeString()
  });
  
  newComment.value = '';
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Triggered': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    case 'Investigating': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    case 'Resolved': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    default: return 'bg-surface-hover text-text-color-secondary';
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-semibold text-text-color">#1 Network Latency Issue</h1>
        <Button label="Change Status" severity="primary" icon="pi pi-chevron-down" />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧主要内容 -->
      <div class="col-span-2 space-y-6">
        <!-- 基本信息 -->
        <div class="bg-surface-card rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-text-color">Basic Information</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-text-color-secondary text-sm">Title:</div>
                <div class="text-text-color">{{ incident.title }}</div>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Description:</div>
                <div class="text-sm text-text-color">{{ incident.description }}</div>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Status:</div>
                <span :class="['px-2 py-1 rounded text-sm', getStatusClass(incident.status)]">
                  {{ incident.status }}
                </span>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Assignee:</div>
                <div class="flex items-center gap-2 text-text-color">
                  {{ incident.assignee.name }}
                  <i class="pi pi-external-link text-sm text-primary-color"></i>
                </div>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Type:</div>
                <div class="text-text-color">{{ incident.type }}</div>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Created:</div>
                <div class="text-text-color">{{ incident.created }}</div>
              </div>
              <div>
                <div class="text-text-color-secondary text-sm">Updated:</div>
                <div class="text-text-color">{{ incident.updated }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 告警信息 -->
        <div class="bg-surface-card rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-text-color">Alerts</h2>
          <div class="space-y-2">
            <div v-for="alert in incident.alerts" :key="alert.name" 
              class="flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-yellow-500"></i>
              <span class="text-text-color">{{ alert.name }}</span>
              <span :class="['px-2 py-1 rounded text-xs', getStatusClass(alert.status)]">
                {{ alert.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- 相关事件 -->
        <div class="bg-surface-card rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-text-color">Related Incidents</h2>
          <div class="space-y-2">
            <div v-for="related in incident.relatedIncidents" :key="related.id"
              class="flex items-center gap-2">
              <i class="pi pi-link"></i>
              <span>Child: {{ related.id }} {{ related.title }}</span>
            </div>
          </div>
        </div>

        <!-- 时间线 -->
        <div class="bg-surface-card rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-text-color">Timeline</h2>
          <div class="space-y-4">
            <div v-for="(event, index) in incident.timeline" :key="index"
              class="flex gap-4">
              <div class="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <div class="text-sm text-text-color">{{ event.timestamp }}</div>
                <div>{{ event.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧评论区 -->
      <div class="space-y-6">
        <div class="bg-surface-card rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-text-color">Comments</h2>
          <div class="space-y-4">
            <div v-for="comment in incident.comments" :key="comment.id"
              class="space-y-2">
              <div class="flex items-start gap-3">
                <Avatar 
                  :label="comment.user.name.split(' ').map(n => n[0]).join('')"
                  shape="circle"
                  class="bg-blue-500"
                />
                <div class="flex-1">
                  <div class="flex justify-between">
                    <span class="font-medium">{{ comment.user.name }}</span>
                    <span class="text-sm text-text-color">{{ comment.timestamp }}</span>
                  </div>
                  <p class="text-text-color mt-1">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <Textarea
              v-model="newComment"
              placeholder="Add a comment..."
              rows="3"
              class="w-full"
            />
            <div class="flex justify-end mt-2">
              <Button 
                label="Add Comment"
                icon="pi pi-send"
                @click="submitComment"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-button.p-button-icon-only) {
  width: 2.5rem;
  padding: 0.5rem;
}

:deep(.p-avatar) {
  width: 2rem;
  height: 2rem;
}
</style>
