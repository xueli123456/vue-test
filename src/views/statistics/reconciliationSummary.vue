<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="科室" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="请选择科室">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期" prop="reservationDateRange">
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
      <el-table-column label="总净收入" min-width="100" align="center" prop="totalNetIncome">
        <template slot-scope="scope">
          <span>{{ scope.row.totalNetIncome }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总收入笔数" min-width="100" align="center" prop="totalNum">
        <template slot-scope="scope">
          <span>{{ scope.row.totalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总收入" align="center" min-width="100" prop="totalMoney">
        <template slot-scope="scope">
          <span>{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总退款笔数" align="center" min-width="100" prop="totalCancelNum">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCancelNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总退款" align="center" min-width="100" prop="totalCancelMoney">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCancelMoney }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { querySummary, getDepartmentInfos } from '@/api/reconciliation'
export default {
  name: 'Tab',
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
      reservationDateRange: [new Date(), new Date()],
      listLoading: false,
      tableData: [],
      departmentList: [],
      listQuery: {
        officeId: '',
        inspectForm: '',
        status: '',
        patientName: '',
        startDateTime: '',
        endDateTime: '',
        medicalTypeId: ''
      }
    }
  },
  watch: {
  },
  created() {
    this.getDepartmentInfos()
  },
  methods: {
    getDepartmentInfos() {
      const _this = this
      getDepartmentInfos().then(res => {
        console.log(res)
        _this.departmentList = res.result
      })
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.startDateTime = this.reservationDateRange[0]
      this.listQuery.endDateTime = this.reservationDateRange[1]
      querySummary(this.listQuery).then(res => {
        if (res.code === 200) {
          const json = {}
          json.totalNum = res.result.totalNum
          json.totalMoney = res.result.totalMoney
          json.totalNetIncome = res.result.totalNetIncome
          json.totalCancelNum = res.result.totalCancelNum
          json.totalCancelMoney = res.result.totalCancelMoney
          this.tableData = []
          this.tableData.push(json)
          this.listLoading = false
        }
      })
    },
    resetQueryForm(formName) {
      const _this = this
      _this.reservationDateRange = [new Date(), new Date()]
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.listQuery.pageNum = 1
      _this.fetchData()
    }
  }
}
</script>

<style scoped>
</style>
