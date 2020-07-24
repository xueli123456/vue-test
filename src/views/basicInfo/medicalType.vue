<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="名称">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="医技分组名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.isEnabled">
            <el-option
              v-for="item in isEnabledArr"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="listQuery.department" placeholder="科室">
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetUserData()">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openSave">新增</el-button>
      </el-form>
    </div>

    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateStatus(scope.row.id)">{{ scope.row.isEnabled=='0'?"启用":"停用" }}</el-button>
          <el-button v-if="scope.row.id !== '1'" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.id !== '1'" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="医技分组名称" align="center">
        <template slot-scope="scope">
          <a href="#" @click="edit(scope.row)"><span style="color:#0000ff">{{ scope.row.name }}</span></a>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属科室" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否启用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnabled | statusFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        background
        :current-page.sync="listQuery.pageNum"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--新增模态框-->
    <el-dialog class="customWidth" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="medicalType" label-position="right" label-width="120px" style="margin-left:50px;">
        <el-form-item label="编码：" prop="no">
          <el-input v-model.trim="medicalType.no" disabled="disabled" />
        </el-form-item>

        <el-form-item label="医技分组名称：" prop="name">
          <el-input v-model.trim="medicalType.name" />
        </el-form-item>
        <el-form-item label="归属科室：" prop="department">
          <el-select v-model="medicalType.department">
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否有子节点：" prop="isChild">
          <el-select v-model="medicalType.isChild">
            <el-option
              v-for="item in isChildArr"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="isEnabled">
          <el-select v-model="medicalType.isEnabled">
            <el-option
              v-for="item in isEnabledArr"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="medicalType.remarks"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 100}"
            placeholder="请输入内容"
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Index',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        0: '停用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      rules: {
        name: [{ required: true, message: '请输入医技分组名称', trigger: 'blur' }],
        department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        isEnabled: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      tableData: [],
      medicalType: {
        name: '',
        no: '',
        department: null,
        isEnabled: null,
        isChild: null,
        remarks: null
      },
      officeList: [],
      total: 0,
      listQuery: {
        name: '',
        isEnabled: null,
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      isEnabledArr: [{ code: '1', value: '启用' }, { code: '0', value: '停用' }],
      isChildArr: [{ code: '0', value: '有' }, { code: '1', value: '没有' }],
      createdTimes: 0,
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
    this.loadOfficeList()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.medicalTypeList(this.listQuery).then(res => {
        _this.tableData = res.result.list
        _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    loadOfficeList() {
      const _this = this
      this.$api.officeList().then(res => {
        _this.officeList = res.result
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
    resetUserData() {
      this.listQuery = {
        name: '',
        pageNo: 1,
        pageSize: 10
      }
      this.fetchData()
    },
    openSave() {
      const _this = this
      this.resetDataForm()
      this.$api.genNumStr().then(res => {
        _this.medicalType.no = res.result
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDataForm() {
      this.medicalType = {
        name: '',
        no: '',
        department: null,
        isEnabled: null,
        isChild: null,
        remarks: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.medicalTypeSave(this.medicalType).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: res.result
              })
              this.dialogStatus = 'create'
              this.dialogFormVisible = false
              this.fetchData()
            }
          })
        }
      })
    },
    updateStatus(id) {
      this.$api.medicalTypeUpdateStatus({ id: id }).then(res => {
        if (res.code === 200) {
          this.fetchData()
        }
      })
    },
    edit(row) {
      this.medicalType = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定将该患者移除黑名单吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.medicalTypeDelete({ id: id }).then(res => {
          if (res.code === 200) {
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
    }
  }
}
</script>

<style scoped>
  .customWidth{
    min-width: 500px;
    width: 100%;
  }
</style>
