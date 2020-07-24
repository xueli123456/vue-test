<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="">
          <el-input v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="号段代码" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.office" filterable clearable placeholder="科室">
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
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.id !== '1'" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.id !== '1'" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="科室名称" sortable align="center">
        <template slot-scope="scope">
          <a href="#" @click="edit(scope.row)"><span style="color:#0000ff">{{ scope.row.officeName }}</span></a>
        </template>
      </el-table-column>
      <el-table-column label="号段代码" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="号段" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}-{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="officeTime" label-position="right" label-width="120px" style="margin-left:50px;">
        <el-form-item label="科室名称：" prop="office">
          <el-select v-model="officeTime.office" filterable clearable>
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：" prop="name">
          <el-input v-model.trim="officeTime.startTime" style="width:300px" placeholder="请按照HH:mm格式输入时间" />
        </el-form-item>
        <el-form-item label="开始时间：" prop="name">
          <el-input v-model.trim="officeTime.endTime" style="width:300px" placeholder="请按照HH:mm格式输入时间" />
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
  },
  data() {
    return {
      listLoading: true,
      rules: {
        office: [{ required: true, message: '请选择科室', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入结束时间', trigger: 'blur' }]
      },
      tableData: [],
      officeTime: {
        office: null,
        startTime: null,
        endTime: null
      },
      officeList: [],
      total: 0,
      listQuery: {
        keyword: '',
        isEnabled: null,
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
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
      this.$api.officeTimeList(this.listQuery).then(res => {
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
        keyword: '',
        pageNo: 1,
        pageSize: 10
      }
      this.fetchData()
    },
    openSave() {
      const _this = this
      this.resetDataForm()
      this.$api.genNumStr().then(res => {
        _this.officeTime.no = res.result
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDataForm() {
      this.officeTime = {
        office: null,
        startTime: null,
        endTime: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.officeTimeSave(this.officeTime).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: '保存成功'
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
      this.$api.officeTimeUpdateStatus({ id: id }).then(res => {
        if (res.code === 200) {
          this.fetchData()
        }
      })
    },
    edit(row) {
      this.officeTime = Object.assign({}, row)
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
        this.$api.officeTimeDelete({ id: id }).then(res => {
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
