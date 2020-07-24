<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="officeId">
          <el-select v-model="listQuery.scheduleType" filterable clearable placeholder="班次类型" @change="getSourcePoolList('listQuery')">
            <el-option label="请选择" value="" />
            <el-option
              v-for="item in scheduleTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班次名称" prop="classesDateRange">
          <el-input v-model="listQuery.scheduleName" style="width: 200px;" class="filter-item" placeholder="班次名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="newAdd">新增</el-button>
        <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>

      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" @current-change="handleSelectionChange">
        <!--        <el-table-column label="" width="55">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-radio v-model="checked" :label="scope.row.id">&nbsp;</el-radio>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" round size="mini" @click="deleteSchedule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="班次编码" min-width="150" align="center" prop="scheduleCode">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次名称" min-width="150" align="center" prop="scheduleName">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次类型" min-width="100" align="center" prop="scheduleType">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleTypeDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="100" prop="classesWeek">
          <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" min-width="120" prop="updateDate">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" min-width="100" prop="updater">
          <template slot-scope="scope">
            <span>{{ scope.row.updater }}</span>
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

    <div class="table-container detailTable">
      <el-button style="margin-bottom: 10px;" type="primary" @click="addDetail">新增</el-button>
      <el-table v-loading.body="listDetailLoading" :data="tableDetailData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="modifyScheduleDetail(scope.row)">编辑</el-button>
            <el-button type="danger" round size="mini" @click="deleteScheduleDetail(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="班次编码" min-width="150" align="center" prop="scheduleCode">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次明细编码" min-width="150" align="center" prop="scheduleName">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleDetailCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次时段开始时间" min-width="120" align="center" prop="scheduleType">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次时段结束时间" align="center" min-width="120" prop="classesWeek">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对应排队号" align="center" min-width="100" prop="classesWeek">
          <template slot-scope="scope">
            <span>{{ scope.row.letter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" min-width="120" prop="updateDate">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" min-width="100" prop="updater">
          <template slot-scope="scope">
            <span>{{ scope.row.updater }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listDetailLoading" class="pagination-container">
        <el-pagination
          background
          :current-page.sync="listDetailQuery.pageNum"
          :page-sizes="[10,20,30, 50]"
          :page-size="listDetailQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailTotal"
          @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange"
        />
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="80px">
          <el-form-item label="班次编码" prop="scheduleCode">
            <el-input v-model="ruleForm.scheduleCode" placeholder="班次编码" readonly />
          </el-form-item>
          <el-form-item label="班次名称" prop="scheduleName">
            <el-input v-model="ruleForm.scheduleName" placeholder="班次名称" />
          </el-form-item>
          <el-form-item label="班次类型" prop="scheduleType">
            <el-select v-model="ruleForm.scheduleType" filterable clearable placeholder="班次类型">
              <el-option label="请选择" value="" />
              <el-option
                v-for="item in scheduleTypeList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="ruleForm.remarks"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="255"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">返回</el-button>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="detailDialogFormVisible" @close="resetDetailForm('ruleDetailForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleDetailForm" :rules="rules2" :model="ruleDetailForm" label-position="left" label-width="140px">
          <el-form-item label="班次明细编码" prop="scheduleDetailCode">
            <el-input v-model="ruleDetailForm.scheduleDetailCode" readonly disabled />
          </el-form-item>
          <el-form-item label="班次编码" prop="scheduleCode">
            <el-input v-model="ruleDetailForm.scheduleCode" readonly disabled />
          </el-form-item>
          <el-form-item label="班次名称" prop="scheduleName">
            <el-input v-model="ruleDetailForm.scheduleName" readonly disabled />
          </el-form-item>
          <el-form-item label="班次明细开始时间" prop="startTime">
            <template>
              <el-time-select
                v-model="ruleDetailForm.startTime"
                :picker-options="startTimePickerOptions"
                @change="changeTime"
              />
            </template>
          </el-form-item>
          <el-form-item label="班次明细结束时间" prop="endTime">
            <el-time-select
              v-model="ruleDetailForm.endTime"
              :picker-options="endTimePickerOptions"
              is-range="true"
            />
          </el-form-item>
          <el-form-item label="对应排队号" prop="letter">
            <el-input v-model="ruleDetailForm.letter" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDetailForm('ruleDetailForm')">返回</el-button>
        <el-button type="primary" @click="saveDetail('ruleDetailForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import waves from '@/directive/waves' // 水波纹指令
export default {
  directives: {
    waves
  },
  data() {
    return {
      startTimePickerOptions: {
        start: '00:30',
        step: '00:15',
        end: '23:59'
      },
      endTimePickerOptions: {
        start: '08:30',
        step: '00:15',
        end: '18:30'
      },
      dialogFormVisible: false,
      detailDialogFormVisible: false,
      listLoading: false,
      listDetailLoading: false,
      total: 0,
      detailTotal: 0,
      unUseCount: 0,
      classesDateRange: [new Date(), new Date()],
      ruleForm: {
        scheduleCode: '',
        scheduleName: '',
        scheduleType: '',
        remarks: ''
      },
      ruleDetailForm: {
        id: '',
        scheduleDetailCode: '',
        scheduleId: '',
        scheduleCode: '',
        startTime: '',
        endTime: '',
        letter: ''
      },
      listQuery: {
        scheduleType: '',
        scheduleName: '',
        pageNum: 1,
        pageSize: 10
      },
      listDetailQuery: {
        pageNum: 1,
        pageSize: 10
      },
      checked: null,
      checkedData: null,
      tableData: [],
      tableDetailData: [],
      scheduleTypeList: [],
      statusList: [
        {
          key: '1',
          value: '启用'
        },
        {
          key: '0',
          value: '停用'
        }
      ],
      rules: {
        scheduleCode: [{ required: true, message: '班次编码不能为空', trigger: 'blur' }],
        scheduleName: [{ required: true, message: '班次名称不能为空', trigger: 'blur' }],
        scheduleType: [{ required: true, message: '请选择班次类型', trigger: 'blur' }]
      },
      rules2: {
        startTime: [{ required: true, message: '请选择班次时段开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择班次时段结束时间', trigger: 'blur' }],
        letter: [{ required: true, message: '请输入对应排队号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadScheduleList()
    this.fetchData()
  },
  methods: {
    changeTime() {
      this.resetEndTime(this.checkedData)
      this.ruleDetailForm.endTime = null
      this.endTimePickerOptions.minTime = this.ruleDetailForm.startTime
    },
    handleSelectionChange(row) {
      this.checkedData = row
      this.fetchDetailData(row.id)
      this.resetStartTime(row)
      this.resetEndTime(row)
    },
    resetStartTime(row) {
      if (row.scheduleType === '1') {
        this.startTimePickerOptions = {
          start: '00:00',
          step: '00:15',
          end: '23:59'
        }
      } else if (row.scheduleType === '2') {
        this.startTimePickerOptions = {
          start: '06:00',
          step: '00:15',
          end: '12:00'
        }
      } else if (row.scheduleType === '3') {
        this.startTimePickerOptions = {
          start: '12:00',
          step: '00:15',
          end: '18:00'
        }
      } else if (row.scheduleType === '4') {
        this.startTimePickerOptions = {
          start: '18:00',
          step: '00:15',
          end: '06:59'
        }
      }
    },
    resetEndTime(row) {
      if (row.scheduleType === '1') {
        this.endTimePickerOptions = {
          start: '00:00',
          step: '00:15',
          end: '23:59'
        }
      } else if (row.scheduleType === '2') {
        this.endTimePickerOptions = {
          start: '06:00',
          step: '00:15',
          end: '12:00'
        }
      } else if (row.scheduleType === '3') {
        this.endTimePickerOptions = {
          start: '12:00',
          step: '00:15',
          end: '18:00'
        }
      } else if (row.scheduleType === '4') {
        this.endTimePickerOptions = {
          start: '18:00',
          step: '00:15',
          end: '06:59'
        }
      }
    },
    rowStyle({ row, rowIndex }) {
      console.log(rowIndex) // 表头行标号为0
      return ''
    },
    loadScheduleList() {
      const _this = this
      this.$api.getDictList('103069742765371392').then(res => {
        res.result.forEach(n => {
          n.value = parseInt(n.dictValue)
        })
        _this.scheduleTypeList = res.result
      })
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
      this.$api.scheduleList(this.listQuery).then(res => {
        if (res.code === 200) {
          _this.tableData = res.result.list
          _this.total = res.result.total
          _this.listLoading = false
          if (res.result.list !== null && res.result.list.length > 0) {
            _this.fetchDetailData(res.result.list[0].id)
            _this.checkedData = res.result.list[0]
          }
        }
      })
    },
    fetchDetailData(scheduleId) {
      const _this = this
      _this.listDetailLoading = true
      this.$api.scheduleDetailList({ 'scheduleId': scheduleId }).then(res => {
        if (res.code === 200) {
          _this.tableDetailData = res.result.list
          _this.detailTotal = res.result.total
          _this.listDetailLoading = false
        }
      })
    },
    handleSizeChange(val) {
      const _this = this
      _this.listQuery.pageSize = val
      _this.fetchData()
    },
    handleDetailSizeChange(val) {
      const _this = this
      _this.listDetailQuery.pageSize = val
      _this.fetchDetailData(this.checkedData.id)
    },
    handleCurrentChange(val) {
      const _this = this
      _this.listQuery.pageNum = val
      _this.fetchData()
    },
    handleDetailCurrentChange(val) {
      const _this = this
      _this.listDetailQuery.pageNum = val
      _this.fetchDetailData(this.checkedData.id)
    },
    resetQueryForm(formName) {
      const _this = this
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.dialogFormVisible = false
      _this.$refs[formName].resetFields()
    },
    resetDetailForm(formName) {
      const _this = this
      _this.detailDialogFormVisible = false
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.listQuerypageNum = 1
      _this.fetchData()
    },
    modify(row) {
      const _this = this
      _this.dialogFormVisible = true
      _this.ruleForm.id = row.id
      _this.ruleForm.scheduleCode = row.scheduleCode
      _this.ruleForm.scheduleName = row.scheduleName
      _this.ruleForm.scheduleType = row.scheduleType
      _this.ruleForm.remarks = row.remarks
    },
    modifyScheduleDetail(row) {
      const _this = this
      _this.detailDialogFormVisible = true
      _this.ruleDetailForm.id = row.id
      _this.ruleDetailForm.scheduleCode = row.scheduleCode
      _this.ruleDetailForm.scheduleName = this.checkedData.scheduleName
      _this.ruleDetailForm.scheduleDetailCode = row.scheduleDetailCode
      _this.ruleDetailForm.startTime = row.startTime
      _this.ruleDetailForm.endTime = row.endTime
      _this.ruleDetailForm.letter = row.letter
    },
    deleteSchedule(row) {
      const _this = this
      _this.$confirm('确认要删除此条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.listLoading = true
        this.$api.scheduleDelete(row.id).then(res => {
          if (res.code === 200) {
            _this.listLoading = false
            _this.fetchData()
            _this.$notify({
              showClose: true,
              type: 'success',
              message: '删除成功!',
              duration: 1000
            })
          } else {
            _this.listLoading = false
          }
        })
      }).catch(() => {
        _this.$notify({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteScheduleDetail(row) {
      const _this = this
      _this.$confirm('确认要删除此条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.listDetailLoading = true
        this.$api.scheduleDetailDelete(row.id).then(res => {
          if (res.code === 200) {
            _this.listDetailLoading = false
            _this.fetchDetailData(this.checkedData.id)
            _this.$notify({
              showClose: true,
              type: 'success',
              message: '删除成功!',
              duration: 1000
            })
          } else {
            _this.listDetailLoading = false
          }
        })
      }).catch(() => {
        _this.$notify({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    newAdd() {
      const _this = this
      this.dialogFormVisible = true
      this.$api.genShortNumStr().then(res => {
        _this.ruleForm.scheduleCode = res.result
      })
    },
    addDetail() {
      const _this = this
      if (this.checkedData == null) {
        _this.$notify({
          showClose: true,
          type: 'error',
          message: '请选择班次!',
          duration: 1000
        })
        return
      }
      this.detailDialogFormVisible = true
      this.ruleDetailForm.id = ''
      this.ruleDetailForm.scheduleId = this.checkedData.id
      this.ruleDetailForm.scheduleCode = this.checkedData.scheduleCode
      this.ruleDetailForm.scheduleName = this.checkedData.scheduleName
      this.ruleDetailForm.startTime = ''
      this.ruleDetailForm.endTime = ''
      this.ruleDetailForm.letter = ''
      this.$api.genShortNumStr8().then(res => {
        _this.ruleDetailForm.scheduleDetailCode = res.result
      })
    },
    save(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.scheduleSave(_this.ruleForm).then(res => {
            if (res.code === 200) {
              _this.listLoading = false
              _this.dialogFormVisible = false
              _this.fetchData()
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '保存成功!',
                duration: 1000
              })
            } else {
              _this.listLoading = false
            }
          })
        }
      })
    },
    saveDetail(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.scheduleDetailSave(_this.ruleDetailForm).then(res => {
            if (res.code === 200) {
              _this.listDetailLoading = false
              _this.detailDialogFormVisible = false
              _this.fetchDetailData(this.checkedData.id)
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '保存成功!',
                duration: 1000
              })
            } else {
              _this.listDetailLoading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .table-container.detailTable{
    margin-top:50px;
  }
  thead {

  }
</style>
