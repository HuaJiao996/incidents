<template>
  <div class="dashboard-container">
    <h1>仪表盘</h1>

    <!-- 事件列表 -->
    <div class="incidents-section">
      <h2>事件</h2>
      <DataTable :value="incidents" stripedRows>
        <Column field="id" header="ID"></Column>
        <Column field="title" header="标题"></Column>
        <Column field="priority" header="优先级"></Column>
        <Column field="status" header="状态"></Column>
      </DataTable>
    </div>

    <!-- 值班日历 -->
    <div class="oncall-section">
      <h2>值班信息</h2>
      <Calendar :inline="true" :value="today" :disabledDates="offDays" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';

// 模拟事件数据
const incidents = ref([
  { id: 1, title: 'IssueA', priority: 'P1', status: 'Triggered' },
  { id: 2, title: 'IssueB', priority: 'P2', status: 'Resolved' }
]);

// 值班日历数据
const today = ref(new Date());
const offDays = ref([1, 3, 6]); // 周一、周三、周六休息
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.incidents-section, .oncall-section {
  margin-bottom: 30px;
}

.incident-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.incident-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.severity {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.severity.high {
  background: #ff9800;
}

.severity.critical {
  background: #f44336;
}

.severity.medium {
  background: #2196f3;
}

.calendar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weekdays, .schedule {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day, .status {
  padding: 10px;
  text-align: center;
  border-radius: 4px;
}

.status.oncall {
  background: #4caf50;
  color: white;
}

.status.off {
  background: #e0e0e0;
}
</style>
