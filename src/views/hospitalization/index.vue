<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="" prop="patientCode">
          <el-input v-model="listQuery.patientCode" class="filter-item" placeholder="诊疗号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="" prop="patientName">
          <el-input v-model="listQuery.patientName" class="filter-item" placeholder="患者姓名" @keyup.enter.native="searchFilter" />
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
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm(listQuery)">重置</el-button>
        </div>
      </el-form>
    </div>
    <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
      <el-table-column align="center" fixed min-width="100" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="view(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="微信id" min-width="100" align="center" prop="openId">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="诊疗号" min-width="100" align="center" prop="patientCode">
        <template slot-scope="scope">
          <span>{{ scope.row.patientCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" min-width="100" align="center" prop="patientName">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名" min-width="100" align="center" prop="contactsName">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人地址" align="center" min-width="100" prop="contactsAddress">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center" min-width="100" prop="contactsPhone">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位名称" align="center" min-width="100" prop="companyName">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位电话" align="center" min-width="100" prop="companyPhone">
        <template slot-scope="scope">
          <span>{{ scope.row.companyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位邮编" align="center" min-width="100" prop="companyPostCode">
        <template slot-scope="scope">
          <span>{{ scope.row.companyPostCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人关系" align="center" min-width="100" prop="relationType">
        <template slot-scope="scope">
          <span>{{ scope.row.relationName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="填写时间" align="center" min-width="100" prop="createDate">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.createDate }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="更新时间" align="center" min-width="100" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
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
    <el-dialog title="查看预住院信息" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="90px">
          <el-form-item label="微信id" prop="openId">
            <el-input v-model="ruleForm.openId" placeholder="患者姓名" readonly />
          </el-form-item>
          <el-form-item label="患者姓名" prop="patientName">
            <el-input v-model="ruleForm.patientName" placeholder="患者姓名" readonly />
          </el-form-item>
          <el-form-item label="诊疗号" prop="patientCode">
            <el-input v-model="ruleForm.patientCode" placeholder="诊疗号" readonly />
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contactsName">
            <el-input v-model="ruleForm.contactsName" placeholder="联系人姓名" readonly />
          </el-form-item>
          <el-form-item label="联系人地址" prop="contactsAddress">
            <el-input v-model="ruleForm.contactsAddress" placeholder="联系人地址" readonly />
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactsPhone">
            <el-input v-model="ruleForm.contactsPhone" placeholder="联系人电话" readonly />
          </el-form-item>
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="ruleForm.companyName" placeholder="单位名称" readonly />
          </el-form-item>
          <el-form-item label="单位电话" prop="companyPhone">
            <el-input v-model="ruleForm.companyPhone" placeholder="单位电话" readonly />
          </el-form-item>
          <el-form-item label="单位邮编" prop="companyPostCode">
            <el-input v-model="ruleForm.companyPostCode" placeholder="单位邮编" readonly />
          </el-form-item>
          <el-form-item label="联系人关系" prop="relationName">
            <el-input v-model="ruleForm.relationName" placeholder="联系人关系" readonly />
          </el-form-item>
          <!--          <el-form-item label="填写时间" prop="createDate">-->
          <!--            <el-input v-model="ruleForm.createDate" placeholder="填写时间" readonly />-->
          <!--          </el-form-item>-->
          <el-form-item label="更新时间" prop="updateDate">
            <el-input v-model="ruleForm.updateDate" placeholder="更新时间" readonly />
          </el-form-item>
          <!--          <el-form-item label="备注" prop="remarks">-->
          <!--            <el-input-->
          <!--              v-model.trim="ruleForm.remarks"-->
          <!--              type="textarea"-->
          <!--              :autosize="{ minRows: 5, maxRows: 100}"-->
          <!--              placeholder="请输入内容"-->
          <!--              maxlength="255"-->
          <!--            />-->
          <!--          </el-form-item>-->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getListPage } from '@/api/hospitalization'
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
        dialogFormVisible: false,
        listLoading: false,
        total: 0,
        ruleFormParam: {
        },
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          patientCode: '',
          patientName: '',
          createStartDate: '',
          createEndDate: ''
        },
        ruleForm: {
          openId: '',
          patientName: '',
          patientCode: '',
          contactsName: '',
          contactsAddress: '',
          contactsPhone: '',
          companyName: '',
          companyPhone: '',
          companyPostCode: '',
          relationName: '',
          createDate: '',
          updateDate: '',
          remarks: ''
        },
        tableData: [],
        departmentList: [],
        medicalTypeList: [],
        rules: {
        }
      }
    },
    watch: {
    },
    created() {
      this.fetchData()
    },
    methods: {
      searchFilter() {
        const _this = this
        _this.listQuery.pageNum = 1
        _this.fetchData()
      },
      resetQueryForm(formName) {
        const _this = this
        _this.reservationDateRange = [new Date(), new Date()]
        _this.listQuery.patientName = ''
        _this.listQuery.patientCode = ''
      },
      handleCurrentChange(val) {
        const _this = this
        _this.listQuery.pageNum = val
        _this.fetchData()
      },
      handleSizeChange(val) {
        const _this = this
        _this.listQuery.pageSize = val
        _this.fetchData()
      },
      resetForm(formName) {
        const _this = this
        _this.dialogFormVisible = false
        _this.reservationDateRange = [new Date(), new Date()]
        _this.listQuery.patientName = ''
        _this.listQuery.patientCode = ''
      },
      fetchData() {
        this.listLoading = true
        this.listQuery.createStartDate = this.reservationDateRange[0]
        this.listQuery.createEndDate = this.reservationDateRange[1]
        getListPage(this.listQuery).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.result.list
            this.total = res.result.total
            this.listLoading = false
          }
        })
      },
      view(row) {
        const _this = this
        _this.ruleForm.openId = row.openId
        _this.ruleForm.patientName = row.patientName
        _this.ruleForm.contactsName = row.contactsName
        _this.ruleForm.patientCode = row.patientCode
        _this.ruleForm.contactsAddress = row.contactsAddress
        _this.ruleForm.contactsPhone = row.contactsPhone
        _this.ruleForm.companyName = row.companyName
        _this.ruleForm.companyPhone = row.companyPhone
        _this.ruleForm.companyPostCode = row.companyPostCode
        _this.ruleForm.relationName = row.relationName
        _this.ruleForm.createDate = row.createDate
        _this.ruleForm.updateDate = row.updateDate
        _this.ruleForm.remarks = row.remarks
        _this.dialogFormVisible = true
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/dialog_css/dialog.css";
</style>

