<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="type">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="菜单名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="type">
          <!--          <el-input v-model.trim="menu.type" />-->
          <el-select v-model="listQuery.type" style="width:250px">
            <el-option value="">---请选择---</el-option>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" @click="resetForm('listQuery')">重置</el-button>
        <el-button v-waves class="filter-item" type="primary" @click="openSave('')">新增</el-button>
      </el-form>
    </div>

    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" min-width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteMenu(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="updateStatus(scope.row)">启用/禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" sortable align="center" prop="label" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单路径" sortable align="center" prop="url">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="菜单类型" align="center" prop="typeDesc">
        <template slot-scope="scope">
          <span>{{ scope.row.typeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="updateDate" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        :current-page.sync="listQuery.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--新增模态框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="menu" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="label">
          <el-input v-model.trim="menu.label" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="url">
          <el-input v-model.trim="menu.url"/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="phone">
          <el-input v-model.trim="menu.img" disabled/>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="doUpload"
            :limit="1"
            :before-upload="beforeUpload"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <!--          <el-input v-model.trim="menu.type" />-->
          <el-select v-model="menu.type" style="width:250px">
            <el-option value="">---请选择---</el-option>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="menu.sort" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="menu.remarks"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 100}"
            placeholder="请输入内容"
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveData('dataForm')">保存</el-button>
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(value) {
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      return statusMap[value]
    },
    jianhuFilter(value) {
      if (value === '0') {
        return '-'
      } else {
        return value
      }
    }
  },
  data() {
    return {
      typeList: [],
      tableData: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      downloadLoading: false,
      menu: {
        id: null,
        label: null,
        url: null,
        img: null,
        type: null,
        remarks: null
      },
      rules: {
        label: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { min: 2, max: 40, message: '菜单名称长度为2到40个字符', trigger: 'blur' }
        ],
        url: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }]
      },
      file: null,
      fileName: ''
    }
  },
  created() {
    this.fetchData()
    this.loadTypeList()
  },
  methods: {
    beforeUpload(file) {
      console.log(file, '文件')
      const extension = file.name.split('.')[1] === 'jpg'
      const extension2 = file.name.split('.')[1] === 'png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        this.$notify.warning('上传图片只能是jpg,png格式!')
        return
      }
      if (!isLt2M) {
        this.$notify.warning('上传图片大小不能超过 5MB!')
        return
      }
      this.file = file
      this.fileName = file.name
      // console.log('上传' + this.files.name)
      if (this.fileName === null) {
        this.$notify.warning('请选择要上传的文件！')
        return false
      }
      const fileFormData = new FormData()
      fileFormData.append('file', this.file, this.fileName) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      const _this = this
      this.$api.uploadFile(fileFormData).then((res) => {
        if (res && res.code === 200) {
          _this.$notify.success('图片上传成功！')
          _this.menu.img = res.result
        } else {
          _this.$notify.error('图片上传失败！')
        }
      })
    },
    fetchData() {
      this.listLoading = true
      this.$api.wxMenuList(this.listQuery).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
        this.listLoading = false
      })
    },
    loadTypeList() {
      this.$api.wxMenuTypeList(this.listQuery).then(res => {
        this.typeList = res.result.list
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.fetchData()
    },
    openSave() {
      this.resetMenuData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.wxMenuSave(this.menu).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: res.result
              })

              this.fetchData()
              this.dialogFormVisible = false
              // this.$router.go(-1)
            } else {
              this.$notify({
                type: 'success',
                message: '保存失败'
              })
            }
          })
        }
      })
    },
    resetMenuData() {
      this.menu = {
        id: null,
        label: null,
        url: null,
        img: null,
        type: null,
        remarks: null
      }
    },
    edit(row) {
      this.menu = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteMenu(row) {
      this.$confirm(`确定删除菜单${row.label}吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.wxMenuDelete(row.id).then(response => {
          if (response.code === 200) {
            this.fetchData()
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateStatus(row) {
      row.status = row.status === 1 ? 0 : 1
      this.$api.wxMenuSave(row).then(response => {
        if (response.code === 200) {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '修改成功!'
          })
        }
      })
    },
    searchFilter() {
      this.listQuery.pageNo = 1
      this.fetchData()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
      this.fetchData()
    }
  }
}
</script>
