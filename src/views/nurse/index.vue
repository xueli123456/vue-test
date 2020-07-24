<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="请选择科室" @change="getDiseaseRoomList()">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="reservationDate">
          <el-date-picker
            v-model="listQuery.reservationDate"
            :clearable="false"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="就诊日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="" prop="sourcePoolIds">
          <el-select v-model="listQuery.sourcePoolIds" multiple filterable clearable placeholder="请选择所属号源">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="sectionNumberId">
          <el-select v-model="listQuery.sectionNumberId" filterable clearable placeholder="请选择预约时段">
            <el-option
              v-for="item in txOfficeTimeList"
              :key="item.id"
              :label="item.sectionNumber"
              :value="item.id"
            />
          </el-select>
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
        <el-form-item label="" prop="inspectForm">
          <el-input v-model="listQuery.inspectForm" class="filter-item" placeholder="申请单号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" placeholder="患者姓名" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientCode">
          <el-input v-model="listQuery.patientCode" class="filter-item" placeholder="诊疗号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="lineCode">
          <el-input v-model="listQuery.lineCode" class="filter-item" placeholder="排队号" @keyup.enter.native="searchFilter" />
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
        <el-form-item label="" prop="doctorId">
          <el-select v-model="listQuery.doctorId" filterable clearable placeholder="请选择呼叫医生">
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.peopleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="table-container">
          <el-table v-loading.body="listLoading" :data="tableData1" stripe highlight-current-row element-loading-text="Loading">
            <el-table-column label="当日总计划人次数" align="center" prop="totalSourceCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalSourceCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已预约人次数" align="center" prop="totalUseCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalUseCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余号源数" align="center" prop="totalUnUseCount">
              <template slot-scope="scope">
                <span>{{ scope.row.totalUnUseCount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" :disabled="btnDisabled" @click="signUp">签到</el-button>
          <el-button class="filter-item" type="primary" :disabled="withdrawalContractConcurrentControl" @click="withdrawalContract">退约</el-button>
          <el-button class="filter-item" type="primary"  @click="revoke">撤销</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" min-width="100" />
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === '1' || scope.row.status === '4' || scope.row.status === '7' || scope.row.status === '8' || scope.row.status === '10'" type="primary" size="mini" @click="revision(scope.row)">改约</el-button>
            <el-button v-if="scope.row.status === '4' || scope.row.status === '5' || scope.row.status === '7' || scope.row.status === '8'" type="primary" size="mini" @click="print(scope.row)">打印</el-button>
          </template>
        </el-table-column>
        <el-table-column label="排队号" align="center" min-width="120" prop="lineCode">
          <template slot-scope="scope">
            <span>{{ scope.row.lineCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="诊疗号" align="center" min-width="110" prop="patientCode">
          <template slot-scope="scope">
            <span>{{ scope.row.patientCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="呼叫诊室" align="center" min-width="120" prop="roomName">
          <template slot-scope="scope">
            <span>{{ scope.row.roomName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" min-width="100" align="center" prop="patientName">
          <template slot-scope="scope">
            <span>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请单号" align="center" min-width="100" prop="inspectForm">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectForm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查项目" align="center" min-width="200" prop="inspectProject">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectProject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目金额" align="center" min-width="100" prop="totalMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约渠道" align="center" min-width="100" prop="reservationCanalName">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationCanalName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约日期" align="center" min-width="100" prop="reservationDate">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时段" align="center" min-width="120" prop="reservationTime">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约状态" align="center" min-width="100" prop="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费类型" align="center" min-width="100" prop="chargeType">
          <template slot-scope="scope">
            <span>{{ scope.row.chargeType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="执行科室" align="center" min-width="120" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.officeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="就诊科室" align="center" min-width="120" prop="applyOffice">
          <template slot-scope="scope">
            <span>{{ scope.row.applyOffice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费时间" align="center" min-width="200" prop="chargeDate">
          <template slot-scope="scope">
            <span>{{ scope.row.chargeDate | emptyFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="呼叫医生" align="center" min-width="100" prop="doctorName">
          <template slot-scope="scope">
            <span>{{ scope.row.doctorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" min-width="100" prop="phone">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
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
    <!--改约模态框-->
    <el-dialog title="改约" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm1')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm1" :rules="rules" :model="ruleForm1" label-position="left">
          <el-form-item label="" prop="revisionReservationDate">
            <el-date-picker
              v-model="ruleForm1.revisionReservationDate"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="就诊日期"
              :picker-options="pickerOptions1"
              @change="queryWorkScheduleRuleList"
            />
          </el-form-item>
          <el-button type="primary" style="margin-bottom: 15px" :disabled="revisionConcurrentControl" @click="submitAddForm('ruleForm1')">保存</el-button>
          <el-table v-loading.body="listLoading" :data="sourcePoolTableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" @row-click="rowClick">
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-radio class="aa" v-model="ruleForm1.workId" :label="scope.row.id" />
              </template>
            </el-table-column>
            <el-table-column align="center" width="50" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="时段" align="center" min-width="120" prop="classesBegin">
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
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm1')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style type="text/css">
  .page-header {
    padding-bottom: 9px;
    margin: 20px 0 30px;
    border-bottom: 1px solid #eeeeee;
  }
  .tran_box .el-checkbox__inner {
    border-radius: 9px
  }
  .aa .el-radio__label {
    display: none;
  }
</style>
<!--<object id=”LODOP_OB” classid=”CLSID:8856F961-340A-11D0-A96B-00C04FD705A2” width=0 height=0>-->
  <!--<embed id=”LODOP_EM” type=”application/x-print-lodop” width=0 height=0></embed>-->
<!--</object>-->
<script>
import { generageCode, getDepartment, getRoomList, getSourcePoolList, nurseSignUp, listPage, getCurrentSourceNum, revision, withdrawalContract, revoke, getAllDoctorList, getWorkScheduleRuleList, getOfficeTimeList } from '@/api/nurse'
import waves from '@/directive/waves' // 水波纹指令
import JsBarcode from 'jsbarcode'
import { getLodop } from '@/utils/LodopFuncs'
import { formatDate } from '@/utils/dateutils'
export default {
  name: 'Index',
  directives: {
    waves
  },
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
        case '10': {
          status = '已撤销'
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
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      btnDisabled: false,
      revisionConcurrentControl: false,
      withdrawalContractConcurrentControl: false,
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      listQuery: {
        reservationDate: formatDate( new Date() ,'yyyy-MM-dd'),
        officeId: '',
        consultingRoomId: '',
        officeTimeId: '',
        sourcePoolIds: [],
        inspectForm: '',
        status: '',
        patientName: '',
        patientCode: '',
        lineCode: '',
        doctorId: '',
        pageNum: 1,
        pageSize: 20
      },
      ruleForm: {
        reservationIds: [],
        status: ''
      },
      ruleForm1: {
        revisionReservationDate: formatDate( new Date() ,'yyyy-MM-dd'),
        reservationIds: [],
        status: '3',
        officeId: ''
      },
      ruleForm2: {
        revisionReservationDate: formatDate( new Date() ,'yyyy-MM-dd'),
        officeId: '',
        sourcePoolIds: []
      },
      tableData: [],
      tableData1: [],
      doctorList: [],
      sourcePoolTableData: [],
      departmentList: [],
      diseaseRoomList: [],
      txOfficeTimeList: [],
      sourcePoolList: [],
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
          key: '10',
          value: '已撤销'
        },
        {
          key: '5',
          value: '已完成'
        }
      ],
      rules: {
        revisionReservationDate: [
          { required: true, message: '改约日期不能为空', trigger: 'blur' }
        ],
        sectionNumberId: [
          { required: true, message: '号段不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.getCurrentSourceNum()
    this.getDepartmentInfos()
    this.getDoctorList()
  },
  methods: {
    getDoctorList() {
      const _this = this
      getAllDoctorList().then(res => {
        if (res.code === 200) {
          _this.doctorList = res.result
        }
      })
    },
    handleSelectionChange(val) {
      const _this = this
      _this.ruleForm.reservationIds = []
      val.forEach(item => {
        _this.ruleForm.reservationIds.push(item.id)
      })
      if (val.length > 0 && val.length === 1) {
        _this.btnDisabled = false
      } else if (val.length > 1) {
        _this.btnDisabled = true
      }
    },
    rowClick(row, column, cell, event) {
      const _this = this
      _this.ruleForm1.workId = row.id
    },
    queryWorkScheduleRuleList() {
      const _this = this
      _this.ruleForm2.revisionReservationDate = _this.ruleForm1.revisionReservationDate
      _this.ruleForm2.officeId = _this.ruleForm1.officeId
      getWorkScheduleRuleList(_this.ruleForm2).then(res => {
        if (res.code === 200) {
          _this.sourcePoolTableData = res.result
        }
      })
    },
    getDepartmentInfos() {
      const _this = this
      getDepartment().then(res => {
        if (res.code === 200) {
          _this.departmentList = res.result
        }
      })
    },
    getDiseaseRoomList() {
      const _this = this
      if (_this.listQuery.officeId !== '') {
        getRoomList(_this.listQuery.officeId).then(res => {
          if (res.code === 200) {
            _this.diseaseRoomList = res.result
          }
        })
        _this.getSourcePoolList()
        _this.getOfficeTimeList()
      } else {
        _this.diseaseRoomList = []
        _this.sourcePoolList = []
        _this.txOfficeTimeList = []
      }
    },
    getSourcePoolList() {
      const _this = this
      getSourcePoolList(_this.listQuery.officeId).then(res => {
        if (res.code === 200) {
          this.sourcePoolList = res.result
        }
      })
    },
    getOfficeTimeList() {
      const _this = this
      getOfficeTimeList(_this.listQuery.officeId).then(res => {
        if (res.code === 200) {
          this.txOfficeTimeList = res.result
        }
      })
    },
    getCurrentSourceNum() {
      const _this = this
      getCurrentSourceNum(_this.listQuery).then(res => {
        if (res.code === 200) {
          _this.tableData1 = res.result
        }
      })
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
      listPage(_this.listQuery).then(res => {
        if (res.code === 200) {
          const listData = res.result.list
          if (listData !== undefined) {
            listData.forEach(item => {
              item.selected = false
            })
          }
          _this.tableData = listData
          _this.total = res.result.total
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
    resetQueryForm(formName) {
      const _this = this
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.dialogFormVisible = false
      _this.ruleForm1.workId = ''
      _this.sourcePoolTableData = []
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.pageNum = 1
      _this.fetchData()
      _this.getCurrentSourceNum()
    },
    submitAddForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.listLoading = true
          _this.revisionConcurrentControl = true
          revision(_this.ruleForm1).then(res => {
            if (res.code === 200) {
              _this.dialogFormVisible = false
              _this.revisionConcurrentControl = false
              _this.listLoading = false
              _this.ruleForm1.reservationIds = []
              _this.ruleForm1.workId = ''
              _this.sourcePoolTableData = []
              _this.fetchData()
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '改约成功!',
                duration: 1000
              })
            } else {
              _this.dialogFormVisible = false
              _this.revisionConcurrentControl = false
              _this.listLoading = false
            }
          })
        }
      })
    },
    signUp() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要签到的患者!'
        })
        return false
      }
      if (_this.ruleForm.reservationIds.length > 1) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '只能选择一条预约单进行签到!'
        })
        return false
      }
      _this.ruleForm.status = '4'
      _this.listLoading = true
      _this.btnConcurrentControl = true
      nurseSignUp(_this.ruleForm).then(res => {
        if (res.code === 200) {
          _this.btnConcurrentControl = false
          _this.listLoading = false
          _this.fetchData()
          _this.$notify({
            showClose: true,
            type: 'success',
            message: '签到成功!',
            duration: 1000
          })
        } else {
          _this.btnConcurrentControl = false
          _this.listLoading = false
        }
      })
    },
    revision(row) {
      const _this = this
      _this.ruleForm1.reservationIds = []
      _this.ruleForm2.sourcePoolIds = []
      _this.dialogFormVisible = true
      _this.ruleForm1.officeId = row.officeId
      _this.ruleForm1.reservationIds.push(row.id)
      _this.ruleForm2.sourcePoolIds.push(row.sourcePoolId)
      _this.revisionConcurrentControl = false
      _this.queryWorkScheduleRuleList()
    },
    withdrawalContract() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要退约的患者!'
        })
        return false
      }
      if (_this.ruleForm.reservationIds.length > 10) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '最多同时选择10条记录!'
        })
        return false
      }
      _this.ruleForm.status = '2'
      _this.$confirm('确认进行退约操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.listLoading = true
        _this.withdrawalContractConcurrentControl = true
        withdrawalContract(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.withdrawalContractConcurrentControl = false
            _this.listLoading = false
            _this.fetchData()
            _this.$notify({
              showClose: true,
              type: 'success',
              message: '退约成功!',
              duration: 1000
            })
          } else {
            _this.withdrawalContractConcurrentControl = false
            _this.listLoading = false
          }
        })
      }).catch(() => {
        _this.$notify({
          showClose: true,
          type: 'info',
          message: '已取消退约'
        })
      })
    },
    revoke() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要撤销确认完成的患者!'
        })
        return false
      }
      if (_this.ruleForm.reservationIds.length > 10) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '最多同时选择10条记录!'
        })
        return false
      }
      _this.$confirm('确认进行撤销操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.ruleForm.status = '10'
        _this.listLoading = true
        revoke(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.listLoading = false
            _this.ruleForm.reservationIds = []
            _this.revokeConcurrentControl = false
            _this.fetchData()
            _this.$notify({
              title: '成功',
              message: '撤销成功',
              type: 'success'
            })
          } else {
            _this.revokeConcurrentControl = false
            _this.listLoading = false
          }
        })
      }).catch(() => {
        _this.$notify({
          title: '提醒',
          message: '已取消撤销'
        })
      })
    },
    createQode() {
      JsBarcode('#barcode', 'Hi world', {
        format: 'CODE128', // 选择要使用的条形码类型
        text: 12345678, // 显示文本
        displayValue: true, // 是否在条形码下方显示文字
        textPosition: 'bottom', // 设置文本的垂直位置
        fontOptions: 'bold italic', // 使文字加粗体或变斜体
        background: '#eee', // 设置条形码的背景
        font: 'fantasy', // 设置文本的字体
        lineColor: '#2196f3', // 设置条和文本的颜色。
        margin: 15 // 设置条形码周围的空白边距
      })
    },
    print(data) {
      generageCode(data.patientCode).then(res => {
        if (res.code === 200) {
          const jsBarcode = res.result
          const currentDate = new Date()
          const currentDateStr = currentDate.toLocaleString()
          const LODOP = getLodop()
          LODOP.PRINT_INIT('西北妇女儿童医院预约扣费凭证')
          let remarks = data.remarks
          if (data.remarks == null || data.remarks === undefined) {
            remarks = ''
          }
          var printContent = '<div class="printtext" style="background: #fff;width: 260px;" >' +
            '<div class="text" style="font-size: 20px;font-weight: bold;text-align:center;">\n' +
            '<div class="text" style="font-size: 20px;font-weight: bold;text-align:center;">西北妇女儿童医院</br>预约扣费凭证</div></div>' +
            '<div class="tt" style="margin: 0 auto;height: 20px;width: 260px;line-height: 20px;">' +
            '<span class="p1" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;float:left;">姓名:' + data.patientName + '</span>' +
            '<span class="p2" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;float:right;">诊疗号:' + data.patientCode + '</span>' +
            '</div>' +
            '<div class="mm" style="margin: 0 auto;height: 20px;width: 260px;line-height: 20px;border-bottom:1px solid #000;">' +
            '<span class="p1" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;float:left;">执行科室:' + data.officeName + ' </span>' +
            '<span class="p2" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;float:right;">申请单号:' + data.inspectForm + '</span>' +
            '</div>' +
            '<div class="dd" style="margin: 0 auto;margin-top: 0px;margin-left: 0px;width: 260px;border-bottom:1px solid #000;">' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约组:' + data.medicalTypeName + '</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">排队号:' + data.lineCode + '</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约项目:' + data.inspectProject + '</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约时间:' + data.reservationDate + '&nbsp;' + data.reservationTime + '</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">打印时间:' + currentDateStr + '</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">支付金额:' + data.totalMoney + '元</p>' +
            '</div>' +
            '<div class="ff" style="height: 65px;width: 260px;line-height: 30px;border-bottom:1px solid #000;font-size: 12px;">诊疗号:' +
            '<img id="image001" style="margin-top:5px;" src="' + jsBarcode + '" alt="" />' +
            '</div>' +
            '<div class="ff" style="height: 50px;width: 260px;line-height: 30px;border-bottom:1px solid #000;font-size: 12px;">' +
            '<p>注意事项：' + remarks + '</p>' +
            '</div>' +
            '<div class="ff" style="height: 60px;width: 260px;line-height: 30px;font-size: 12px;">' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">温馨提示:</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">1.胎心监护请勿空腹以免影响检查</p>' +
            '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">2.请您提前在候诊区等待呼叫</p>' +
            '</div></div>'
          LODOP.SET_PRINT_PAGESIZE(1, 780, 1200, '')
          LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', printContent)
          LODOP.PREVIEW()
        }
      })
      // LODOP.PRINT();
    }
  }
}
</script>


