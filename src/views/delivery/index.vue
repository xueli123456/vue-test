<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery" label-position="left" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货时间" prop="deliveryDateTime">
              <el-date-picker
                v-model="listQuery.deliveryDateTime"
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
          </el-col>
          <el-col :span="8">
            <el-form-item label="挂号科室" prop="officeId">
              <el-select v-model="listQuery.companyId" clearable class="filter-item"
                         placeholder="挂号科室">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挂号医生" prop="workPeopleId">
              <el-select v-model="listQuery.workPeopleId" clearable class="filter-item"
                         placeholder="挂号医生">
                <el-option
                  v-for="item in workPeopleList"
                  :key="item.id"
                  :label="item.peopleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="patientName">
              <el-input v-model="listQuery.patientName" class="filter-item" placeholder="姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="listQuery.phone"  class="filter-item" placeholder="联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流公司" prop="company">
              <el-select v-model="listQuery.company" clearable class="filter-item"
                         placeholder="物流公司">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="快递单号" prop="trackingNumber">
              <el-input v-model="listQuery.trackingNumber" class="filter-item"
                        placeholder="快递单号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchFilter">查询</el-button>
        <el-button class="filter-item" type="primary" @click="resetForm('listQuery')">重置</el-button>
      </el-form>
    </div>

    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="viewDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="deliveryDateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流公司" align="center" prop="companyName">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center" prop="trackingNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.trackingNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挂号科室" align="center" prop="officeName">
        <template slot-scope="scope">
          <span>{{ scope.row.officeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挂号医生" align="center" prop="workPeopleName">
        <template slot-scope="scope">
          <span>{{ scope.row.workPeopleName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="totalMoney" label="处方金额">
        <template slot-scope="scope">
          <span>{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="patientName" label="患者姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="phone" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deliveryStatus" label="物流进度">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryStatus }}</span>
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

    <el-dialog title="查看" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :inline="true" :model="ruleForm" label-position="left" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="ruleForm.userName" class="filter-item" placeholder="姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="ruleForm.phone"  class="filter-item" placeholder="联系方式"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物流公司" prop="companyId">
              <el-select v-model="ruleForm.companyId" clearable
                         placeholder="物流公司">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货时间" prop="deliveryDateTime">
              <el-date-picker
                v-model="ruleForm.deliveryDateTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="快递单号" prop="trackingNumber">
              <el-input v-model="ruleForm.trackingNumber"
                        placeholder="快递单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递单号" prop="trackingNumber">
              <el-input v-model="ruleForm.trackingNumber"
                        placeholder="快递单号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="物流状态" prop="deliveryStatus">
            <el-input
              style="width:500px"
              v-model.trim="ruleForm.deliveryStatus"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="1000"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getListPage, getAllDoctorList, getDepartment } from '@/api/delivery'
  import waves from '@/directive/waves' // 水波纹指令
  export default {
    name: 'ComplexTable',
    directives: {
      waves
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '启用',
          0: '禁用'
        }
        return statusMap[status]
      }
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        const phoneReg = /^1\d{10}$/
        if (!phoneReg.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        dialogFormVisible: false,
        listLoading: false,
        total: 0,
        tableData: [],
        departmentList: [],
        workPeopleList:[],
        companyList: [
          {
            id: '1',
            companyName: '阿里巴巴'
          },
          {
            id: '2',
            companyName: '腾讯'
          },
          {
            id: '3',
            companyName: '百度'
          }
        ],
        ruleForm: {
          id: '',
          deliveryDateTime: [new Date(), new Date()],
          companyId: '',
          patientName: '',
          trackingNumber: '',
          phone: '',
          deliveryStatus: ''
        },
        listQuery: {
          id: '',
          deliveryDateTime: [new Date(), new Date()],
          companyId: '',
          patientName: '',
          trackingNumber: '',
          phone: '',
          company: '',
          deliveryStatus: '',
          pageSize: 10,
          pageNum: 1
        }
      }
    },
    created() {
      this.getDoctorList()
      this.getDepartmentInfos()
    },
    methods: {
      getDepartmentInfos() {
        const _this = this
        getDepartment().then(res => {
          if (res.code === 200) {
            _this.departmentList = res.result
          }
        })
      },
      getDoctorList() {
        const _this = this
        getAllDoctorList().then(res => {
          if (res.code === 200) {
            _this.workPeopleList = res.result
          }
        })
      },
      fetchData() {
        this.listLoading = true
        getListPage(this.listQuery).then(res => {
          this.tableData = res.result.list
          this.total = res.result.total
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.fetchData()
      },
      save() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      viewDetail(row) {
        this.ruleForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.id = row.id
        this.ruleForm.deliveryDateTime = row.deliveryDateTime
        this.ruleForm.companyId = row.companyId
        this.ruleForm.patientName = row.patientName
        this.ruleForm.trackingNumber = row.trackingNumber
        this.ruleForm.phone = row.phone
        this.ruleForm.deliveryStatus = row.deliveryStatus
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      searchFilter() {
        this.listQuery.pageNum = 1
        // this.fetchData()
      }
    }
  }
</script>
