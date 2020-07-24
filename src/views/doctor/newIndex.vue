<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="请选择科室" @change="getDiseaseRoomList" @clear="cleanSelectData('listQuery')">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="consultingRoomId">
          <el-select v-model="listQuery.consultingRoomId" filterable clearable placeholder="请选择诊室">
            <el-option
              v-for="item in diseaseRoomList"
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
        <el-form-item label="" prop="sectionNumberIds">
          <el-select v-model="listQuery.sectionNumberIds" multiple filterable clearable placeholder="请选择全部号段">
            <el-option
              v-for="item in txOfficeTimeList"
              :key="item.id"
              :label="item.sectionNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="sourcePoolIds">
          <el-select v-model="listQuery.sourcePoolIds" multiple filterable clearable placeholder="请选择全部号源">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          <el-input v-model="listQuery.inspectForm" class="filter-item" clearable placeholder="申请单号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" clearable placeholder="患者姓名" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientCode">
          <el-input v-model="listQuery.patientCode" class="filter-item" clearable placeholder="诊疗号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="lineCode">
          <el-input v-model="listQuery.lineCode" class="filter-item" clearable placeholder="排队号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="sequenceCall">顺呼</el-button>
          <el-button class="filter-item" type="primary" @click="viewTableInfo('1')">呼叫</el-button>
          <el-button class="filter-item" type="primary" :disabled="hangUpConcurrentControl" @click="hangUp">挂起</el-button>
          <el-button class="filter-item" type="primary" :disabled="completeConcurrentControl" @click="complete">确认完成</el-button>
          <el-button class="filter-item" type="primary" :disabled="revokeConcurrentControl" @click="revoke">医技撤销</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" min-width="80" />
        <el-table-column align="center" fixed width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="排队号" align="center" min-width="100" prop="lineCode">
          <template slot-scope="scope">
            <span>{{ scope.row.lineCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约状态" align="center" min-width="100" prop="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="诊疗号" align="center" min-width="120" prop="patientCode">
          <template slot-scope="scope">
            <span>{{ scope.row.patientCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请单号" align="center" min-width="120" prop="inspectForm">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectForm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center" min-width="100" prop="patientName">
          <template slot-scope="scope">
            <span>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目金额" align="center" width="100" prop="totalMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约渠道" align="center" min-width="100" prop="reservationCanalName">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationCanalName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查项目" align="center" min-width="200" prop="inspectProject">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectProject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时间" align="center" min-width="100" prop="reservationDate">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时段" align="center" min-width="120" prop="reservationTime">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="就诊科室" align="center" min-width="120" prop="applyOffice">
          <template slot-scope="scope">
            <span>{{ scope.row.applyOffice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行科室" align="center" min-width="120" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.officeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="呼叫诊室" align="center" min-width="120" prop="roomName">
          <template slot-scope="scope">
            <span>{{ scope.row.roomName }}</span>
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

    <el-dialog title="查看预约单" :visible.sync="dialogFormVisible" width="90%" @close="resetForm('ruleForm1')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm1" :rules="rules" :model="ruleForm1" label-position="left" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="科室" prop="officeId">
                <el-select v-model="ruleForm1.officeId" filterable clearable placeholder="请选择科室" @change="getDiseaseRoomList1" @clear="cleanSelectData('ruleForm1')">
                  <el-option
                    v-for="item in departmentList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="诊室" prop="consultingRoomId">
                <el-select v-model="ruleForm1.consultingRoomId" filterable clearable placeholder="请选择诊室">
                  <el-option
                    v-for="item in diseaseRoomList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="号段" prop="sectionNumberIds">
                <el-select v-model="ruleForm1.sectionNumberIds" multiple filterable clearable placeholder="请选择全部号段">
                  <el-option
                    v-for="item in txOfficeTimeList1"
                    :key="item.id"
                    :label="item.sectionNumber"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="号源" prop="sourcePoolIds">
                <el-select v-model="ruleForm1.sourcePoolIds" multiple filterable clearable placeholder="请选择全部号源">
                  <el-option
                    v-for="item in sourcePoolList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请单号" prop="inspectForm">
                <el-input v-model="ruleForm1.inspectForm" style="width: 205px;" placeholder="申请单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="诊疗号" prop="patientCode">
                <el-input v-model="ruleForm1.patientCode" style="width: 205px;" placeholder="诊疗号" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="ruleForm1.patientName" style="width: 205px;" placeholder="患者姓名" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排队号" prop="lineCode">
                <el-input v-model="ruleForm1.lineCode" style="width: 205px;" placeholder="排队号" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="filter-item" type="primary" @click="searchFilter1()">搜索</el-button>
            <el-button v-if="ruleForm1.queryFlag === '5'" type="primary" @click="hangUp">挂起</el-button>
            <el-button v-if="ruleForm1.queryFlag === '4'" type="primary" @click="complete">完成</el-button>
            <el-button v-if="ruleForm1.queryFlag === '3'" type="primary" @click="revoke">撤销</el-button>
            <el-button v-if="ruleForm1.queryFlag === '1'" type="primary" :disabled="callConcurrentControl" @click="call">呼叫</el-button>
          </el-row>
        </el-form>
        <div style="margin-top: 10px">
          <el-table v-loading.body="listLoading" :data="tableData1" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" min-width="80" />
            <el-table-column align="center" fixed width="100" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="排队号" align="center" min-width="100" prop="lineCode">
              <template slot-scope="scope">
                <span>{{ scope.row.lineCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请单号" align="center" min-width="120" prop="inspectForm">
              <template slot-scope="scope">
                <span>{{ scope.row.inspectForm }}</span>
              </template>
            </el-table-column>
            <el-table-column label="诊疗号" align="center" min-width="120" prop="patientCode">
              <template slot-scope="scope">
                <span>{{ scope.row.patientCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" min-width="100" prop="patientName">
              <template slot-scope="scope">
                <span>{{ scope.row.patientName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目金额" align="center" width="100" prop="totalMoney">
              <template slot-scope="scope">
                <span>{{ scope.row.totalMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约渠道" align="center" min-width="100" prop="reservationCanal">
              <template slot-scope="scope">
                <span>{{ scope.row.reservationCanalName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检查项目" align="center" min-width="200" prop="inspectProject">
              <template slot-scope="scope">
                <span>{{ scope.row.inspectProject }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约时间" align="center" min-width="100" prop="reservationDate">
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
            <el-table-column label="就诊科室" align="center" min-width="120" prop="applyOffice">
              <template slot-scope="scope">
                <span>{{ scope.row.applyOffice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行科室" align="center" min-width="120" prop="officeName">
              <template slot-scope="scope">
                <span>{{ scope.row.officeName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <el-pagination
              background
              :current-page.sync="ruleForm1.pageNum"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="ruleForm1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
            />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm1')">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartment, getRoomList, getSourcePoolList, getOfficeTimeList, listPage, feachListPgae, doctorCall, sequenceSign, hangUp, revoke, doComplete } from '@/api/doctor'
import waves from '@/directive/waves' // 水波纹指令
import { formatDate } from '@/utils/dateutils'
export default {
  name: 'Index',
  directives: {
    waves
  },
  filters: {
    statusFilter(val) {
      let status = ''
      switch (val) {
        case '4': {
          status = '已签到'
          break
        }
        case '5': {
          status = '已完成'
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
      btnDisabled: false,
      sequenceCallConcurrentControl: false,
      callConcurrentControl: false,
      hangUpConcurrentControl: false,
      completeConcurrentControl: false,
      revokeConcurrentControl: false,
      disabledStatus: false,
      dialogFormVisible: false,
      listLoading: true,
      total1: 0,
      total: 0,
      reservationId: '',
      listQuery: {
        reservationDate: formatDate( new Date() ,'yyyy-MM-dd'),
        officeId: '',
        consultingRoomId: '',
        sectionNumberIds: [],
        sourcePoolIds: [],
        inspectForm: '',
        status: '',
        patientName: '',
        patientCode: '',
        lineCode: '',
        pageNum: 1,
        pageSize: 20
      },
      ruleForm1: {
        officeId: '',
        consultingRoomId: '',
        sectionNumberIds: [],
        sourcePoolIds: [],
        inspectForm: '',
        status: '',
        patientName: '',
        lineCode: '',
        queryFlag: '',
        patientCode: '',
        pageNum: 1,
        pageSize: 20
      },
      ruleForm: {
        reservationIds: [],
        status: '',
        consultingRoomId: '',
        officeId: ''
      },
      tableData: [],
      tableData1: [],
      departmentList: [],
      diseaseRoomList: [],
      txOfficeTimeList: [],
      sourcePoolList: [],
      departmentList1: [],
      diseaseRoomList1: [],
      txOfficeTimeList1: [],
      sourcePoolList1: [],
      statusList: [
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
        },
        {
          key: '10',
          value: '已撤销'
        }
      ],
      showFlagList: [
        {
          key: '1',
          value: '是'
        },
        {
          key: '0',
          value: '否'
        }
      ],
      rules: {
      }
    }
  },
  created() {
    this.fetchData()
    this.getDepartmentInfos()
  },
  methods: {
    handleSelectionChange(val) {
      const _this = this
      _this.ruleForm.reservationIds = []
      val.forEach(item => {
        _this.ruleForm.reservationIds.push(item.id)
      })
    },
    getDepartmentInfos() {
      getDepartment().then(res => {
        if (res.code === 200) {
          this.departmentList = res.result
        }
      })
    },
    getDiseaseRoomList() {
      const _this = this
      _this.listQuery.sectionNumberIds = []
      _this.listQuery.sourcePoolIds = []
      _this.listQuery.consultingRoomId = ''
      _this.sourcePoolList = []
      _this.diseaseRoomList = []
      _this.txOfficeTimeList = []
      if (_this.listQuery.officeId === '') {
        return
      }
      getRoomList(_this.listQuery.officeId).then(res => {
        if (res.code === 200) {
          this.diseaseRoomList = res.result
        }
      })
      _this.getSourcePoolList()
      _this.getOfficeTimeList()
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
    getDepartmentInfos1() {
      const _this = this
      getDepartment().then(res => {
        if (res.code === 200) {
          _this.departmentList1 = res.result
        }
      })
    },
    getDiseaseRoomList1() {
      const _this = this
      _this.ruleForm1.sectionNumberIds = []
      _this.ruleForm1.sourcePoolIds = []
      _this.ruleForm1.consultingRoomId = ''
      _this.sourcePoolList1 = []
      _this.diseaseRoomList1 = []
      _this.txOfficeTimeList1 = []
      if (_this.ruleForm1.officeId === '') {
        return
      }
      getRoomList(_this.ruleForm1.officeId).then(res => {
        if (res.code === 200) {
          this.diseaseRoomList1 = res.result
        }
      })
      _this.getSourcePoolList1()
      _this.getOfficeTimeList1()
    },
    getSourcePoolList1() {
      const _this = this
      getSourcePoolList(_this.ruleForm1.officeId).then(res => {
        if (res.code === 200) {
          this.sourcePoolList1 = res.result
        }
      })
    },
    getOfficeTimeList1() {
      const _this = this
      getOfficeTimeList(_this.ruleForm1.officeId).then(res => {
        if (res.code === 200) {
          this.txOfficeTimeList1 = res.result
        }
      })
    },
    cleanSelectData(val) {
      const _this = this
      if (val === 'ruleForm1') {
        _this.ruleForm1.sectionNumberIds = []
        _this.ruleForm1.consultingRoomId = ''
        _this.ruleForm1.sourcePoolIds = []
      } else {
        _this.listQuery.sectionNumberIds = []
        _this.listQuery.consultingRoomId = ''
        _this.listQuery.sourcePoolIds = []
      }
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
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
      _this.ruleForm1.pageSize = val
      _this.listData()
    },
    handleCurrentChange1(val) {
      const _this = this
      _this.ruleForm1.pageNum = val
      _this.listData()
    },
    resetQueryForm(formName) {
      const _this = this
      _this.$refs[formName].resetFields()
      if (formName === 'listQuery') {
        _this.fetchData()
      } else {
        _this.listData()
      }
    },
    resetForm(formName) {
      const _this = this
      _this.dialogFormVisible = false
      _this.sourcePoolList1 = []
      _this.diseaseRoomList1 = []
      _this.txOfficeTimeList1 = []
      _this.ruleForm.reservationIds = []
      _this.ruleForm1.pageNum1 = 0
      _this.ruleForm1.pageSize1 = 20
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.listQuery.pageNum = 1
      _this.fetchData()
    },
    searchFilter1() {
      const _this = this
      _this.ruleForm1.pageNum = 1
      _this.listData()
    },
    viewTableInfo(val) {
      const _this = this
      if (_this.ruleForm.reservationIds.length > 0) {
        if (_this.listQuery.officeId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '科室不能为空'
          })
          return false
        }
        if (_this.listQuery.consultingRoomId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '诊室不能为空'
          })
          return false
        }
        _this.ruleForm.consultingRoomId = _this.listQuery.consultingRoomId
        _this.ruleForm.officeId = _this.listQuery.officeId
        _this.doCall()
      } else {
        _this.dialogFormVisible = true
        _this.ruleForm.reservationIds = []
        _this.ruleForm1.queryFlag = val
        _this.ruleForm1.status = ''
        _this.ruleForm1.officeId = _this.listQuery.officeId
        _this.getDepartmentInfos1()
        if (_this.ruleForm1.officeId !== '') {
          _this.getDiseaseRoomList1()
          _this.getOfficeTimeList1()
          _this.getSourcePoolList1()
        }
        _this.ruleForm1.consultingRoomId = _this.listQuery.consultingRoomId
        _this.ruleForm1.consultingRoomId = _this.listQuery.consultingRoomId
        _this.ruleForm1.inspectForm = _this.listQuery.inspectForm
        _this.ruleForm1.lineCode = _this.listQuery.lineCode
        _this.ruleForm1.sectionNumberIds = _this.listQuery.sectionNumberIds
        _this.ruleForm1.patientName = _this.listQuery.patientName
        _this.ruleForm1.sourcePoolIds = _this.listQuery.sourcePoolIds
        _this.listData()
      }
    },
    listData() {
      const _this = this
      _this.listLoading = true
      _this.ruleForm1.reservationDate = _this.listQuery.reservationDate
      feachListPgae(_this.ruleForm1).then(res => {
        if (res.code === 200) {
          _this.tableData1 = res.result.list
          _this.total1 = res.result.total
          _this.listLoading = false
        } else {
          _this.listLoading = false
        }
      })
    },
    call() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要呼叫的患者!'
        })
        return false
      }
      if (_this.ruleForm.reservationIds.length > 10) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '最多只能选择十条预约单进行呼叫!'
        })
        return false
      }
      if (_this.ruleForm1.officeId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '科室不能为空'
        })
        return false
      }
      if (_this.ruleForm1.consultingRoomId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '诊室不能为空'
        })
        return false
      }
      _this.ruleForm.consultingRoomId = _this.ruleForm1.consultingRoomId
      _this.ruleForm.officeId = _this.ruleForm1.officeId
      _this.doCall()
    },
    doCall() {
      const _this = this
      _this.ruleForm.status = '7'
      // _this.callConcurrentControl = true
      doctorCall(_this.ruleForm).then(res => {
        if (res.code === 200) {
          _this.callConcurrentControl = false
          _this.listLoading = false
          _this.ruleForm.reservationIds = []
          _this.fetchData()
          _this.listData()
          _this.$notify({
            title: '成功',
            message: '呼叫成功',
            type: 'success'
          })
        } else {
          _this.callConcurrentControl = false
          _this.listLoading = false
        }
      })
    },
    sequenceCall() {
      const _this = this
      if (_this.listQuery.officeId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '科室不能为空'
        })
        return false
      }
      if (_this.listQuery.consultingRoomId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '诊室不能为空'
        })
        return false
      }
      if (_this.listQuery.sourcePoolIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '号源池不能为空'
        })
        return false
      }
      if (_this.listQuery.reservationDate === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '预约日期不能为空'
        })
        return false
      }
      sequenceSign(_this.listQuery).then(res => {
        if (res.code === 200) {
          _this.listLoading = false
          _this.fetchData()
          _this.$notify({
            title: '成功',
            message: '顺呼成功',
            type: 'success'
          })
        } else {
          _this.listLoading = false
        }
      })
    },
    hangUp() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要挂起的患者!'
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
      if (_this.listQuery.officeId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '科室不能为空'
        })
        return false
      }
      if (_this.listQuery.consultingRoomId === '') {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '诊室不能为空'
        })
        return false
      }
      _this.ruleForm.consultingRoomId = _this.listQuery.consultingRoomId
      _this.ruleForm.officeId = _this.listQuery.officeId
      _this.ruleForm.status = '8'
      // _this.hangUpConcurrentControl = true
      _this.listLoading = true
      hangUp(_this.ruleForm).then(res => {
        if (res.code === 200) {
          _this.hangUpConcurrentControl = false
          _this.listLoading = false
          _this.ruleForm.reservationIds = []
          _this.fetchData()
          _this.$notify({
            title: '成功',
            message: '挂起成功',
            type: 'success'
          })
        } else {
          _this.hangUpConcurrentControl = false
          _this.listLoading = false
        }
      })
    },
    complete() {
      const _this = this
      if (_this.ruleForm.reservationIds.length === 0) {
        _this.$notify({
          showClose: true,
          type: 'warning',
          message: '未选择需要确认完成的患者!'
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
      _this.ruleForm.status = '5'
      _this.listLoading = true
      // _this.completeConcurrentControl = true
      doComplete(_this.ruleForm).then(res => {
        if (res.code === 200) {
          _this.completeConcurrentControl = false
          _this.listLoading = false
          _this.ruleForm.reservationIds = []
          _this.fetchData()
          _this.$notify({
            title: '成功',
            message: '确认完成成功',
            type: 'success'
          })
        } else {
          _this.completeConcurrentControl = false
          _this.listLoading = false
        }
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
        // _this.revokeConcurrentControl = true
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
    }
  }
}
</script>

<style scoped>
</style>
