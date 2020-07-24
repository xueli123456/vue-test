<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="userName">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="用户名" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" @click="resetForm('listQuery')">重置</el-button>
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
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="view(scope.row)">查看</el-button>
          <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="微信标识" sortable align="center" prop="openId" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" sortable align="center" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="与本人关系" align="center" prop="relation">
        <template slot-scope="scope">
          <span>{{ scope.row.relation | relationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="身份证号" align="center" prop="idCard">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监护人姓名" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.patientJianhu | jianhuFilter }}
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="user.name" readonly />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model.trim="user.sex" label="男">男</el-radio>
          <el-radio v-model.trim="user.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model.trim="user.idCard" readonly />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model.trim="user.phone" readonly />
        </el-form-item>
        <el-form-item label="就诊卡号" prop="medicalCard">
          <el-input v-model.trim="user.medicalCard" readonly />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="user.remarks"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 100}"
            placeholder="请输入内容"
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deleteUser, modifyUser, queryList } from '@/api/wxFamily'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    relationFilter(value) {
      const statusMap = {
        0: '成人',
        1: '儿童'
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
        pageNum: 1,
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
      user: {
        id: '',
        userName: '',
        password: '',
        realName: '',
        sex: '1',
        birthday: '',
        cellPhone: '',
        email: ''
      },
      rules: {
        userName: [
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
      queryList(this.listQuery).then(res => {
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
      this.listQuery.pageNum = val
      this.fetchData()
    },
    save() {
      this.resetUserData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetUserData() {
      this.user = {
        userName: '',
        password: '',
        realName: '',
        sex: '1',
        birthday: '',
        cellPhone: '',
        email: ''
      }
    },
    view(row) {
      this.user = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          modifyUser(this.user).then(response => {
            if (response.code === 200) {
              this.dialogFormVisible = false
              this.fetchData()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    deleteUser(row) {
      this.$confirm(`确定删除用户${row.name}吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
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
    searchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    resetForm(form) {
      this.$refs[form].resetFields()
      this.fetchData()
    }
  }
}
</script>
