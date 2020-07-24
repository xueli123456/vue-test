<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="execOfficeId">
          <el-select v-model="listQuery.execOfficeId" filterable clearable placeholder="请选择科室" @change="getDiseaseRoomList" @clear="cleanSelectData('listQuery')">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="execWindowsId">
          <el-select v-model="listQuery.execWindowsId" filterable clearable placeholder="请选择窗口">
            <el-option
              v-for="item in windowsList"
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
        <el-form-item label="" prop="applicationNo">
          <el-input v-model="listQuery.applicationNo" class="filter-item" clearable placeholder="申请单号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" clearable placeholder="患者姓名" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientCard">
          <el-input v-model="listQuery.patientCard" class="filter-item" clearable placeholder="诊疗号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="lineNo">
          <el-input v-model="listQuery.lineNo" style="width: 205px;" placeholder="排队号" clearable />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="sequenceCall">顺呼</el-button>
          <el-button class="filter-item" type="primary" @click="viewTableInfo('BB')">呼叫</el-button>
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
        <el-table-column align="center" label="操作" width="150px" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="primary"  size="mini" @click="viewCollectBloodDetail(scope.row)">查看采血明细</el-button>
          </template>
        </el-table-column>
        <el-table-column label="排队号" align="center" min-width="100" prop="lineNo">
          <template slot-scope="scope">
            <span>{{ scope.row.lineNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约状态" align="center" min-width="100" prop="statusDesc">
          <template slot-scope="scope">
            <span>{{ scope.row.applicationStatus | statusFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="诊疗号" align="center" min-width="120" prop="patientCard">
          <template slot-scope="scope">
            <span>{{ scope.row.patientCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请单号" align="center" min-width="120" prop="applicationNo">
          <template slot-scope="scope">
            <span>{{ scope.row.applicationNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center" min-width="100" prop="patientName">
          <template slot-scope="scope">
            <span>{{ scope.row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查项目" align="center" min-width="200" prop="medicalProjectName">
          <template slot-scope="scope">
            <span>{{ scope.row.medicalProjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目金额" align="center" width="100" prop="totalMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时间" align="center" min-width="100" prop="reservationDate">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时段" align="center" min-width="120" prop="reservationTimeInterval">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationTimeInterval }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约渠道" align="center" min-width="100" prop="reservationChannelDesc">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationChannel | channelFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请科室" align="center" min-width="120" prop="applyOfficeName">
          <template slot-scope="scope">
            <span>{{ scope.row.applyOfficeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行科室" align="center" min-width="120" prop="execOfficeName">
          <template slot-scope="scope">
            <span>{{ scope.row.execOfficeName }}</span>
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

    <el-dialog title="查看采血明细" :visible.sync="viewCollectDialogFormVisible">
      <div class="dialog_auto_increase">
        <el-table v-loading.body="listLoading" :data="tableData2" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
          <el-table-column type="selection" align="center" min-width="80" />
          <el-table-column align="center" fixed width="100" label="序号">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="排队号" align="center" min-width="100" prop="lineNo">
            <template slot-scope="scope">
              <span>{{ scope.row.lineNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="100" prop="applicationStatus">
            <template slot-scope="scope">
              <span>{{ scope.row.applicationStatus | callStatusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="呼叫窗口" align="center" min-width="150" prop="callWindowsName">
            <template slot-scope="scope">
              <span>{{ scope.row.callWindowsName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="呼叫时间" align="center" min-width="180" prop="startDateTime">
            <template slot-scope="scope">
              <span v-if="scope.row.applicationStatus !== '10'">{{ scope.row.startDateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成时间" align="center" min-width="180" prop="endDateTime">
            <template slot-scope="scope">
              <span v-if="scope.row.applicationStatus === '30'">{{ scope.row.endDateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" min-width="100" prop="updateUserName">
            <template slot-scope="scope">
              <span>{{ scope.row.updateUserName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="viewCollectDialogFormVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="查看预约单" :visible.sync="dialogFormVisible" width="90%" @close="resetForm('ruleForm1')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm1" :rules="rules" :model="ruleForm1" label-position="left" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="科室" prop="execOfficeId">
                <el-select v-model="ruleForm1.execOfficeId" filterable clearable placeholder="请选择科室" @change="getDiseaseRoomList1" @clear="cleanSelectData('ruleForm1')">
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
              <el-form-item label="诊室" prop="execWindowsId">
                <el-select v-model="ruleForm1.execWindowsId" filterable clearable placeholder="请选择诊室">
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
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请单号" prop="applicationNo">
                <el-input v-model="ruleForm1.applicationNo" style="width: 205px;" placeholder="申请单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="诊疗号" prop="patientCard">
                <el-input v-model="ruleForm1.patientCard" style="width: 205px;" placeholder="诊疗号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="ruleForm1.patientName" style="width: 205px;" placeholder="患者姓名" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="排队号" prop="lineNo">
                <el-input v-model="ruleForm1.lineNo" style="width: 205px;" placeholder="排队号" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="filter-item" type="primary" @click="searchFilter1()">搜索</el-button>
            <el-button v-if="ruleForm1.queryFlag === '5'" type="primary" @click="hangUp">挂起</el-button>
            <el-button v-if="ruleForm1.queryFlag === '4'" type="primary" @click="complete">完成</el-button>
            <el-button v-if="ruleForm1.queryFlag === '3'" type="primary" @click="revoke">撤销</el-button>
            <el-button v-if="ruleForm1.queryFlag === 'BB'" type="primary" :disabled="callConcurrentControl" @click="call">呼叫</el-button>
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
            <el-table-column label="排队号" align="center" min-width="100" prop="lineNo">
              <template slot-scope="scope">
                <span>{{ scope.row.lineNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请单号" align="center" min-width="120" prop="applicationNo">
              <template slot-scope="scope">
                <span>{{ scope.row.applicationNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="诊疗号" align="center" min-width="120" prop="patientCard">
              <template slot-scope="scope">
                <span>{{ scope.row.patientCard }}</span>
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
                <span>{{ scope.row.reservationChannel | channelFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检查项目" align="center" min-width="200" prop="medicalProjectName">
              <template slot-scope="scope">
                <span>{{ scope.row.medicalProjectName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约时间" align="center" min-width="100" prop="reservationDate">
              <template slot-scope="scope">
                <span>{{ scope.row.reservationDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约时段" align="center" min-width="120" prop="reservationTimeInterval">
              <template slot-scope="scope">
                <span>{{ scope.row.reservationTimeInterval }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预约状态" align="center" min-width="100" prop="applicationStatus">
              <template slot-scope="scope">
                <span>{{ scope.row.applicationStatus | statusFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="就诊科室" align="center" min-width="120" prop="applyOfficeName">
              <template slot-scope="scope">
                <span>{{ scope.row.applyOfficeName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行科室" align="center" min-width="120" prop="execOfficeName">
              <template slot-scope="scope">
                <span>{{ scope.row.execOfficeName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <el-pagination
              background
              :current-page.sync="ruleForm1.pageNum"
              :page-sizes="[10,20,30, 50]"
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
  import { getDepartment, getRoomList, getSourcePoolList, listPage, handleApplicationForm, queryBloodCollectionDetails } from '@/api/medicalJy'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'normalIndex',
    directives: {
      waves
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
        viewCollectDialogFormVisible: false,
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
          containOgtt: 0,
          reservationDate: new Date(),
          execOfficeId: '',
          execWindowsId: '',
          sourcePoolIds: [],
          applicationNo: '',
          status: '',
          queryFlag: 'AA',
          patientName: '',
          patientCard: '',
          lineNo: '',
          pageNum: 1,
          pageSize: 20
        },
        ruleForm1: {
          containOgtt: 0,
          execOfficeId: '',
          execWindowsId: '',
          sourcePoolIds: [],
          applicationNo: '',
          status: '',
          patientName: '',
          lineNo: '',
          queryFlag: '',
          patientCard: '',
          pageNum: 1,
          pageSize: 20
        },
        ruleForm: {
          reservationIds: [],
          status: '',
          execWindowsId: '',
          execOfficeId: ''
        },
        tableData: [],
        tableData1: [],
        tableData2: [],
        departmentList: [],
        windowsList: [],
        sourcePoolList: [],
        departmentList1: [],
        diseaseRoomList1: [],
        txOfficeTimeList1: [],
        sourcePoolList1: [],
        statusList: [
          {
            key: '7',
            value: '首次报道'
          },
          {
            key: '15',
            value: '首次完成'
          },
          {
            key: '17',
            value: '二次报道'
          },
          {
            key: '25',
            value: '二次完成'
          },
          {
            key: '27',
            value: '三次报道'
          },
          {
            key: '5',
            value: '已完成'
          },
          {
            key: '8',
            value: '已挂起'
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
    filters: {
      statusFilter(status) {
        const statusMap = {
          '1': '已预约',
          '2': '已退约',
          '3': '已改约',
          '4': '已签到',
          '6': '预约作废',
          '8': '已挂起',
          '10': '已撤销',
          '7': '首次报道',
          '15': '首次完成',
          '17': '二次报道',
          '25': '二次完成',
          '27': '三次报道',
          '5': '已完成'
        }
        return statusMap[status]
      },
      callStatusFilter(status) {
        const statusMap = {
          '10': '等待呼叫',
          '20': '正在采血',
          '30': '已完成'
        }
        return statusMap[status]
      },
      channelFilter(status) {
        const statusMap = {
          '0': 'PC',
          '1': '小程序',
          '2': '自助机'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
      this.getDepartmentInfos()
    },
    methods: {
      viewCollectBloodDetail(row){
        const _this = this
        _this.viewCollectDialogFormVisible = true
        _this.listLoading = true
        queryBloodCollectionDetails(row.id).then(res => {
          if (res.code === 200) {
            _this.tableData2 = res.result
            _this.listLoading = false
          }
          _this.listLoading = false
        })
      },
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
        _this.listQuery.sourcePoolIds = []
        _this.listQuery.execWindowsId = ''
        _this.sourcePoolList = []
        _this.windowsList = []
        if (_this.listQuery.execOfficeId === '') {
          return
        }
        getRoomList(_this.listQuery.execOfficeId).then(res => {
          if (res.code === 200) {
            this.windowsList = res.result
          }
        })
        _this.getSourcePoolList()
      },
      getSourcePoolList() {
        const _this = this
        getSourcePoolList(_this.listQuery.execOfficeId).then(res => {
          if (res.code === 200) {
            this.sourcePoolList = res.result
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
        _this.ruleForm1.sourcePoolIds = []
        _this.ruleForm1.execWindowsId = ''
        _this.sourcePoolList1 = []
        _this.diseaseRoomList1 = []
        _this.txOfficeTimeList1 = []
        if (_this.ruleForm1.execOfficeId === '') {
          return
        }
        getRoomList(_this.ruleForm1.execOfficeId).then(res => {
          if (res.code === 200) {
            this.diseaseRoomList1 = res.result
          }
        })
        _this.getSourcePoolList1()
        _this.getOfficeTimeList1()
      },
      getSourcePoolList1() {
        const _this = this
        getSourcePoolList(_this.ruleForm1.execOfficeId).then(res => {
          if (res.code === 200) {
            this.sourcePoolList1 = res.result
          }
        })
      },
      getOfficeTimeList1() {
        const _this = this
        getSourcePoolList(_this.ruleForm1.execOfficeId).then(res => {
          if (res.code === 200) {
            this.txOfficeTimeList1 = res.result
          }
        })
      },
      cleanSelectData(val) {
        const _this = this
        if (val === 'ruleForm1') {
          _this.ruleForm1.execWindowsId = ''
          _this.ruleForm1.sourcePoolIds = []
        } else {
          _this.listQuery.execWindowsId = ''
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
          }
          _this.listLoading = false
        })
      },
      handleSizeChange(val) {
        const _this = this
        _this.pageSize = val
        _this.fetchData()
      },
      handleCurrentChange(val) {
        const _this = this
        _this.pageNum = val
        _this.fetchData()
      },
      handleSizeChange1(val) {
        const _this = this
        _this.ruleForm1.pageSize1 = val
        _this.listData()
      },
      handleCurrentChange1(val) {
        const _this = this
        _this.ruleForm1.pageNum1 = val
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
        _this.pageNum = 1
        _this.fetchData()
      },
      searchFilter1() {
        const _this = this
        _this.ruleForm1.pageNum1 = 1
        _this.listData()
      },
      viewTableInfo(val) {
        const _this = this
        if (_this.ruleForm.reservationIds.length > 0) {
          if (_this.listQuery.execOfficeId === '') {
            _this.$notify({
              showClose: true,
              type: 'warning',
              message: '科室不能为空'
            })
            return false
          }
          if (_this.listQuery.execWindowsId === '') {
            _this.$notify({
              showClose: true,
              type: 'warning',
              message: '诊室不能为空'
            })
            return false
          }
          _this.ruleForm.execWindowsId = _this.listQuery.execWindowsId
          _this.ruleForm.execOfficeId = _this.listQuery.execOfficeId
          _this.doCall()
        } else {
          _this.dialogFormVisible = true
          _this.ruleForm.reservationIds = []
          _this.ruleForm1.queryFlag = val
          _this.ruleForm1.status = ''
          _this.ruleForm1.execOfficeId = _this.listQuery.execOfficeId
          _this.getDepartmentInfos1()
          if (_this.ruleForm1.execOfficeId !== '') {
            _this.getDiseaseRoomList1()
            _this.getOfficeTimeList1()
            _this.getSourcePoolList1()
          }
          _this.ruleForm1.execWindowsId = _this.listQuery.execWindowsId
          _this.ruleForm1.execWindowsId = _this.listQuery.execWindowsId
          _this.ruleForm1.applicationNo = _this.listQuery.applicationNo
          _this.ruleForm1.lineNo = _this.listQuery.lineNo
          _this.ruleForm1.patientName = _this.listQuery.patientName
          _this.ruleForm1.sourcePoolIds = _this.listQuery.sourcePoolIds
          _this.listData()
        }
      },
      listData() {
        const _this = this
        _this.listLoading = true
        _this.ruleForm1.reservationDate = _this.listQuery.reservationDate
        listPage(_this.ruleForm1).then(res => {
          if (res.code === 200) {
            _this.tableData1 = res.result.list
            _this.total = res.result.total
            _this.listLoading = false
          }
          _this.listLoading = false
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
        if (_this.ruleForm1.execOfficeId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '科室不能为空'
          })
          return false
        }
        if (_this.ruleForm1.execWindowsId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '诊室不能为空'
          })
          return false
        }
        _this.ruleForm.execWindowsId = _this.ruleForm1.execWindowsId
        _this.ruleForm.execOfficeId = _this.ruleForm1.execOfficeId
        _this.doCall()
      },
      doCall() {
        const _this = this
        _this.ruleForm.status = '7'
        _this.callConcurrentControl = true
        handleApplicationForm(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.ruleForm.reservationIds = []
            _this.fetchData()
            _this.listData()
            _this.$notify({
              title: '成功',
              message: '呼叫成功',
              type: 'success'
            })
          }
          _this.callConcurrentControl = false
          _this.listLoading = false

        })
      },
      sequenceCall() {
        const _this = this
        if (_this.listQuery.execOfficeId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '科室不能为空'
          })
          return false
        }
        if (_this.listQuery.execWindowsId === '') {
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
        _this.listLoading = true
        _this.listQuery.status = '0'
        handleApplicationForm(_this.listQuery).then(res => {
          if (res.code === 200) {
            _this.fetchData()
            _this.$notify({
              title: '成功',
              message: '顺呼成功',
              type: 'success'
            })
          }
          _this.listLoading = false
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
        if (_this.listQuery.execOfficeId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '科室不能为空'
          })
          return false
        }
        if (_this.listQuery.execWindowsId === '') {
          _this.$notify({
            showClose: true,
            type: 'warning',
            message: '诊室不能为空'
          })
          return false
        }
        _this.ruleForm.execWindowsId = _this.listQuery.execWindowsId
        _this.ruleForm.execOfficeId = _this.listQuery.execOfficeId
        _this.ruleForm.status = '8'
        _this.hangUpConcurrentControl = true
        _this.listLoading = true
        handleApplicationForm(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.ruleForm.reservationIds = []
            _this.fetchData()
            _this.$notify({
              title: '成功',
              message: '挂起成功',
              type: 'success'
            })
          }
          _this.hangUpConcurrentControl = false
          _this.listLoading = false
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
        _this.completeConcurrentControl = true
        handleApplicationForm(_this.ruleForm).then(res => {
          if (res.code === 200) {
            _this.ruleForm.reservationIds = []
            _this.fetchData()
            _this.$notify({
              title: '成功',
              message: '确认完成成功',
              type: 'success'
            })
          }
          _this.completeConcurrentControl = false
          _this.listLoading = false
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
          _this.revokeConcurrentControl = true
          handleApplicationForm(_this.ruleForm).then(res => {
            if (res.code === 200) {
              _this.ruleForm.reservationIds = []
              _this.fetchData()
              _this.$notify({
                title: '成功',
                message: '撤销成功',
                type: 'success'
              })
            }
            _this.revokeConcurrentControl = false
            _this.listLoading = false
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
