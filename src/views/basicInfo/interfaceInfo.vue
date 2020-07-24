<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="" prop="name">
          <el-input v-model="listQuery.name" class="filter-item" placeholder="接口名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="info">
          <el-input v-model="listQuery.info" class="filter-item" placeholder="接口描述" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="isenabled">
          <el-select v-model="listQuery.isenabled" filterable clearable placeholder="是否可用" class="mc-input-col3">
            <el-option
              v-for="item in isenabledList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="save">新增</el-button>
        </div>
      </el-form>
    </div>
    <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteInterface(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="接口名称" min-width="100" align="center" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口描述" min-width="100" align="center" prop="info">
        <template slot-scope="scope">
          <span>{{ scope.row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" min-width="100" align="center" prop="isenabled">
        <template slot-scope="scope">
          <span>{{ scope.row.isenabled | isenabledFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求次数" align="center" min-width="100" prop="requestCount">
        <template slot-scope="scope">
          <span>{{ scope.row.requestCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应次数" align="center" min-width="100" prop="responseCount">
        <template slot-scope="scope">
          <span>{{ scope.row.responseCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" min-width="100" prop="updateDate">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="备注" align="center" min-width="100" prop="requestCount">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
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
    <!-- 新增模块 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="interfaceInfo" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model.trim="interfaceInfo.name" />
        </el-form-item>
        <el-form-item label="接口描述" prop="info">
          <el-input v-model.trim="interfaceInfo.info" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isenabled">
          <el-radio v-model.trim="interfaceInfo.isenabled" label="1">启用</el-radio>
          <el-radio v-model.trim="interfaceInfo.isenabled" label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model.trim="interfaceInfo.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveInterfacerData">确 定</el-button>
        <el-button v-else type="primary" @click="updateInterfacer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListPage, getMedicalTypeList, getDepartmentInfos, saveInterfacer, updateInterfacer, deleteInterface } from '@/api/interface'
export default {
  name: 'Tab',
  filters: {
    emptyFilter(time) {
      return time !== '' ? time : ''
    },
    isenabledFilter(val) {
      let isenabled = ''
      switch (val) {
        case '0': {
          isenabled = '停用'
          break
        }
        case '1': {
          isenabled = '可用'
          break
        }
      }
      return isenabled
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      ruleFormParam: {
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        name: '',
        info: '',
        isenabled: ''
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      tableData: [],
      isenabledList: [
        {
          key: '0',
          value: '停用'
        },
        {
          key: '1',
          value: '可用'
        }
      ],
      interfaceInfo: {
        name: '',
        info: '',
        isenabled: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: '接口名称不能为空', trigger: 'blur' },
          { min: 2, max: 40, message: '接口名称长度为2到40个字符', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '接口描述不能为空', trigger: 'blur' },
          { min: 2, max: 40, message: '接口描述长度为2到40个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  methods: {
    clearDepartment() {
      const _this = this
      _this.listQuery.medicalTypeId = ''
      _this.medicalTypeList = []
    },
    getMedicalTypeList() {
      const _this = this
      if (_this.listQuery.officeId === null || _this.listQuery.officeId === '') {
        return
      }
      getMedicalTypeList(_this.listQuery.officeId).then(res => {
        console.log(res)
        _this.medicalTypeList = res.result
      })
    },
    getDepartmentInfos() {
      const _this = this
      getDepartmentInfos().then(res => {
        console.log(res)
        _this.departmentList = res.result
      })
    },
    fetchData() {
      this.listLoading = true
      getListPage(this.listQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.result.list
          this.total = res.result.total
          this.listLoading = false
        }
      })
    },
    handleSizeChange(val) {
      const _this = this
      _this.listQuery.pageSize = val
      _this.fetchData()
    },
    handleCurrentChange(val) {
      const _this = this
      _this.listQuery.pageNum = val
      _this.fetchData()
    },
    resetQueryForm(form) {
      const _this = this
      _this.$refs[form].resetFields()
      _this.fetchData()
    },
    searchFilter() {
      const _this = this
      _this.listQuery.pageNum = 1
      _this.fetchData()
    },
    save() {
      this.resetInterfaceData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveInterfacerData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveInterfacer(this.interfaceInfo).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.fetchData()
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateInterfacer() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateInterfacer(this.interfaceInfo).then(res => {
            if (res.code === 200) {
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
    resetInterfaceData() {
      this.interfaceInfo = {
        name: '',
        info: '',
        isenabled: '1',
        remarks: ''
      }
    },
    deleteInterface(row) {
      this.$confirm(`确定删除接口${row.name}吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteInterface(row.id).then(res => {
          if (res.code === 200) {
            this.fetchData()
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      })
    },
    edit(row) {
      this.interfaceInfo = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
<style scoped>
</style>
