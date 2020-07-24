<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="listQuery.taskType" filterable clearable placeholder="请选择任务类型">
            <el-option
              v-for="item in taskTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="taskStatus">
          <el-select v-model="listQuery.taskStatus" filterable clearable placeholder="请选择任务状态" class="mc-input-col3">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务流水号" prop="sequenceNum">
          <el-input v-model="listQuery.sequenceNum" class="filter-item" clearable placeholder="任务流水号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="业务关联单号" prop="refNo">
          <el-input v-model="listQuery.refNo" class="filter-item" clearable placeholder="业务关联单号" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="模糊查询JSON" prop="taskData">
          <el-input v-model="listQuery.taskData" class="filter-item" clearable placeholder="模糊查询JSON数据" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="排班日期" prop="classesDateRange">
          <el-date-picker
            v-model="classesDateRange"
            type="datetimerange"
            align="right"
            unlink-panels
            :editable="false"
            :clearable="false"
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
      <el-table-column align="center" width="160" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="view(scope.row)">查看</el-button>
          <el-button v-if="scope.row.taskStatus !== 3" type="primary" round size="mini" @click="retryWorker(scope.row)">重试</el-button>
        </template>
      </el-table-column>
      <el-table-column label="序列号" min-width="100" align="center" prop="sequenceNum">
        <template slot-scope="scope">
          <span>{{ scope.row.sequenceNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联业务ID" min-width="100" align="center" prop="refNo">
        <template slot-scope="scope">
          <span>{{ scope.row.refNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" min-width="100" align="center" prop="taskTypeName">
        <template slot-scope="scope">
          <span>{{ scope.row.taskTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" min-width="100" prop="taskStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.taskStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行次数" align="center" min-width="100" prop="taskExeCount">
        <template slot-scope="scope">
          <span>{{ scope.row.taskExeCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败原因" align="center" min-width="100" prop="remarks">
        <template slot-scope="scope">
          <i v-if="scope.row.taskStatus === 4" class="el-icon-error" style="color: red"/>
          <span v-if="scope.row.taskStatus === 4">{{ scope.row.remarks }}</span>
          <i v-if="scope.row.taskStatus === 3" class="el-icon-success" style="color: green"/>
          <span v-if="scope.row.taskStatus === 3">成功</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable align="center" min-width="100" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" sortable align="center" min-width="100" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
    <el-dialog title="查看任务内容" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="80px">
          <json-editor ref="jsonEditor" v-model="taskData" />
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getListPage, retryWorker, getTaskTypeList } from '@/api/workerMng'
  import { formatDate } from '@/utils/dateutils'
  import JsonEditor from '@/components/JsonEditor'
  export default {
    name: 'JsonEditorDemo',
    components: { JsonEditor },
    filters: {
      emptyFilter(time) {
        return time !== '' ? time : ''
      },
      statusFilter(val) {
        let status = ''
        switch (val) {
          case 1: {
            status = '待执行'
            break
          }
          case 2: {
            status = '处理中'
            break
          }
          case 3: {
            status = '执行成功'
            break
          }
          case 4: {
            status = '执行失败'
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
        classesDateRange: [new Date(new Date().getTime() - 24*60*60*1000), new Date()],
        dialogFormVisible: false,
        listLoading: true,
        total: 0,
        taskData: '',
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          taskType: '',
          taskStatus: '',
          sequenceNum: '',
          refNo: '',
          taskData: ''
        },
        ruleForm: {},
        tableData: [],
        taskTypeList: [],
        statusList: [
          {
            key: 1,
            value: '待执行'
          },
          {
            key: 2,
            value: '处理中'
          },
          {
            key: 3,
            value: '执行成功'
          },
          {
            key: 4,
            value: '执行失败'
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
      this.getTaskTypeList()
    },
    methods: {
      retryWorker(row) {
        const _this = this
        retryWorker(row.id).then(res => {
          if (res.code === 200) {
            _this.fetchData()
            _this.$notify({
              type: 'success',
              message: '任务重试成功!'
            })
          }
        })
      },
      getTaskTypeList() {
        const _this = this
        getTaskTypeList('112503754919440384').then(res => {
          console.log(res)
          _this.taskTypeList = res.result
        })
      },
      fetchData() {
        this.listLoading = true
        this.listQuery.createTime = formatDate(this.classesDateRange[0] ,'yyyy-MM-dd HH:mm:ss')
        this.listQuery.updateTime = formatDate(this.classesDateRange[1] ,'yyyy-MM-dd HH:mm:ss')
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
        _this.$refs[formName].resetFields()
        _this.classesDateRange = [new Date(new Date().getTime() - 24*60*60*1000), new Date()]
        _this.fetchData()
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
      },
      view(row) {
        const _this = this
        _this.taskData = JSON.parse(row.taskData)
        _this.dialogFormVisible = true
      }
    }
  }
</script>

<style scoped>
</style>
