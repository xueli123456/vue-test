<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :rules="rules" :inline="true" :model="listQuery">
        <el-form-item label="申请单" prop="inspectForm">
          <el-input v-model="listQuery.inspectForm" class="filter-item" placeholder="请选申请单" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="submitAddForm('listQuery')">预约</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
        <div style="margin-bottom: 20px;">患者信息</div>
        <div class="table-container">
          <el-table v-loading.body="listLoading" :data="tableData1" stripe highlight-current-row border element-loading-text="Loading">
            <el-table-column align="center" fixed min-width="50" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="申请单号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.inspectForm }}</span>
              </template>
            </el-table-column>
            <el-table-column label="门诊号" align="center" prop="queryPatientInfoByDoctorId">
              <template slot-scope="scope">
                <span>{{ scope.row.outPatientNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName">
              <template slot-scope="scope">
                <span>{{ scope.row.patientName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者年龄" align="center" prop="patientAge">
              <template slot-scope="scope">
                <span>{{ scope.row.patientAge }}</span>
              </template>
            </el-table-column>
            <el-table-column label="诊断" align="center" prop="dingNoSis">
              <template slot-scope="scope">
                <span>{{ scope.row.dingNoSis }}</span>
              </template>
            </el-table-column>
            <el-table-column label="主诉" align="center" prop="mainComlPaint">
              <template slot-scope="scope">
                <span>{{ scope.row.mainComlPaint }}</span>
              </template>
            </el-table-column>
            <el-table-column label="体征" align="center" prop="sign">
              <template slot-scope="scope">
                <span>{{ scope.row.sign }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-bottom: 20px;margin-top: 20px;">申请单信息</div>
        <div class="table-container">
          <el-table v-loading.body="listLoading" :data="tableData2" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
            <el-table-column align="center" fixed min-width="50" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="检查项目" min-width="100" align="center" prop="checkProName">
              <template slot-scope="scope">
                <span>{{ scope.row.checkProName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检查部位" min-width="150" align="center" prop="checkPoint">
              <template slot-scope="scope">
                <span>{{ scope.row.checkPoint }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检查目的" min-width="200" align="center" prop="checkPosition">
              <template slot-scope="scope">
                <span>{{ scope.row.checkPosition }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开单科室" align="center" min-width="60" prop="applayOfficeName">
              <template slot-scope="scope">
                <span>{{ scope.row.applayOfficeName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开单时间" align="center" min-width="60" prop="adtime">
              <template slot-scope="scope">
                <span>{{ scope.row.adtime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行科室" align="center" min-width="60" prop="execOfficeName">
              <template slot-scope="scope">
                <span>{{ scope.row.execOfficeName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行状态" align="center" min-width="100" prop="execState">
              <template slot-scope="scope">
                <span>{{ scope.row.execState }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报告状态" align="center" min-width="100" prop="repotState">
              <template slot-scope="scope">
                <span>{{ scope.row.repotState }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item style="margin-top: 20px" label="预约日期" prop="reservationDate">
          <el-date-picker
            v-model="listQuery.reservationDate"
            :clearable="false"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="预约日期"
            @change="getSourcePoolList()"
          />
        </el-form-item>
        <div class="table-container">
          <el-table v-loading.body="listLoading" :data="sourcePoolTableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" @row-click="rowClick">
            <el-table-column align="center" width="50" label="选择">
              <template slot-scope="scope">
                <el-radio class="aa" v-model="ruleForm1.workId" :label="scope.row.id" />
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="50" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="时段" align="center" min-width="100" prop="classesBegin">
              <template slot-scope="scope">
                <span>{{ scope.row.classesBegin }} -- {{ scope.row.classesEnd }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总号源" align="center" prop="sourceCount">
              <template slot-scope="scope">
                <span>{{ scope.row.sourceCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余号源" align="center" prop="unuseCount">
              <template slot-scope="scope">
                <span>{{ scope.row.unuseCount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPatientAndInspectInfo, getSourcePoolList, saveReservationInfo } from '@/api/outPatient'
import waves from '@/directive/waves' // 水波纹指令
import { formatDate } from '@/utils/dateutils'
export default {
  name: 'outPatientIndex',
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
      revisionConcurrentControl: false,
      listLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 20,
      listQuery: {
        inspectForm: '',
        reservationDate: formatDate( new Date() ,'yyyy-MM-dd'),
        work: ''
      },
      ruleForm: {
        officeId: '',
        medicalType: '',
        reservationDate: formatDate( new Date() ,'yyyy-MM-dd')
      },
      ruleForm1: {
        inspectForm: '',
        applayOffice: '',
        applayOfficeName: '',
        medicalProject: '',
        workId: '',
        execOffice: '',
        execOfficeName: '',
        reservationDate: formatDate( new Date() ,'yyyy-MM-dd')
      },
      tableData1: [],
      tableData2: [],
      sourcePoolTableData: [],
      departmentList: [],
      rules: {
        inspectForm: [
          { required: true, message: '申请单号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    resetQueryForm(formName) {
      const _this = this
      _this.$refs[formName].resetFields()
    },
    rowClick(row, column, cell, event) {
      const _this = this
      _this.ruleForm1.workId = row.id
    },
    fetchData(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          getPatientAndInspectInfo(_this.listQuery.inspectForm).then(res => {
            if (res.code === 200) {
              _this.tableData1 = []
              _this.tableData2 = []
              const json = {}
              json.inspectForm = _this.listQuery.inspectForm
              json.patientName = res.result.patient.patientName
              json.patientAge = res.result.patient.patientAge
              json.dingNoSis = res.result.patient.dingNoSis
              json.sign = res.result.patient.sign
              json.mainComlPaint = res.result.patient.mainComlPaint
              json.outPatientNum = res.result.patient.outPatientNum
              json.patientId = res.result.patient.patientId
              _this.tableData1.push(json)
              const json1 = {}
              json1.checkProName = res.result.applcaitionInfo.checkProName
              json1.checkPoint = res.result.applcaitionInfo.checkPoint
              json1.checkPosition = res.result.applcaitionInfo.checkPosition
              json1.applayOfficeName = res.result.applcaitionInfo.applayOfficeName
              json1.adtime = res.result.applcaitionInfo.adtime
              json1.execOfficeName = res.result.applcaitionInfo.execOfficeName
              json1.execState = res.result.applcaitionInfo.execState
              json1.repotState = res.result.applcaitionInfo.repotState
              _this.tableData2.push(json1)
              _this.ruleForm.officeId = res.result.applcaitionInfo.execOffice
              _this.ruleForm.medicalType = res.result.applcaitionInfo.medicalType
              _this.ruleForm1.execOffice = res.result.applcaitionInfo.execOffice
              _this.ruleForm1.execOfficeName = res.result.applcaitionInfo.execOfficeName
              _this.ruleForm1.applayOffice = res.result.applcaitionInfo.applayOffice
              _this.ruleForm1.applayOfficeName = res.result.applcaitionInfo.applayOfficeName
              _this.ruleForm1.medicalProject = res.result.applcaitionInfo.medicalProject
              _this.ruleForm1.inspectForm = _this.listQuery.inspectForm
              _this.listLoading = false
              _this.getSourcePoolList()
            }
          })
        }
      })
    },
    getSourcePoolList() {
      const _this = this
      if (_this.listQuery.inspectForm === '' || _this.listQuery.inspectForm === null) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '申请单号不能为空!',
          duration: 1000
        })
        return false
      }
      _this.ruleForm.reservationDate = _this.listQuery.reservationDate
      getSourcePoolList(_this.ruleForm).then(res => {
        if (res.code === 200) {
          _this.sourcePoolTableData = res.result
        }
      })
    },
    searchFilter() {
      this.fetchData('listQuery')
    },
    submitAddForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.listLoading = true
          _this.revisionConcurrentControl = true
          _this.ruleForm1.inspectForm = _this.listQuery.inspectForm
          _this.ruleForm1.reservationDate = _this.listQuery.reservationDate
          saveReservationInfo(_this.ruleForm1).then(res => {
            if (res.code === 200) {
              _this.listLoading = false
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '预约成功!',
                duration: 1000
              })
              _this.tableData1 = []
              _this.tableData2 = []
              _this.sourcePoolTableData = []
              _this.listQuery.inspectForm = ''
            } else {
              _this.listLoading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style type="text/css">
  .page-header {
    padding-bottom: 9px;
    margin: 20px 0 30px;
    border-bottom: 1px solid #eeeeee;
  }
  .tran_box .el-checkbox__inner {
    border-radius: 38px;
  }
  .aa .el-radio__label {
    display: none;
  }
</style>
