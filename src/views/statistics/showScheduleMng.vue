<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="科室" prop="departmentId">
          <el-select v-model="listQuery.departmentId" filterable clearable placeholder="请选择科室" @change="getSourcePoolList" @clear="clearDepartment">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="号源池" prop="sourcePoolIds">
          <el-select v-model="listQuery.sourcePoolIds" multiple filterable clearable placeholder="请选择全部号源">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排班日期" prop="classesDateRange">
          <el-date-picker
            v-model="classesDateRange"
            type="daterange"
            align="right"
            unlink-panels
            :clearable="false"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <div class="table-container">
          <el-table v-loading.body="listLoading" :data="tableData2" stripe highlight-current-row element-loading-text="Loading">
            <el-table-column label="当日总号源数" align="center" prop="totalSourceCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalSourceCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已预约号源数" align="center" prop="totalUseCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalUseCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="未使用号源数" align="center" prop="totalUnUseCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalUnUseCount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="检查科室" min-width="100" align="center" prop="departmentName">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次日期" min-width="100" align="center" prop="classesDate">
          <template slot-scope="scope">
            <span>{{ scope.row.classesDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次星期" min-width="100" align="center" prop="classesWeek">
          <template slot-scope="scope">
            <span>{{ scope.row.classesWeek }}</span>
          </template>
        </el-table-column>
        <el-table-column label="占用号源池" min-width="100" align="center" prop="sourcePoolName">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcePoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总号源数" align="center" min-width="100" prop="totalSourceCount">
          <template slot-scope="scope">
            <span>{{ scope.row.totalSourceCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已预约号源数" align="center" min-width="100" prop="useCount">
          <template slot-scope="scope">
            <span>{{ scope.row.useCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未使用号源" align="center" min-width="100" prop="unuseCount">
          <template slot-scope="scope">
            <span>{{ scope.row.unuseCount }}</span>
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
    </div>
    <el-dialog title="查看排班详情" :visible.sync="dialogFormVisible" @close="close">
      <div class="dialog_auto_increase">
        <el-table v-loading.body="listLoading" :data="tableData1" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
          <el-table-column align="center" fixed label="序号">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="classesBegin">
            <template slot-scope="scope">
              <span>{{ scope.row.classesBegin }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" prop="classesEnd">
            <template slot-scope="scope">
              <span>{{ scope.row.classesEnd }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总数" align="center" prop="totalSourceCount">
            <template slot-scope="scope">
              <span>{{ scope.row.totalSourceCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已预约" align="center" prop="useCount">
            <template slot-scope="scope">
              <span>{{ scope.row.useCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="未使用" align="center" prop="unuseCount">
            <template slot-scope="scope">
              <span>{{ scope.row.unuseCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="updateUserName">
            <template slot-scope="scope">
              <span>{{ scope.row.updateUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center" min-width="180" prop="updateDate">
            <template slot-scope="scope">
              <span>{{ scope.row.updateDate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination
            background
            :current-page.sync="ruleForm.pageNum"
            :page-sizes="[10,20,30, 50]"
            :page-size="ruleForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDepartment, getSourcePoolList, listPage, listPageDetail, queryCurrentSourceNum } from '@/api/scheduleMng'
  import waves from '@/directive/waves' // 水波纹指令
  import { formatDate } from '@/utils/dateutils'
  export default {
    directives: {
      waves
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        classesDateRange: [new Date(), new Date()],
        dialogFormVisible: false,
        listLoading: true,
        total: 0,
        listQuery: {
          departmentId: '',
          sourcePoolIds: [],
          startDateTime: '',
          endDateTime: '',
          pageNum: 1,
          pageSize: 20
        },
        total1: 0,
        ruleFormParam: {
          officeId: '',
          sourcePoolIds: [],
          startDateTime: '',
          endDateTime: ''
        },
        ruleForm: {
          departmentId: '',
          sourcePoolId: '',
          classesDate: '',
          pageNum: 1,
          pageSize: 20
        },
        tableData: [],
        tableData1: [],
        tableData2: [],
        sourcePoolList: [],
        departmentList: [],
        rules: {
        }
      }
    },
    created() {
      this.fetchData()
      this.getDepartmentInfos()
      this.queryCurrentSourceNum()
    },
    methods: {
      queryCurrentSourceNum() {
        const _this = this
        _this.ruleFormParam.sourcePoolIds = _this.listQuery.sourcePoolIds
        _this.ruleFormParam.officeId = _this.listQuery.departmentId
        _this.ruleFormParam.startDateTime = _this.listQuery.startDateTime
        _this.ruleFormParam.endDateTime = _this.listQuery.endDateTime
        queryCurrentSourceNum(_this.ruleFormParam).then(res => {
          if (res.code === 200) {
            _this.tableData2 = res.result
          } else {
            _this.listLoading = false
          }
        })
      },
      clearDepartment() {
        const _this = this
        _this.listQuery.sourcePoolIds = []
        _this.sourcePoolList = []
      },
      getDepartmentInfos() {
        getDepartment().then(res => {
          if (res.code === 200) {
            this.departmentList = res.result
          }
        })
      },
      getSourcePoolList() {
        const _this = this
        if(_this.listQuery.departmentId !== '' && _this.listQuery.departmentId !== null){
          getSourcePoolList(_this.listQuery.departmentId).then(res => {
            if (res.code === 200) {
              this.sourcePoolList = res.result
            }
          })
        }
      },
      fetchData() {
        const _this = this
        _this.listLoading = true
        _this.listQuery.startDateTime = formatDate( _this.classesDateRange[0] ,'yyyy-MM-dd')
        _this.listQuery.endDateTime = formatDate( _this.classesDateRange[1] ,'yyyy-MM-dd')
        listPage(_this.listQuery).then(res => {
          if (res.code === 200) {
            _this.tableData = res.result.list
            _this.total = res.result.total
            _this.listLoading = false
          } else {
            _this.listLoading = false
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
      handleSizeChange1(val) {
        const _this = this
        _this.ruleForm.pageSize = val
        _this.feachDataDetail()
      },
      handleCurrentChange1(val) {
        const _this = this
        _this.ruleForm.pageNum = val
        _this.feachDataDetail()
      },
      resetQueryForm(formName) {
        const _this = this
        _this.$refs[formName].resetFields()
        _this.classesDateRange = [new Date(), new Date()]
        _this.fetchData()
      },
      resetForm(formName) {
        const _this = this
        _this.dialogFormVisible = false
        _this.$refs[formName].resetFields()
      },
      searchFilter() {
        const _this = this
        _this.fetchData()
        _this.queryCurrentSourceNum()
      },
      close() {
        const _this = this
        _this.dialogFormVisible = false
      },
      view(row) {
        const _this = this
        _this.dialogFormVisible = true
        _this.ruleForm.departmentId = row.departmentId
        _this.ruleForm.sourcePoolId = row.sourcePoolId
        _this.ruleForm.classesDate = row.classesDate
        _this.feachDataDetail()
      },
      feachDataDetail() {
        const _this = this
        listPageDetail(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.tableData1 = res.result.list
            _this.total1 = res.result.total
            _this.listLoading = false
          } else {
            _this.listLoading = false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .page-header {
    padding-bottom: 9px;
    margin: 20px 0 30px;
    border-bottom: 1px solid #eeeeee;
  }
</style>
