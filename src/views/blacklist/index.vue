<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="keyword">
          <el-input v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="患者名称/患者号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetForm('listQuery')">重置</el-button>
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
      <el-table-column align="center" fixed label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.id !== '1'" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.id !== '1'" type="danger" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" align="center" prop="roleName">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者性别" align="center" prop="roleCode">
        <template slot-scope="scope">
          <span>{{ scope.row.patientSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者出生年月" align="center" prop="roleCode">
        <template slot-scope="scope">
          <span>{{ scope.row.patientAge }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="患者身份证号" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.patientCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="creator" label="预约次数">
        <template slot-scope="scope">
          <span>{{ scope.row.reservationCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="createTime" label="爽约次数">
        <template slot-scope="scope">
          <span>{{ scope.row.failCount }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="blackList" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="患者姓名：" prop="patientName">
          <el-input v-model.trim="blackList.patientName" />
        </el-form-item>
        <el-form-item label="患者性别：" prop="patientSex">
          <el-radio v-model.trim="blackList.patientSex" label="男">男</el-radio>
          <el-radio v-model.trim="blackList.patientSex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="患者出生年月：" prop="patientAge">
          <el-date-picker v-model.trim="blackList.patientAge" value-format="yyyy-MM-dd" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="身份证号：" prop="patientCode">
          <el-input v-model.trim="blackList.patientCode" />
        </el-form-item>
        <el-form-item label="预约次数：" prop="reservationCount">
          <el-input v-model.trim="blackList.reservationCount" />
        </el-form-item>
        <el-form-item label="爽约次数：" prop="failCount">
          <el-input v-model.trim="blackList.failCount" />
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model.trim="blackList.remarks" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">确 定</el-button>
        <el-button v-else type="primary" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'Tab',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      tableData: [],
      blackList: {
        patientSex: '男'
      },
      total: 0,
      listQuery: {
        keyword: '',
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      createdTimes: 0,
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        patientName: [
          { required: true, message: '患者名称不能为空', trigger: 'blur' }
        ],
        patientCode: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ],
        failCount: [
          { required: true, message: '爽约次数不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.$api.blackList(this.listQuery).then(res => {
        this.tableData = res.result.list
        this.total = parseInt(res.result.total)
        this.listLoading = false
      })
    },
    resetForm(form) {
      this.$refs[form].resetFields()
      this.dialogFormVisible = false
      this.fetchData()
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
      this.blackList = {
        patientSex: '男'
      }
    },
    openSave() {
      this.resetUserData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$api.blackListSave(this.blackList).then(res => {
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
    edit(row) {
      this.blackList = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(row) {
      this.$confirm(`确定将该患者移除黑名单吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.blackListDelete({ 'id': row.id }).then(res => {
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
