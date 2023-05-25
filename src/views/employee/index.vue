<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createEmployeeDataApi, deleteEmployeeDataApi, updateEmployeeDataApi, getEmployeeDataApi } from "@/api/employee"
import { type GetEmployeeData } from "@/api/employee/types/employee"
import { type GetEmployeeOptionData } from "@/api/employee/types/employee"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Plus  } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

import type { UploadFile } from 'element-plus'

defineOptions({
  name: "Employee"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// create
const dialogVisible = ref<boolean>(false)

const formData = reactive({
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: ""
})

const formRef = ref<FormInstance | null>(null)

const formRules: FormRules = reactive({
  firstName: [{ required: true, trigger: "blur", message: "Please enter first name" }],
  lastName: [{ required: true, trigger: "blur", message: "Please enter last name" }],
  company: [{ required: true, trigger: "blur", message: "Please select company" }],
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === '') {
        createEmployeeDataApi({
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
        }).then(() => {
          ElMessage.success("added successfully")
          dialogVisible.value = false
          getEmployeeData()
        })
      } else {
        updateEmployeeDataApi({
          id: currentUpdateId.value,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
        }).then(() => {
          ElMessage.success("updated successfully")
          dialogVisible.value = false
          getEmployeeData()
        })
      }
    } else {
      return false
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = ''
  formData.firstName = ""
  formData.lastName = ""
  formData.company = ""
  formData.email = ""
  formData.phone = "";
}


// delete
const handleDelete = (row: GetEmployeeData) => {
  ElMessageBox.confirm(`Deleting Employee: ${row.name}，confirm deletion？`, "hint", {
    confirmButtonText: "Sure",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    deleteEmployeeDataApi(row.id).then(() => {
      ElMessage.success("deleted successfully")
      getEmployeeData()
    })
  })
}


// update
const currentUpdateId = ref<string>('')

const handleUpdate = (row: GetEmployeeData) => {
  currentUpdateId.value = row.id
  formData.firstName = row.first_name
  formData.lastName = row.last_name
  formData.company = row.company_id
  formData.email = row.email;
  formData.phone = row.phone;
  dialogVisible.value = true
}


const employeeList = ref<GetEmployeeData[]>([])
const companyOptions = ref<GetEmployeeOptionData[]>([]);

const getEmployeeData = () => {
  loading.value = true
  getEmployeeDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
  })
    .then((res) => {
      paginationData.total = res.total
      employeeList.value = res.data
      companyOptions.value = res.company_options
    })
    .catch(() => {
      employeeList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}


/** Listen for changes in pagination parameters */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getEmployeeData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">Add User</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="employeeList">
          <el-table-column prop="first_name" label="FirstName" align="center" />
          <el-table-column prop="last_name" label="LastName" align="center">
          </el-table-column>
          <el-table-column prop="company.name" label="Company" align="center">  
          </el-table-column>
          <el-table-column prop="email" label="Email" align="center" />
          <el-table-column prop="phone" label="Phone" align="center" />
          <el-table-column fixed="right" label="operate" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">Edit</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === '' ? 'New Employee' : 'Edit Employee'"
      @close="resetForm"
      width="40%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="firstName" label="FirstName">
          <el-input v-model="formData.firstName" placeholder="Please enter first name" />
        </el-form-item>
        <el-form-item prop="lastName" label="LastName">
          <el-input v-model="formData.lastName" placeholder="Please enter last name" />
        </el-form-item>
        <el-form-item prop="company" label="Company">
          <el-select v-model="formData.company" placeholder="Please enter company">
            <el-option
              v-for="item in companyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="formData.email" placeholder="Please enter Email" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="formData.phone" placeholder="Please enter Phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCreate">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
