<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="请选择科室" @change="getMedicalTypeList" @clear="clearDepartment">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="medicalTypeId">
          <el-select v-model="listQuery.medicalTypeId" filterable clearable placeholder="请选择预约分组">
            <el-option
              v-for="item in medicalTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="reservationDateRange">
          <el-date-picker
            v-model="reservationDateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="" prop="reservationCanalId">
          <el-select v-model="listQuery.reservationCanalId" filterable clearable placeholder="请选择预约渠道">
            <el-option
              v-for="item in reservationCanalList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="listQuery.status" filterable clearable placeholder="请选择预约状态" class="mc-input-col3">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="inspectForm">
          <el-input v-model="listQuery.inspectForm" class="filter-item" placeholder="申请单号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" placeholder="患者姓名" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
      <el-table-column align="center" fixed min-width="100" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="260" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="view(scope.row)">查看</el-button>
          <el-button type="primary" round size="mini" @click="viewLog(scope.row)">预约轨迹</el-button>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" min-width="100" align="center" prop="patientName">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者性别" min-width="100" align="center" prop="patientSex">
        <template slot-scope="scope">
          <span>{{ scope.row.patientSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" min-width="100" align="center" prop="patientAge">
        <template slot-scope="scope">
          <span>{{ scope.row.patientAge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约日期" align="center" min-width="100" prop="reservationDate">
        <template slot-scope="scope">
          <span>{{ scope.row.reservationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" min-width="100" prop="reservationTime">
        <template slot-scope="scope">
          <span>{{ scope.row.reservationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查申请单" align="center" min-width="100" prop="inspectForm">
        <template slot-scope="scope">
          <span>{{ scope.row.inspectForm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查项目" align="center" min-width="200" prop="inspectProject">
        <template slot-scope="scope">
          <span>{{ scope.row.inspectProject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约分组" align="center" min-width="200" prop="medicalTypeName">
        <template slot-scope="scope">
          <span>{{ scope.row.medicalTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约状态" align="center" min-width="100" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="占用号源池数量" align="center" min-width="100" prop="sourceCount">
        <template slot-scope="scope">
          <span>{{ scope.row.sourceCount }}</span>
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
    <el-dialog title="查看预约单" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="80px">
          <el-form-item label="患者姓名" prop="patientName">
            <el-input v-model="ruleForm.patientName" placeholder="患者姓名" readonly />
          </el-form-item>
          <el-form-item label="患者性别" prop="patientSex">
            <el-select v-model="ruleForm.patientSex" filterable clearable disabled placeholder="性别">
              <el-option
                v-for="item in sexList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="patientAge">
            <el-date-picker
              v-model="ruleForm.patientAge"
              :clearable="false"
              :editable="false"
              readonly
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="出生日期"
            />
          </el-form-item>
          <el-form-item label="就诊卡号" prop="patientCode">
            <el-input v-model="ruleForm.patientCode" placeholder="就诊卡号" readonly />
          </el-form-item>
          <el-form-item label="申请单号" prop="inspectForm">
            <el-input v-model="ruleForm.inspectForm" placeholder="申请单号" readonly />
          </el-form-item>
          <el-form-item label="检查项目" prop="inspectProject">
            <el-input v-model="ruleForm.inspectProject" placeholder="检查项目" readonly />
          </el-form-item>
          <el-form-item label="预约班次" prop="workScheduleRuleName">
            <el-input v-model="ruleForm.workScheduleRuleName" placeholder="预约班次" readonly />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="ruleForm.remarks"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="255"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="申请单轨迹" :visible.sync="logDialogFormVisible" @close="resetForm('ruleForm1')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm1" :rules="rules" :model="ruleForm1" label-position="left" label-width="80px">
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in tableDataLog"
              :key="index"
              size="large"
              icon="el-icon-camera-solid"
              color="#0bbd87"
              :timestamp="log.createDate">
              <el-card>
                <h4>{{log.inspectForm}}</h4>
                <h4>{{ log.reservationStatus | statusFilter }} {{log.createDate}}</h4>
                <p>{{log.remarks}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
<!--          <el-table v-loading.body="listLoading" :data="tableDataLog" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">-->
<!--            <el-table-column align="center" fixed min-width="50" label="序号">-->
<!--              <template slot-scope="scope">-->
<!--                {{ scope.$index+1 }}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="检查申请单" align="center" min-width="80" prop="inspectForm">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.inspectForm }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="预约状态" align="center" min-width="50" prop="reservationStatus">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.reservationStatus | statusFilter }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="备注" align="center" min-width="200" prop="remarks">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.remarks }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作时间" align="center" min-width="100" prop="createDate">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.createDate}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作人" align="center" min-width="80" prop="creator">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.creator }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm1')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListPage, getMedicalTypeList, getDepartmentInfos, viewLog } from '@/api/reservation'
import { formatDate } from '@/utils/dateutils'
export default {
  name: 'Tab',
  filters: {
    emptyFilter(time) {
      return time !== '' ? time : ''
    },
    statusFilter(val) {
      let status = ''
      switch (val) {
        case '1': {
          status = '已预约'
          break
        }
        case '2': {
          status = '已退约'
          break
        }
        case '3': {
          status = '已改约'
          break
        }
        case '4': {
          status = '已签到'
          break
        }
        case '5': {
          status = '已完成'
          break
        }
        case '6': {
          status = '预约作废'
          break
        }
        case '7': {
          status = '已报道'
          break
        }
        case '8': {
          status = '已挂起'
          break
        }
        case '9': {
          status = '过号'
          break
        }
      }
      return status
    }
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
      tableDataLog: [],
      reservationDateRange: [new Date(), new Date()],
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      ruleFormParam: {
      },
      logDialogFormVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        officeId: '',
        inspectForm: '',
        status: '',
        patientName: '',
        startDateTime: '',
        endDateTime: '',
        medicalTypeId: ''
      },
      ruleForm: {
        patientName: '',
        patientAge: '',
        patientSex: '',
        patientCode: '',
        inspectForm: '',
        inspectProject: '',
        workScheduleRuleName: '',
        remarks: ''
      },
      ruleForm1: {},
      tableData: [],
      departmentList: [],
      medicalTypeList: [],
      reservationCanalList: [
        {
          key: '0',
          value: '在线预约'
        },
        {
          key: '1',
          value: '线上预约'
        },
        {
          key: '2',
          value: '自助机预约'
        }
      ],
      sexList: [
        {
          key: '女',
          value: '女'
        },
        {
          key: '男',
          value: '男'
        }
      ],
      statusList: [
        {
          key: '1',
          value: '已预约'
        },
        {
          key: '2',
          value: '已退约'
        },
        {
          key: '3',
          value: '已改约'
        },
        {
          key: '4',
          value: '已签到'
        },
        {
          key: '6',
          value: '预约作废'
        },
        {
          key: '7',
          value: '已报道'
        },
        {
          key: '8',
          value: '已挂起'
        },
        {
          key: '5',
          value: '已完成'
        }
      ],
      rules: {
      }
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
    this.getDepartmentInfos()
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
      this.listQuery.startDateTime = formatDate( this.reservationDateRange[0] ,'yyyy-MM-dd')
      this.listQuery.endDateTime = formatDate( this.reservationDateRange[1] ,'yyyy-MM-dd')
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
    resetQueryForm(formName) {
      const _this = this
      _this.reservationDateRange = [new Date(), new Date()]
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.logDialogFormVisible = false
      _this.dialogFormVisible = false
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.listQuery.pageNum = 1
      _this.fetchData()
    },
    view(row) {
      const _this = this
      _this.ruleForm.patientName = row.patientName
      _this.ruleForm.patientAge = row.patientAge
      _this.ruleForm.patientSex = row.patientSex
      _this.ruleForm.patientCode = row.patientCode
      _this.ruleForm.inspectForm = row.inspectForm
      _this.ruleForm.inspectProject = row.inspectProject
      _this.ruleForm.workScheduleRuleName = row.officeName + '' + row.reservationDate + '' + row.reservationTime
      _this.ruleForm.remarks = row.remarks
      _this.dialogFormVisible = true
    },
    viewLog(row){
      const _this = this
      _this.logDialogFormVisible = true
      _this.tableDataLog = []
      viewLog(row.inspectForm).then(res => {
        if (res.code === 200) {
          _this.tableDataLog = res.result
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
