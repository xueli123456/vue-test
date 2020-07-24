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
        <el-form-item label="交易日期" prop="tradeDateTime">
          <el-date-picker
            v-model="listQuery.tradeDateTime"
            :clearable="false"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="交易日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="交易类型" prop="type">
          <el-select v-model="listQuery.type" filterable clearable placeholder="请选择交易类型" class="mc-input-col3">
            <el-option
              v-for="item in typeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData1" stripe highlight-current-row element-loading-text="Loading">
        <el-table-column label="总笔数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总金额" align="center" prop="totalMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.totalMoney }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="申请单号" min-width="100" align="center" prop="inspectForm">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectForm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" min-width="150" align="center" prop="orderNo">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细帐号" min-width="200" align="center" prop="tradeNo">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" align="center" min-width="60" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" align="center" min-width="60" prop="orderStatus">
          <template slot-scope="scope">
            <span>{{ scope.row.orderStatus | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" align="center" min-width="60" prop="orderMoney">
          <template slot-scope="scope">
            <span>{{ scope.row.orderMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易时间" align="center" min-width="100" prop="tardeDateTime">
          <template slot-scope="scope">
            <span>{{ scope.row.tardeDateTime }}</span>
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
  </div>
</template>

<script>
import { getDepartmentInfos, listPage } from '@/api/reconciliation'
import waves from '@/directive/waves' // 水波纹指令
import { formatDate } from '@/utils/dateutils'
export default {
  directives: {
    waves
  },
  filters: {
    typeFilter(val) {
      let type = ''
      switch (val) {
        case '0': {
          type = '收款'
          break
        }
        case '1': {
          type = '退款'
          break
        }
      }
      return type
    },
    statusFilter(val) {
      let status = ''
      switch (val) {
        case '1': {
          status = '已支付'
          break
        }
        case '0': {
          status = '未支付'
          break
        }
        case '2': {
          status = '已退款'
          break
        }
        case '3': {
          status = '待退款'
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
      listLoading: true,
      total: 0,
      listQuery: {
        officeId: '',
        tradeDateTime: formatDate( new Date() ,'yyyy-MM-dd'),
        type: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      tableData1: [],
      departmentList: [],
      typeList: [
        {
          key: '0',
          value: '收款'
        },
        {
          key: '1',
          value: '退款'
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
    getDepartmentInfos() {
      getDepartmentInfos().then(res => {
        if (res.code === 200) {
          this.departmentList = res.result
        }
      })
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
      listPage(_this.listQuery).then(res => {
        if (res.code === 200) {
          _this.tableData = res.result.orderDetailList.list
          _this.total = res.result.orderDetailList.total
          const json = {}
          json.count = res.result.count
          json.totalMoney = res.result.totalMoney
          _this.tableData1 = []
          _this.tableData1.push(json)
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
      _this.reservationDateRange = [new Date(), new Date()]
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.dialogFormVisible = false
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
  .page-header {
    padding-bottom: 9px;
    margin: 20px 0 30px;
    border-bottom: 1px solid #eeeeee;
  }
  .table-container{
    margin-bottom: 40px
  }
</style>
