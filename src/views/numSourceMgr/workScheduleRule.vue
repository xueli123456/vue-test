<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="科室" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="请选择科室" @change="getSourcePoolList('listQuery')">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排班日期" prop="classesDateRange">
          <el-date-picker
            v-model="classesDateRange"
            type="daterange"
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
        <el-form-item label="号源池" prop="sourcePool">
          <el-select v-model="listQuery.sourcePool" filterable clearable placeholder="请选择所属号源">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="号段" prop="sectionNumber">
          <el-select v-model="listQuery.sectionNumber" filterable clearable placeholder="请选择预约时段">
            <el-option
              v-for="item in txOfficeTimeList1"
              :key="item.id"
              :label="item.sectionNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="newAdd">新增</el-button>
          <el-button class="filter-item" type="primary" @click="batchAdd">批量新增</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
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
        <el-table-column label="检查科室" min-width="150" align="center" prop="departmentName">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次编码" min-width="150" align="center" prop="classesCode">
          <template slot-scope="scope">
            <span>{{ scope.row.classesCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次日期" min-width="100" align="center" prop="classesDate">
          <template slot-scope="scope">
            <span>{{ scope.row.classesDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次星期" align="center" min-width="100" prop="classesWeek">
          <template slot-scope="scope">
            <span>{{ scope.row.classesWeek }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次时间段" align="center" min-width="200" prop="classesBegin">
          <template slot-scope="scope">
            <span>{{ scope.row.classesBegin }}-{{ scope.row.classesEnd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="占用号源池" align="center" min-width="200" prop="sourcePoolName">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcePoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="占用号源数量" align="center" min-width="100" prop="sourceCount">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已使用数量" align="center" min-width="100" prop="useCount">
          <template slot-scope="scope">
            <span>{{ scope.row.useCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未使用数量" align="center" min-width="100" prop="unUseCount">
          <template slot-scope="scope">
            <span>{{ scope.row.unUseCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" min-width="200" prop="updateDate">
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
    <el-dialog title="新增" :visible.sync="newAddDialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="80px">
          <el-form-item label="检查科室" prop="department">
            <el-select v-model="ruleForm.department" filterable clearable placeholder="请选择科室" @change="getSourcePoolList('ruleForm')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班次编码" prop="classesCode">
            <el-input v-model="ruleForm.classesCode" placeholder="班次编码" readonly />
          </el-form-item>
          <el-form-item label="班次日期" prop="classesDate">
            <el-date-picker
              v-model="ruleForm.classesDate"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="班次日期"
            />
          </el-form-item>
          <el-form-item label="班次号段" prop="sectionNumber">
            <el-select v-model="ruleForm.sectionNumber" filterable clearable placeholder="请选择号段">
              <el-option
                v-for="item in txOfficeTimeList"
                :key="item.id"
                :label="item.sectionNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源池" prop="sourcePool">
            <el-select v-model="ruleForm.sourcePool" filterable clearable placeholder="请选择所属号源池" @change="getUnUseCount('ruleForm')">
              <el-option
                v-for="item in sourcePoolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否限制" prop="isRestrict">
            <el-select v-model="ruleForm.isRestrict" filterable placeholder="是否限制放号">
              <el-option
                v-for="item in restrictList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源数量" prop="sourceCount">
            <el-input-number v-model="ruleForm.sourceCount" controls-position="right" :min="0" :max="unUseCount" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-select v-model="ruleForm.isEnabled" filterable placeholder="是否启用">
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
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
    <el-dialog title="批量新增" :visible.sync="batchAddDialogFormVisible" @close="resetForm('ruleForm1')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm1" :rules="rules1" :model="ruleForm1" label-position="left" label-width="80px">
          <el-form-item label="班次日期" prop="classesDateArray">
            <el-date-picker
              v-model="ruleForm1.classesDateArray"
              type="dates"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="班次日期"
            />
          </el-form-item>
          <el-form-item label="检查科室" prop="department">
            <el-select v-model="ruleForm1.department" filterable clearable placeholder="请选择科室" @change="getSourcePoolList('ruleForm1')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源池" prop="sourcePool">
            <el-select v-model="ruleForm1.sourcePool" filterable clearable placeholder="请选择所属号源池">
              <el-option
                v-for="item in sourcePoolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-table v-loading.body="listLoading" :data="ruleForm1.tableData1" stripe highlight-current-row element-loading-text="Loading" :row-style="rowStyle" border tooltip-effect="dark">
            <el-table-column align="center" width="80" label="序号">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="号段" align="center" prop="sectionNumber">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime }}~{{ scope.row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="号源数量" align="center">
              <template slot-scope="scope">
                <el-form-item style="margin-bottom: 0px;" :prop="'tableData1.' + scope.$index + '.sourceCount'" :rules="rules1.sourceCount">
                  <el-input-number v-model="scope.row.sourceCount" size="mini" controls-position="right" :min="0" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm1')">返回</el-button>
        <el-button type="primary" @click="batchSave('ruleForm1')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" @close="resetForm('ruleForm3')">
      <div class="dialog_auto_increase">
        <el-form ref="ruleForm3" :rules="rules" :model="ruleForm3" label-position="left" label-width="80px">
          <el-form-item label="检查科室" prop="department">
            <el-select v-model="ruleForm3.department" disabled placeholder="请选择科室" @change="getSourcePoolList('ruleForm3')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班次编码" prop="classesCode">
            <el-input v-model="ruleForm3.classesCode" placeholder="班次编码" disabled />
          </el-form-item>
          <el-form-item label="班次日期" prop="classesDate">
            <el-date-picker
              v-model="ruleForm3.classesDate"
              :clearable="false"
              disabled
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="班次日期"
            />
          </el-form-item>
          <el-form-item label="班次号段" prop="sectionNumber">
            <el-select v-model="ruleForm3.sectionNumber" disabled placeholder="请选择号段">
              <el-option
                v-for="item in txOfficeTimeList3"
                :key="item.id"
                :label="item.sectionNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源池" prop="sourcePool">
            <el-select v-model="ruleForm3.sourcePool" disabled placeholder="请选择所属号源池">
              <el-option
                v-for="item in sourcePoolList3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否限制" prop="isRestrict">
            <el-select v-model="ruleForm3.isRestrict" filterable placeholder="是否限制放号">
              <el-option
                v-for="item in restrictList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源数量" prop="sourceCount">
            <el-input-number v-model="ruleForm3.sourceCount" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-select v-model="ruleForm3.isEnabled" filterable placeholder="是否启用">
              <el-option
                v-for="item in statusList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="ruleForm3.remarks"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="255"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm3')">返回</el-button>
        <el-button type="primary" @click="update('ruleForm3')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartment, getOfficeTimeList, getSourcePoolList, getUnUseCount, listPage, deleteWorkScheduleRule, saveWorkScheduleRule, batchSaveWorkScheduleRule, updateWorkScheduleRule } from '@/api/workSchedule'
import waves from '@/directive/waves' // 水波纹指令
import { formatDate } from '@/utils/dateutils'
export default {
  directives: {
    waves
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
      txOfficeTimeList: [],
      departmentList: [],
      sourcePoolList: [],
      txOfficeTimeList1: [],
      txOfficeTimeList3: [],
      sourcePoolList3: [],
      dialogFormVisible: false,
      newAddDialogFormVisible: false,
      batchAddDialogFormVisible: false,
      listLoading: true,
      total: 0,
      unUseCount: 0,
      classesDateRange: [new Date(), new Date()],
      ruleForm: {
        department: '',
        classesDate: new Date(),
        classesCode: (new Date()).getTime(),
        sourcePool: '',
        sectionNumber: '',
        isEnabled: '1',
        isRestrict: '1',
        sourceCount: 0,
        remarks: ''
      },
      ruleForm1: {
        department: '',
        classesDateArray: [],
        sourcePool: '',
        sectionNumberList: [],
        tableData1: []
      },
      ruleForm2: {
        department: '',
        classesDateArray: [],
        sourcePool: '',
        sectionNumberList: []
      },
      ruleForm3: {
        id: '',
        department: '',
        classesDate: '',
        classesCode: '',
        sourcePool: '',
        sectionNumber: '',
        isEnabled: '0',
        isRestrict: '0',
        sourceCount: 0,
        remarks: ''
      },
      listQuery: {
        officeId: '',
        classesDate: new Date(),
        sourcePool: '',
        pageNum: 1,
        pageSize: 20
      },
      ruleFormParam: {
        department: '',
        classesDate: new Date(),
        sourcePool: ''
      },
      tableData: [],
      restrictList: [
        {
          key: '0',
          value: '限制'
        },
        {
          key: '1',
          value: '不限制'
        }
      ],
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
        department: [{ required: true, message: '科室不能为空', trigger: 'blur' }],
        classesCode: [{ required: true, message: '排班编码不能为空', trigger: 'blur' }],
        classesDate: [{ required: true, message: '排班日期不能为空', trigger: 'blur' }],
        sectionNumber: [{ required: true, message: '号段不能为空', trigger: 'blur' }],
        sourcePool: [{ required: true, message: '号源池不能为空', trigger: 'blur' }],
        sourceCount: [{ required: true, message: '号源数量不能为空', trigger: 'blur' }]
      },
      rules1: {
        department: [{ required: true, message: '科室不能为空', trigger: 'blur' }],
        sourcePool: [{ required: true, message: '号源池不能为空', trigger: 'blur' }],
        sourceCount: [{ required: true, message: '号源数量不能为空', trigger: 'blur' }],
        classesDateArray: [{ required: true, message: '日期不能为空', trigger: 'blur' }]
      },
      rules2: {
        sourceCount: [{ required: true, message: '号源数量不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
    this.getDepartmentInfos()
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      console.log(rowIndex) // 表头行标号为0
      return ''
    },
    clearDepartment() {
      const _this = this
      _this.listQuery.medicalTypeId = ''
    },
    getDepartmentInfos() {
      getDepartment().then(res => {
        if (res.code === 200) {
          this.departmentList = res.result
        }
      })
    },
    getSourcePoolList(formName) {
      const _this = this
      if (formName === 'listQuery') {
        _this.listQuery.sourcePool = ''
        if (_this.listQuery.officeId !== '') {
          getSourcePoolList(_this.listQuery.officeId).then(res => {
            if (res.code === 200) {
              _this.sourcePoolList = res.result
            }
          })
          getOfficeTimeList(_this.listQuery.officeId).then(res => {
            if (res.code === 200) {
              _this.txOfficeTimeList1 = res.result
            }
          })
        } else {
          _this.sourcePoolList = []
          _this.txOfficeTimeList1 = []
        }
      } else if (formName === 'ruleForm') {
        _this.ruleForm.sourcePool = ''
        _this.ruleForm.sectionNumber = ''
        if (_this.ruleForm.department !== '') {
          getSourcePoolList(_this.ruleForm.department).then(res => {
            if (res.code === 200) {
              _this.sourcePoolList = res.result
            }
          })
          _this.getOfficeTimeList()
        } else {
          _this.sourcePoolList = []
          _this.txOfficeTimeList = []
        }
      } else if (formName === 'ruleForm1') {
        _this.ruleForm1.sourcePool = ''
        if (_this.ruleForm1.department !== '') {
          getSourcePoolList(_this.ruleForm1.department).then(res => {
            if (res.code === 200) {
              _this.sourcePoolList = res.result
            }
          })
          getOfficeTimeList(_this.ruleForm1.department).then(res => {
            if (res.code === 200) {
              _this.ruleForm1.tableData1 = res.result
            }
          })
        } else {
          _this.sourcePoolList = []
          _this.ruleForm1.tableData1 = []
        }
      }
    },
    getUnUseCount(formName) {
      const _this = this
      if (formName === 'ruleForm') {
        _this.ruleFormParam.department = _this.ruleForm.department
        _this.ruleFormParam.classesDate = _this.ruleForm.classesDate
        _this.ruleFormParam.sourcePool = _this.ruleForm.sourcePool
      } else if (formName === 'ruleForm1') {
        _this.ruleFormParam.department = _this.ruleForm1.department
        _this.ruleFormParam.classesDate = _this.ruleForm1.classesDate
        _this.ruleFormParam.sourcePool = _this.ruleForm1.sourcePool
      }
      getUnUseCount(_this.ruleFormParam).then(res => {
        if (res.code === 200) {
          _this.unUseCount = res.result
        }
      })
    },
    getOfficeTimeList() {
      const _this = this
      getOfficeTimeList(_this.ruleForm.department).then(res => {
        if (res.code === 200) {
          _this.txOfficeTimeList = res.result
        }
      })
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
      _this.listQuery.startDateTime = formatDate( _this.classesDateRange[0] ,'yyyy-MM-dd')
      _this.listQuery.endDateTime = formatDate( _this.classesDateRange[1] ,'yyyy-MM-dd')
      listPage(_this.listQuery).then(res => {
        if (res.code === 200) {
          _this.tableData = res.result.list
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
      _this.classesDateRange = [new Date(), new Date()]
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.dialogFormVisible = false
      _this.newAddDialogFormVisible = false
      _this.batchAddDialogFormVisible = false
      _this.ruleForm1.tableData1 = []
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
      _this.ruleForm3.id = row.id
      _this.ruleForm3.department = row.department
      _this.ruleForm3.sourcePool = row.sourcePool
      _this.ruleForm3.classesDate = row.classesDate
      _this.ruleForm3.classesCode = row.classesCode
      _this.ruleForm3.sectionNumber = row.sectionNumber
      _this.ruleForm3.remarks = row.remarks
      _this.ruleForm3.sourceCount = row.sourceCount
      _this.ruleForm3.isRestrict = row.isRestrict
      _this.ruleForm3.isEnabled = row.isEnabled
      getSourcePoolList(_this.ruleForm3.department).then(res => {
        if (res.code === 200) {
          _this.sourcePoolList3 = res.result
        }
      })
      getOfficeTimeList(_this.ruleForm3.department).then(res => {
        if (res.code === 200) {
          _this.txOfficeTimeList3 = res.result
        }
      })
    },
    deleteSchedule(row) {
      const _this = this
      _this.$confirm('确认要删除此条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.listLoading = true
        deleteWorkScheduleRule(row.id).then(res => {
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
    newAdd() {
      const _this = this
      _this.newAddDialogFormVisible = true
    },
    batchAdd() {
      const _this = this
      _this.batchAddDialogFormVisible = true
    },
    save(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          saveWorkScheduleRule(_this.ruleForm).then(res => {
            if (res.code === 200) {
              _this.listLoading = false
              _this.newAddDialogFormVisible = false
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
    batchSave(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.ruleForm1.sectionNumberList = []
          _this.ruleForm1.tableData1.forEach(item => {
            const obj = {}
            obj.sectionNumber = item.id
            obj.sourceCount = item.sourceCount
            obj.startTime = item.startTime
            obj.endTime = item.endTime
            _this.ruleForm1.sectionNumberList.push(obj)
          })
          _this.ruleForm2.department = _this.ruleForm1.department
          _this.ruleForm2.classesDateArray = _this.ruleForm1.classesDateArray
          _this.ruleForm2.sourcePool = _this.ruleForm1.sourcePool
          _this.ruleForm2.sectionNumberList = _this.ruleForm1.sectionNumberList
          batchSaveWorkScheduleRule(_this.ruleForm2).then(res => {
            if (res.code === 200) {
              _this.batchAddDialogFormVisible = false
              _this.listLoading = false
              _this.fetchData()
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '批量保存成功!',
                duration: 1000
              })
            } else {
              _this.listLoading = false
            }
          })
        }
      })
    },
    update(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          updateWorkScheduleRule(_this.ruleForm3).then(res => {
            if (res.code === 200) {
              _this.dialogFormVisible = false
              _this.listLoading = false
              _this.fetchData()
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '更新成功!',
                duration: 1000
              })
            } else {
              _this.listLoading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
