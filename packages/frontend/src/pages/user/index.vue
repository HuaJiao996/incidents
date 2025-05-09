<template>
  <div class="user-container">
    <h1>{{ t('user.title') }}</h1>

    <!-- 顶部操作区域 -->
    <div class="action-section">
      <Button label="添加新用户" icon="pi pi-plus" @click="showAddDialog" />
      <InputText v-model="searchText" placeholder="搜索..." class="search-input" />
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <DataTable :value="filteredUsers" stripedRows>
        <Column field="id" header="ID" :sortable="true"></Column>
        <Column field="name" header="姓名" :sortable="true"></Column>
        <Column field="email" header="邮箱" :sortable="true"></Column>
        <Column header="操作">
          <template #body="{data}">
            <Button icon="pi pi-eye" class="p-button-text" @click="viewUser(data)" />
            <Button icon="pi pi-pencil" class="p-button-text" @click="editUser(data)" />
            <Button icon="pi pi-trash" class="p-button-text" @click="confirmDelete(data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <Paginator :rows="10" :totalRecords="totalUsers" @page="onPageChange"
                 template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" />
    </div>

    <!-- 添加/编辑对话框 -->
    <Dialog v-model:visible="dialogVisible" :header="dialogTitle" :modal="true">
      <div class="dialog-content">
        <div class="form-group">
          <label for="name">姓名</label>
          <InputText id="name" v-model="currentUser.name" />
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <InputText id="email" v-model="currentUser.email" />
        </div>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="dialogVisible = false" class="p-button-text" />
        <Button label="保存" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <!-- 删除确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

const { t } = useI18n();
const confirm = useConfirm();

// 搜索文本
const searchText = ref<string>('');

// 分页
const currentPage = ref<number>(1);
const totalUsers = ref<number>(0);

// 对话框状态
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref<string>('添加新用户');
const isEditing = ref<boolean>(false);

// 当前编辑的用户
const currentUser = ref({
  id: '',
  name: '',
  email: ''
});

// 模拟数据
const users = ref([
  {
    id: '1',
    name: 'User 1',
    email: 'user1@example.com'
  },
  {
    id: '2',
    name: 'User 2',
    email: 'user2@example.com'
  }
]);

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return !searchText.value ||
      user.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.value.toLowerCase());
  });
});

// 显示添加对话框
const showAddDialog = () => {
  currentUser.value = {
    id: '',
    name: '',
    email: ''
  };
  dialogTitle.value = '添加新用户';
  isEditing.value = false;
  dialogVisible.value = true;
};

// 查看用户详情
const viewUser = (user: any) => {
  console.log('查看用户:', user);
};

// 编辑用户
const editUser = (user: any) => {
  currentUser.value = { ...user };
  dialogTitle.value = '编辑用户';
  isEditing.value = true;
  dialogVisible.value = true;
};

// 保存用户
const saveUser = () => {
  if (isEditing.value) {
    // 更新现有用户
    const index = users.value.findIndex(u => u.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...currentUser.value };
    }
  } else {
    // 添加新用户
    currentUser.value.id = (users.value.length + 1).toString();
    users.value.push({ ...currentUser.value });
  }
  dialogVisible.value = false;
};

// 确认删除
const confirmDelete = (user: any) => {
  confirm.require({
    message: '确定要删除这个用户吗？',
    header: '删除确认',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteUser(user);
    }
  });
};

// 删除用户
const deleteUser = (user: any) => {
  users.value = users.value.filter(u => u.id !== user.id);
};

// 分页变化
const onPageChange = (event: any) => {
  currentPage.value = event.page + 1;
};
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.action-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.user-list {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
