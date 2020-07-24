<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery">
        <el-form-item label="号源池" prop="id">
          <el-select v-model="listQuery.id" filterable clearable placeholder="号源池" class="mc-input-col3">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select v-model="listQuery.businessType" filterable clearable placeholder="类型">
            <el-option
              v-for="item in businessTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-select v-model="listQuery.purpose" filterable clearable placeholder="用途">
            <el-option
              v-for="item in purposeList"
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
      <el-table-column align="center" fixed min-width="50" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteSourcePool(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="号源池名称" min-width="100" align="center" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="100" align="center" prop="businessType">
        <template slot-scope="scope">
          <span>{{ scope.row.businessType | businessTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作日号源数量" min-width="100" align="center" prop="count">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节假日号源数量" min-width="100" align="center" prop="holidayCount">
        <template slot-scope="scope">
          <span>{{ scope.row.holidayCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医技分组" align="center" min-width="100" prop="medicalTypeName">
        <template slot-scope="scope">
          <span>{{ scope.row.medicalTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途" align="center" min-width="100" prop="purpose">
        <template slot-scope="scope">
          <span>{{ scope.row.purpose | purposeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行科室" align="center" min-width="100" prop="departmentName">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排队号生成次数" align="center" min-width="100" prop="createLineNoTimes">
        <template slot-scope="scope">
          <span>{{ scope.row.createLineNoTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用设备" align="center" min-width="100" prop="requestCount">
        <template slot-scope="scope">
          <span>{{ scope.row.requestCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" min-width="100" prop="priority">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" min-width="100" prop="updateDate">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" align="center" min-width="100" prop="updater">
        <template slot-scope="scope">
          <span>{{ scope.row.updater }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型" prop="businessType">
          <el-select v-model="ruleForm.businessType" filterable placeholder="类型">
            <el-option
              v-for="item in businessTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="号源池名称" prop="name">
          <el-input v-model.trim="ruleForm.name" />
        </el-form-item>
        <el-form-item label="工作日号源数量" prop="count">
          <el-input-number v-model.trim="ruleForm.count" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="节假日号源数量" prop="holidayCount">
          <el-input-number v-model.trim="ruleForm.holidayCount" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="执行科室" prop="department">
          <el-select v-model="ruleForm.department" filterable placeholder="执行科室" @change="getMedicalTypeList">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="医技分组" prop="medicalType">
          <el-select v-model="ruleForm.medicalType" clearable placeholder="医技分组">
            <el-option
              v-for="item in medicalTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-select v-model="ruleForm.purpose" filterable placeholder="用途">
            <el-option
              v-for="item in purposeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用设备" prop="device">
          <el-select v-model="ruleForm.device" clearable placeholder="使用设备">
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成排队号次数" prop="createLineNoTimes">
          <el-input-number v-model.trim="ruleForm.createLineNoTimes" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model.trim="ruleForm.priority" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio v-model.trim="ruleForm.isEnabled" label="1">启用</el-radio>
          <el-radio v-model.trim="ruleForm.isEnabled" label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model.trim="ruleForm.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="saveInterfacerData">确 定</el-button>
        <el-button v-else type="primary" @click="updateSourcePool">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getListPage, getSourcePoolList, getAlldepartmentList, getMedicalTypeList, saveSourcePool, updateSourcePool, deleteSourcePool } from '@/api/sourcePool'
  export default {
    name: 'Tab',
    filters: {
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
      },
      purposeFilter(val) {
        let name = ''
        switch (val) {
          case 1: {
            name = '普通门诊'
            break
          }
          case 2: {
            name = '急诊'
            break
          }
        }
        return name
      },
      businessTypeFilter(val) {
        let name = ''
        switch (val) {
          case '1': {
            name = '检查'
            break
          }
          case '2': {
            name = '检验'
            break
          }
        }
        return name
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        listLoading: true,
        total: 0,
        listQuery: {
          businessType: '',
          purpose: '',
          pageNum: 1,
          pageSize: 20,
          id: ''
        },
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '新增'
        },
        businessTypeList: [
          {
            key: '1',
            value: '检查'
          },
          {
            key: '2',
            value: '检验'
          }
        ],
        departmentList: [],
        sourcePoolList: [],
        medicalTypeList: [],
        purposeList: [
          {
            key: 1,
            value: '普通门诊'
          },
          {
            key: 2,
            value: '急诊'
          }
        ],
        deviceList: [],
        queueList: [],
        tableData: [],
        ruleForm: {
          createLineNoTimes: 1,
          holidayCount: 0,
          name: '',
          count: 0,
          medicalType: '',
          department: '',
          isEnabled: '1',
          remarks: '',
          priority: '',
          businessType: '1'
        },
        rules: {
          businessType: [
            { required: true, message: '业务类型不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '号源池名称不能为空', trigger: 'blur' },
            { min: 2, max: 40, message: '号源池名称长度为2到40个字符', trigger: 'blur' }
          ],
          count: [
            { required: true, message: '工作日号源池数量不能为空', trigger: 'blur' }
          ],
          holidayCount: [
            { required: true, message: '节假日号源数量不能为空', trigger: 'blur' }
          ],
          medicalType: [
            { required: true, message: '医技类型不能为空', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: '优先级不能为空', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '执行科室不能为空', trigger: 'blur' }
          ],
          createLineNoTimes: [
            { required: true, message: '生成排队号次数不能为空', trigger: 'blur' }
          ],
          purpose: [
            { required: true, message: '用途不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
    },
    created() {
      this.getDepartmentList()
      this.getSourcePoolList()
      this.fetchData()
    },
    methods: {
      getDepartmentList() {
        const _this = this
        getAlldepartmentList().then(res => {
          if (res.code === 200) {
            _this.departmentList = res.result
          }
        })
      },
      getMedicalTypeList() {
        const _this = this
        _this.ruleForm.medicalType = ''
        _this.ruleForm.queue = ''
        _this.medicalTypeList = []
        getMedicalTypeList(this.ruleForm.department).then(res => {
          if (res.code === 200) {
            _this.medicalTypeList = res.result
          }
        })
      },
      getSourcePoolList() {
        const _this = this
        getSourcePoolList().then(res => {
          if (res.code === 200) {
            _this.sourcePoolList = res.result
          }
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
            saveSourcePool(this.ruleForm).then(res => {
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
      updateSourcePool() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateSourcePool(this.ruleForm).then(res => {
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
        this.ruleForm = {
          name: '',
          count: '',
          medicalType: '',
          department: '',
          isEnabled: '1',
          queue: '',
          remarks: ''
        }
      },
      deleteSourcePool(row) {
        this.$confirm(`确定删除号源池${row.name}吗？`, '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteSourcePool(row.id).then(res => {
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
        this.ruleForm = Object.assign({}, row)
        this.ruleForm.id = row.id
        this.ruleForm.businessType = row.businessType.toString()
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.medicalTypeList = []
        getMedicalTypeList(this.ruleForm.department).then(res => {
          if (res.code === 200) {
            this.medicalTypeList = res.result
          }
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  }
</script>
<style scoped>
</style>
