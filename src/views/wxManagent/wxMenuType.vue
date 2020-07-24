<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="name">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="菜单类型名称" @keyup.enter.native="searchFilter" />
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
      <el-table-column align="center" label="操作" class-name="small-padding" min-width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteMenuType(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="updateStatus(scope.row)">启用/禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="编号" sortable align="center" prop="label">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单类型名称" sortable align="center" prop="label" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable align="center" prop="label" min-width="120">
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
      <el-form ref="dataForm" :rules="rules" :model="menuType" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单类型名称" prop="name">
          <el-input v-model.trim="menuType.name" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="menuType.remarks"
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
      tableData: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        name: ''
      },
      sexArray: [
        {
          code: '1',
          value: '男'
        },
        {
          code: '2',
          value: '女'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      downloadLoading: false,
      menuType: {
        id: '',
        name: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { min: 2, max: 40, message: '项目名称长度为2到40个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.$api.wxMenuTypeList(this.listQuery).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
        this.listLoading = false
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
      this.resetmenuTypeData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.wxMenuTypeSave(this.menuType).then(res => {
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
    resetmenuTypeData() {
      this.menuType = {
        id: '',
        name: '',
        remarks: ''
      }
    },
    edit(row) {
      this.menuType = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteMenuType(row) {
      this.$confirm(`确定删除菜单类型${row.name}吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.wxMenuTypeDelete(row.id).then(response => {
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
      this.$api.wxMenuTypeSave(row).then(response => {
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
