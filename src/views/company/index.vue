<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createCompanyDataApi, deleteCompanyDataApi, updateCompanyDataApi, getCompanyDataApi } from "@/api/company"
import { type GetCompanyData } from "@/api/company/types/company"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Plus  } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

import type { UploadFile } from 'element-plus'

defineOptions({
  name: "Company"
})

const imageUrl = ref('')

const handleLogoChange = async (uploadFile: UploadFile) => {
   const photoUrl = URL.createObjectURL(uploadFile.raw);
  if (uploadFile.raw.type !== 'image/jpeg' && uploadFile.raw.type !== 'image/png') {
    ElMessage.error('Company Logo must be JPG or PNG format!')
    return false
  }
   const image = new Image();
   const imageDimensions = await new Promise((resolve) => {
    image.onload = () => {
      const dimensions = {
        height: image.height,
        width: image.width,
      };
      resolve(dimensions);
    };
    image.src = photoUrl;
    imageUrl.value = photoUrl;
  });

  if (imageDimensions.height < 100 && imageDimensions.width < 100) {
    ElMessage.error('Logo Resolution should be greater than 100 * 100 pixel')
    return false
  }
    formData.companyLogo = uploadFile.raw;
  return true
}

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// create
const dialogVisible = ref<boolean>(false)

const formData = reactive({
  companyName: "",
  companyEmail: "",
  companyLogo: "",
  companyWebsite: ""
})

const formRef = ref<FormInstance | null>(null)

const formRules: FormRules = reactive({
  companyName: [{ required: true, trigger: "blur", message: "Please enter Name" }],
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === '') {
        console.log(formData)
        createCompanyDataApi({
          name: formData.companyName,
          email: formData.companyEmail,
          logo: formData.companyLogo,
          website: formData.companyWebsite,
        }).then(() => {
          ElMessage.success("added successfully")
          dialogVisible.value = false
          getCompanyData()
        })
      } else {
        updateCompanyDataApi({
          id: currentUpdateId.value,
          name: formData.companyName,
          email: formData.companyEmail,
          logo: formData.companyLogo,
          website: formData.companyWebsite,
        }).then(() => {
          ElMessage.success("updated successfully")
          dialogVisible.value = false
          getCompanyData()
        })
      }
    } else {
      return false
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = ''
  formData.companyName = ""
  formData.companyEmail = ""
  formData.companyLogo = ""
  formData.companyWebsite = ""
  imageUrl.value = "";
}


// delete
const handleDelete = (row: GetCompanyData) => {
  ElMessageBox.confirm(`Deleting Company: ${row.name}，confirm deletion？`, "hint", {
    confirmButtonText: "Sure",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    deleteCompanyDataApi(row.id).then(() => {
      ElMessage.success("deleted successfully")
      getCompanyData()
    })
  })
}


// update
const currentUpdateId = ref<string>('')

const handleUpdate = (row: GetCompanyData) => {
  currentUpdateId.value = row.id
  formData.companyName = row.name
  formData.companyEmail = row.email
  formData.companyLogo = row.logo
  imageUrl.value = row.logo;
  formData.companyWebsite = row.website
  dialogVisible.value = true
}


const companyList = ref<GetCompanyData[]>([])

const getCompanyData = () => {
  loading.value = true
  getCompanyDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
  })
    .then((res) => {
      paginationData.total = res.total
      companyList.value = res.data
    })
    .catch(() => {
      companyList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}


/** Listen for changes in pagination parameters */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getCompanyData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">Add Company</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="companyList">
          <el-table-column prop="name" label="Name" align="center" />
          <el-table-column prop="email" label="Email" align="center">
          </el-table-column>
          <el-table-column prop="logo" label="Logo" align="center">          
            <template #default="scope">
              <img :src="scope.row.logo" style="width: 60px"/>
            </template>
          </el-table-column>
          <el-table-column prop="website" label="Website" align="center" />
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
      :title="currentUpdateId === '' ? 'New Company' : 'Edit Company'"
      @close="resetForm"
      width="40%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="companyName" label="Name">
          <el-input v-model="formData.companyName" placeholder="Please enter Name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="formData.companyEmail" placeholder="Please enter Email" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleLogoChange"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Website">
          <el-input v-model="formData.companyWebsite" placeholder="Please enter Website" />
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
