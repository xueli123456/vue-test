<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="page-header">
        <el-button class="filter-item" type="primary" @click="readCard">读卡</el-button>
        <el-button class="filter-item" type="primary" @click="charging">扣费</el-button>
<!--        <el-button class="filter-item" type="primary" >采血</el-button>-->
        <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
      </div>
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="medicalCard">
          <el-input v-model="listQuery.medicalCard" class="filter-item" readonly placeholder="就诊卡号"/>
        </el-form-item>
        <el-form-item label="" prop="patientCode">
          <el-input v-model="listQuery.patientCode" class="filter-item" readonly placeholder="诊疗号"/>
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" readonly placeholder="患者姓名"/>
        </el-form-item>
        <el-form-item label="" prop="patientSex">
          <el-input v-model="listQuery.patientSex" class="filter-item" readonly placeholder="患者性别"/>
        </el-form-item>
        <el-form-item label="" prop="patientAge">
          <el-input v-model="listQuery.patientAge" class="filter-item" readonly placeholder="患者年龄"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" style="width: 100%" @row-click="rowClick">
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            <el-radio class="aa" v-model="ruleForm1.applicationNo" :label="scope.row.applicationFormNo" />
          </template>
        </el-table-column>
        <el-table-column label="申请单号" align="center" min-width="120" prop="applicationFormNo">
          <template slot-scope="scope">
            <span>{{ scope.row.applicationFormNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医技项目" align="center" min-width="200" prop="medicalProjectName">
          <template slot-scope="scope">
            <span>{{ scope.row.medicalProjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目金额" align="center" width="100" prop="totalMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请科室" align="center" min-width="120" prop="applyOfficeName">
          <template slot-scope="scope">
            <span>{{ scope.row.applyOfficeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" min-width="100" prop="applyDate">
          <template slot-scope="scope">
            <span>{{ scope.row.applyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行科室" align="center" min-width="120" prop="execOfficeName">
          <template slot-scope="scope">
            <span>{{ scope.row.execOfficeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注意事项" align="center" min-width="120" prop="remarks">
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
    </div>

    <el-dialog title="读卡" :visible.sync="dialogFormVisible">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" :inline="true">
          <el-form-item label="就诊卡号" prop="medicalCard">
            <el-input v-model="ruleForm.medicalCard" class="filter-item" clearable placeholder="就诊卡号" @keyup.enter.native="doReadCard"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doReadCard">确定</el-button>
          <el-button @click="resetQueryForm('ruleForm')">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { queryPatientInfo, queryApplicationForm, emergencyDeduction } from '@/api/medicalJy'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    directives: {
      waves
    },
    data() {
      return {
        total: 0,
        dialogFormVisible: false,
        listLoading: true,
        listQuery: {
          medicalCard: '',
          patientName: '',
          patientCard: '',
          patientSex: '',
          patientAge: ''
        },
        ruleForm: {
          medicalCard: ''
        },
        ruleForm1: {
          applicationNo: '',
          hisApplicationNos: [],
          execOfficeId: '',
          applyOfficeId: '',
          applyDoctorId: '',
          totalMoney: '',
          groupUnique: '',
          containOgtt: '',
          sourcePoolIds: []
        },
        tableData: [],
        rules: {
          medicalCard: [{ required: true, message: '就诊卡号不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
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
      rowClick(row, column, cell, event) {
        const _this = this
        console.log(row)
        _this.ruleForm1 = {}
        _this.ruleForm1.applicationNo = row.applicationFormNo
        _this.ruleForm1.hisApplicationNos = row.inspectFormList
        _this.ruleForm1.execOfficeId = row.execOfficeId
        _this.ruleForm1.applyOfficeId = row.applyOfficeId
        _this.ruleForm1.applyDoctorId = row.applyDoctorId
        _this.ruleForm1.totalMoney = row.totalMoney
        _this.ruleForm1.groupUnique = row.groupUnique
        _this.ruleForm1.containOgtt = row.containOgtt
        _this.ruleForm1.patientCard = _this.listQuery.patientCode
        _this.ruleForm1.sourcePoolIds = row.sourcePoolIdList
      },
      resetQueryForm(formName) {
        const _this = this
        _this.dialogFormVisible = false
        _this.$refs[formName].resetFields()
        _this.listQuery.patientName = ''
        _this.listQuery.medicalCard = ''
        _this.listQuery.patientCode = ''
        _this.listQuery.patientSex = ''
        _this.listQuery.patientAge = ''
        _this.tableData = []
        _this.total = 0
      },
      readCard() {
        const _this = this
        _this.dialogFormVisible = true
      },
      charging() {
        const _this = this
        if( _this.ruleForm1.applicationNo === '' || _this.ruleForm1.applicationNo === null){
          _this.$notify({
            title: '警告',
            message: '申请单不能为空',
            type: 'warning'
          })
          return
        }
        _this.ruleForm1.status = '1000'
        _this.listLoading = true
        emergencyDeduction(_this.ruleForm1).then(res => {
          if (res.code === 200) {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            _this.resetQueryForm('ruleForm')
          }
          _this.listLoading = false
        })
      },
      doReadCard() {
        const _this = this
        _this.dialogFormVisible = true
        _this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            queryPatientInfo( _this.ruleForm.medicalCard ).then(res => {
              if (res.code === 200) {
                _this.dialogFormVisible = false
                _this.listQuery.patientName = res.result.patientName
                _this.listQuery.medicalCard = res.result.medicalCard
                _this.listQuery.patientCode = res.result.patientCode
                _this.listQuery.patientSex = res.result.patientSex
                _this.listQuery.patientAge = res.result.patientAge
                _this.queryApplicationForm()
                _this.$refs['ruleForm'].resetFields()
              }
            })
          }
        })
      },
      queryApplicationForm() {
        const _this = this
        const param = {}
        param.patientIdCard = _this.listQuery.patientCode
        param.pageNo = 1
        param.pageSize = 10
        queryApplicationForm(param).then(res => {
          if (res.code === 200) {
            _this.tableData = res.result.list
            _this.total = res.result.total
            _this.listLoading = false
          }
          _this.listLoading = false
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
    border-radius: 9px
  }
  .aa .el-radio__label {
    display: none;
  }
</style>
