<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="科室" prop="officeId">
          <el-select v-model="listQuery.officeId" filterable clearable placeholder="科室" @change="getSourcePoolList('listQuery')">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="号源池" prop="sourcePool">
          <el-select v-model="listQuery.sourcePool" filterable clearable placeholder="号源池">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="scheduleId">
          <el-select v-model="listQuery.scheduleId" filterable clearable placeholder="班次">
            <el-option
              v-for="item in scheduleList"
              :key="item.id"
              :label="item.scheduleName"
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
        <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="newAdd">新增</el-button>
        <el-button class="filter-item" type="primary" @click="batchAdd">批量新增</el-button>
        <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
      </el-form>
    </div>
    <div class="table-container">
      <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark" @current-change="handleSelectionChange">
        <el-table-column align="center" min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="modify(scope.row)">编辑</el-button>
            <el-button type="danger" round size="mini" @click="deleteSchedule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="排班编码" min-width="150" align="center" prop="schedulePlanCode">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcePlanCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排班日期" min-width="150" align="center" prop="schedulePlanCode">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="号源科室" min-width="150" align="center" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.officeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="号源池" min-width="150" align="center" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcePoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次名称" min-width="150" align="center" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约渠道" min-width="100" align="center" prop="reservationChannel">
          <template slot-scope="scope">
            <span>{{ scope.row.reservationChannel | channelFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排班数量/号源数" min-width="150" align="center" prop="sourcePoolId">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceNumber }}/{{ scope.row.sourceNumberTotal }}</span>
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

    <div class="table-container" style="margin-top:50px;">
      <el-table v-loading.body="listDetailLoading" :data="tableDetailData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
        <el-table-column align="center" fixed min-width="100" label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="号源科室" min-width="150" align="center" prop="officeName">
          <template slot-scope="scope">
            <span>{{ scope.row.officeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="号源池" min-width="150" align="center" prop="sourcePoolName">
          <template slot-scope="scope">
            <span>{{ scope.row.sourcePoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次名称" min-width="150" align="center" prop="scheduleName">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次时段开始时间" min-width="100" align="center" prop="startTime">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班次时段结束时间" min-width="100" align="center" prop="endTime">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排班数量/号源占比" min-width="150" align="center" prop="sourceNumber">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceNumber }}/{{ scope.row.proportion }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="已使用号源数量" min-width="100" align="center" prop="usedSourceNumber">
          <template slot-scope="scope">
            <span>{{ scope.row.usedSourceNumber }}</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog title="新增" :visible.sync="newAddDialogFormVisible" @close="resetForm('formData')">
      <div class="dialog_auto_increase" style="height:400px;overflow: auto">
        <el-form ref="formData" :rules="rules" :model="formData" label-position="left" label-width="80px">
          <el-form-item label="排班编码" prop="sourcePlanCode" style="width:300px;">
            <el-input v-model="formData.sourcePlanCode" placeholder="排班编码" readonly />
          </el-form-item>
          <el-form-item label="排班日期" prop="scheduleDate">
            <el-date-picker
              v-model="formData.scheduleDate"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="cleanData()"
            />
          </el-form-item>
          <el-form-item label="排班科室" prop="officeId">
            <el-select v-model="formData.officeId" filterable clearable placeholder="请选择科室" @change="getSourcePoolList('formData')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源池" prop="sourcePoolId">
            <el-select v-model="formData.sourcePoolId" filterable clearable placeholder="请选择所属号源池" @change="getSourceNumber">
              <el-option
                v-for="item in sourcePoolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排班班次" prop="scheduleId">
            <el-select v-model="formData.scheduleId" filterable clearable @change="scheduleDetailListByScheduleId('formData')">
              <el-option
                v-for="item in scheduleList"
                :key="item.id"
                :label="item.scheduleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-table :data="formData.sourcePlanDetail" stripe highlight-current-row border tooltip-effect="dark">
              <el-table-column align="center" min-width="80" label="序号">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="排班时段" min-width="100" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime }}-{{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="排班数量" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-form-item style="margin-bottom: 0px;" :prop="'sourcePlanDetail.' + scope.$index + '.sourceNumber'" :rules="rules.sourceNumber">
                    <el-input-number v-model="scope.row.sourceNumber" size="mini" controls-position="right" :min="0" @change="checkTotalSourceNum"/>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="号源数量" prop="sourceNumber">
            <el-row>
              <el-col :span="12">
                <el-input v-model="formData.sourceNumber" controls-position="right" readonly />
              </el-col>
              <el-col :span="12">
                <span style="margin-left:20px;">/&nbsp;&nbsp;{{ sourceNumberTotal }}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" style="width:500px;">
            <el-input
              v-model.trim="formData.remarks"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="255"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('formData')">返回</el-button>
        <el-button type="primary" @click="save('formData')">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateAddDialogFormVisible" @close="resetForm('ruleForm')">
      <div class="dialog_auto_increase" style="height:400px;overflow: auto">
        <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="80px">
          <el-form-item label="排班编码" prop="sourcePlanCode" style="width:300px;">
            <el-input v-model="ruleForm.sourcePlanCode" placeholder="排班编码"  disabled  />
          </el-form-item>
          <el-form-item label="排班日期" prop="scheduleDate">
            <el-date-picker
              v-model="ruleForm.scheduleDate"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
              @change="cleanData()"
            />
          </el-form-item>
          <el-form-item label="排班科室" prop="officeId">
            <el-select v-model="ruleForm.officeId" filterable clearable placeholder="请选择科室" disabled @change="getSourcePoolList('ruleForm')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="号源池" prop="sourcePoolId">
            <el-select v-model="ruleForm.sourcePoolId" filterable clearable placeholder="请选择所属号源池" disabled @change="getSourceNumber">
              <el-option
                v-for="item in sourcePoolList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排班班次" prop="scheduleId">
            <el-select v-model="ruleForm.scheduleId" filterable clearable disabled @change="scheduleDetailListByScheduleId('ruleForm')">
              <el-option
                v-for="item in scheduleList"
                :key="item.id"
                :label="item.scheduleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-table :data="ruleForm.sourcePlanDetail" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
              <el-table-column align="center" min-width="80" label="序号">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="排班时段" min-width="100" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime }}-{{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="号源数量" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'sourcePlanDetail.' + scope.$index + '.sourceNumber'" :rules="rules.sourceNumber">
                    <el-input-number v-model="scope.row.sourceNumber" size="mini" controls-position="right" :min="0"  @change="checkSourceNumTotal" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="号源数量" prop="sourceNumber">
            <el-row>
              <el-col :span="12"><el-input v-model="ruleForm.sourceNumber" controls-position="right" readonly disabled /></el-col>
              <el-col :span="12"><span style="margin-left:20px;">/&nbsp;&nbsp;{{ sourceNumberTotal }}</span></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" style="width:500px;">
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
        <el-button type="primary" @click="updateData('ruleForm')">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量新增" :visible.sync="batchAddDialogFormVisible" @close="resetForm('batchFormData')">
      <div class="dialog_auto_increase" style="height:600px;overflow: auto">
        <el-form ref="batchFormData" :rules="rules1" :model="batchFormData" label-position="left" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="科室" prop="officeId">
                <el-select v-model="batchFormData.officeId" filterable clearable placeholder="请选择科室" @change="getSourcePoolList('batchFormData')">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="号源池" prop="sourcePoolId">
                <el-select v-model="batchFormData.sourcePoolId" filterable clearable placeholder="请选择所属号源池" @change="getSourceNumber">
                  <el-option
                    v-for="item in sourcePoolList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="班次" prop="scheduleId">
                <el-select v-model="batchFormData.scheduleId" filterable clearable placeholder="请选择班次" @change="scheduleDetailListByScheduleId('batchFormData')">
                  <el-option
                    v-for="item in scheduleList"
                    :key="item.id"
                    :label="item.scheduleName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12">-->
<!--              <el-form-item label="假日" prop="selectRadio">-->
<!--                <el-radio-group v-model="selectRadio" @change="dateToggle">-->
<!--                  <el-radio label="1">工作日</el-radio>-->
<!--                  <el-radio label="2">节假日</el-radio>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-form-item label="日期" prop="scheduleDate">
            <calendar style="border: solid 1px" :zero="calendar5.zero" :disabled="calendar5.disabled" :lunar="calendar5.lunar" :value="calendar5.value" :multi="calendar5.multi" @select="calendar5.select" />
          </el-form-item>
          <el-form-item>
            <el-table :data="batchFormData.sourcePlanDetail" stripe highlight-current-row border tooltip-effect="dark">
              <el-table-column align="center" min-width="80" label="序号">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="排班时段" min-width="100" align="center">
                <template slot-scope="scope">
                  <span> {{ scope.row.startTime }}-{{ scope.row.endTime }} </span>
                </template>
              </el-table-column>
              <el-table-column label="排班数量" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'sourcePlanDetail.' + scope.$index + '.sourceNumber'" :rules="rules.sourceNumber">
                    <el-input-number v-model="scope.row.sourceNumber" size="mini" controls-position="right" :min="0" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('batchFormData')">返回</el-button>
        <el-button type="primary" @click="batchSave('batchFormData')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getDepartment, updateWorkScheduleRule } from '@/api/workSchedule'
import Calendar from '../../components/Calendar/calendar.vue'
import waves from '@/directive/waves' // 水波纹指令
import { formatDate } from '@/utils/dateutils'
export default {
  directives: {
    waves
  },
  components: {
    Calendar
  },
  data() {
    return {
      selectRadio: '1',
      // 多选
      calendar5: {
        display: '',
        multi: true,
        show: false,
        zero: true,
        value: [], // 默认日期
        disabled: [], // 默认日期
        lunar: true, // 显示农历
        select: (value) => {
          console.log('v' + value)
          var _this = this
          if (value.length > 0) {
            var v = value[value.length - 1]
            var d = v[0]
            d = v[1] < 10 ? d + '-0' + v[1] : d + '-' + v[1]
            d = v[2] < 10 ? d + '-0' + v[2] : d + '-' + v[2]
            var check = _this.checkDate(d)
            if (!check) {
              value.splice(value.length - 1, 1)
            }
          }
          _this.batchFormData.scheduleDateList = []
          const displayValue = []
          value.forEach(v => {
            displayValue.push(v[0] + '/' + (v[1]) + '/' + v[2])
            var d = v[0]
            d = v[1] < 10 ? d + '-0' + v[1] : d + '-' + v[1]
            d = v[2] < 10 ? d + '-0' + v[2] : d + '-' + v[2]
            _this.batchFormData.scheduleDateList.push(d)
          })
          console.log(displayValue)
          this.calendar5.display = displayValue.join(',')
          // this.calendar5.show=false;
          this.calendar5.value = value
        }
      },
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
      updateAddDialogFormVisible: false,
      disabled: false,
      departmentList: [],
      sourcePoolList: [],
      scheduleList: [],
      holidayList: [],
      dialogFormVisible: false,
      newAddDialogFormVisible: false,
      batchAddDialogFormVisible: false,
      listLoading: false,
      listDetailLoading: false,
      total: 0,
      detailTotal: 0,
      sourceNumberTotal: 0,
      checkedData: {},
      classesDateRange: [new Date(), new Date()],
      formData: {
        officeId: '',
        scheduleDate: new Date(),
        sourcePlanCode: '',
        sourcePoolId: '',
        sourcePoolName: '',
        sourceNumber: 0,
        scheduleId: '',
        sourcePlanDetail: [],
        sourceCount: 0,
        remarks: ''
      },
      ruleForm: {
        officeId: '',
        scheduleDate: new Date(),
        sourcePlanCode: '',
        sourcePoolId: '',
        sourcePoolName: '',
        sourceNumber: 0,
        scheduleId: '',
        sourcePlanDetail: [],
        sourceCount: 0,
        remarks: ''
      },
      batchFormData: {
        officeId: '',
        scheduleDate: new Date(),
        sourcePlanCode: '',
        sourcePoolId: '',
        sourceNumber: 0,
        scheduleId: '',
        sourcePlanDetail: [],
        sourceCount: 0,
        remarks: '',
        scheduleDateList: []
      },
      listQuery: {
        officeId: '',
        sourcePool: '',
        scheduleId: '',
        pageNum: 1,
        pageSize: 10
      },
      listDetailQuery: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      tableDetailData: [],
      rules: {
        scheduleDate: [{ required: true, message: '请选择排班日期', trigger: 'blur' }],
        officeId: [{ required: true, message: '请选择排班科室', trigger: 'blur' }],
        sourcePoolId: [{ required: true, message: '请选择号源池', trigger: 'blur' }],
        scheduleId: [{ required: true, message: '请选择班次', trigger: 'blur' }],
        sourceNumber: [{ required: true, message: '号源数量不能为空', trigger: 'blur' }],
      },
      rules1: {
        scheduleDateList: [{ required: true, message: '请选择排班日期', trigger: 'blur' }],
        officeId: [{ required: true, message: '请选择排班科室', trigger: 'blur' }],
        sourcePoolId: [{ required: true, message: '请选择号源池', trigger: 'blur' }],
        scheduleId: [{ required: true, message: '请选择班次', trigger: 'blur' }],
        sourceNumber: [{ required: true, message: '号源数量不能为空', trigger: 'blur' }],
      }
    }
  },
  filters: {
    channelFilter(val) {
      let status = ''
      switch (val) {
        case '-1': {
          status = '全部'
          break
        }
        case '0': {
          status = 'WEB'
          break
        }
        case '1': {
          status = '微信小程序'
          break
        }
        case '2': {
          status = '自助机'
          break
        }
      }
      return status
    }
  },
  created() {
    this.fetchData()
    this.getDepartmentInfos()
    this.loadScheduleList()
    // this.loadHolidayList()
  },
  methods: {
    dateToggle() {
      this.calendar5.display = ''
      // this.calendar5.show=false;
      this.calendar5.value = []
    },
    checkDate(d) {
      var _this = this
      // var tmp = this.holidayList.find(function(val) {
      //   if (val === d) { // 如果包含节假日则
      //     return true
      //   }
      // })
      var tmp = false
      this.holidayList.forEach(n => {
        if (n === d) {
          tmp = true
        }
      })
      // var tmp = this.holidayList.includes(d)
      if (_this.selectRadio === '1') {
        if (tmp) {
          _this.$notify({
            type: 'error',
            message: '当前选中的日期为节假日，请选择工作日'
          })
          return false
        }
      } else if (_this.selectRadio === '2') {
        if (!tmp) {
          _this.$notify({
            type: 'error',
            message: '当前选中的日期为工作日，请选择节假日'
          })
          return false
        }
      }
      return true
    },
    handleSelectionChange(row) {
      if(row != null) {
        this.checkedData = row
        this.fetchDetailData(row.id)
      }
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
      _this.sourcePoolList = []
      if (formName === 'listQuery') {
        _this.listQuery.sourcePool = ''

        if (_this.listQuery.officeId !== '') {
          _this.loadSourcePoolList(_this.listQuery.officeId)
        }
      } else if (formName === 'formData') {
        _this.formData.sourcePoolId = ''
        if (_this.formData.officeId !== '') {
          _this.querySourcePoolList(_this.formData)
        }
      } else if (formName === 'batchFormData') {
        if (_this.batchFormData.officeId !== '') {
          _this.loadSourcePoolList(_this.batchFormData.officeId)
        }
      }
    },
    getSourceNumber(id) {
      const _this = this
      if (id !== '' && id !== null) {
        const sourcePool = _this.sourcePoolList.find((item) => {
          return item.id === id
        })
        _this.sourceNumberTotal = sourcePool.count
      }
    },
    querySourcePoolList(param) {
      const _this = this
      this.$api.sourcePoolListByDeptAndDate(param).then(res => {
        if (res.code === 200) {
          _this.sourcePoolList = res.result
        }
      })
    },
    loadSourcePoolList(officeId) {
      const _this = this
      this.$api.sourcePoolListByDept(officeId).then(res => {
        if (res.code === 200) {
          _this.sourcePoolList = res.result
        }
      })
    },
    loadHolidayList() {
      const _this = this
      this.$api.loadHolidayAllList().then(res => {
        if (res.code === 200 && res.result !== null && res.result.length > 0) {
          res.result.forEach(todo => {
            _this.holidayList.push(todo.date)
          })
        }
      })
    },
    loadScheduleList() {
      const _this = this
      _this.$api.scheduleAllList().then(res => {
        if (res.code === 200) {
          _this.scheduleList = res.result
        }
      })
    },
    cleanData(){
      const _this = this
      _this.formData.officeId = ''
      _this.formData.sourcePoolId = ''
      _this.sourcePoolList = []
      _this.sourceNumberTotal = 0
    },
    scheduleDetailListByScheduleId(val) {
      const _this = this
      let scheduleId = ''
      if (val === 'formData') {
        scheduleId = _this.formData.scheduleId
      } else if (val === 'batchFormData') {
        scheduleId = _this.batchFormData.scheduleId
      }else if (val === 'ruleForm') {
        scheduleId = _this.ruleForm.scheduleId
      }
      _this.$api.scheduleDetailListByScheduleId({ 'scheduleId': scheduleId }).then(res => {
        if (res.code === 200) {
          if (res.result !== null && res.result.length > 0) {
            res.result.forEach(n => {
              n.sourceNumber = 0
            })
          }
          if (val === 'formData') {
            _this.formData.sourcePlanDetail = res.result
          } else if (val === 'batchFormData') {
            _this.batchFormData.sourcePlanDetail = res.result
          }else if (val === 'ruleForm') {
            _this.ruleForm.sourcePlanDetail = res.result
          }

        }
      })
    },
    fetchData() {
      const _this = this
      _this.listLoading = true
      _this.listQuery.startDateTime = formatDate( _this.classesDateRange[0] ,'yyyy-MM-dd')
      _this.listQuery.endDateTime = formatDate( _this.classesDateRange[1] ,'yyyy-MM-dd')
      _this.$api.sourcePlanList(_this.listQuery).then(res => {
        if (res.code === 200) {
          _this.tableData = res.result.list
          _this.total = res.result.total
          _this.listLoading = false
          if (res.result.list !== null && res.result.list.length > 0) {
            _this.fetchDetailData(res.result.list[0].id)
            _this.checkedData = res.result.list[0]
          }else{
            _this.tableDetailData =[]
          }
        }
      })
    },
    fetchDetailData(id) {
      const _this = this
      _this.listDetailLoading = true
      _this.$api.sourcePlanDetailList({ 'sourcePlanId': id }).then(res => {
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
    handleCurrentChange(val) {
      const _this = this
      _this.listQuery.pageNum = val
      _this.fetchData()
    },
    resetQueryForm(formName) {
      const _this = this
      _this.classesDateRange = [new Date(), new Date()]
      _this.$refs[formName].resetFields()
      _this.fetchData()
    },
    resetForm(formName) {
      const _this = this
      _this.updateAddDialogFormVisible = false
      _this.dialogFormVisible = false
      _this.newAddDialogFormVisible = false
      _this.batchAddDialogFormVisible = false
      _this.batchFormData.tableData1 = []
      _this.$refs[formName].resetFields()
    },
    searchFilter() {
      const _this = this
      _this.listQuerypageNum = 1
      _this.fetchData()
    },
    modify(row) {
      const _this = this
      _this.updateAddDialogFormVisible = true
      _this.sourceNumberTotal = row.sourceNumberTotal
      _this.ruleForm = Object.assign({}, row)
      if (row.officeId !== '') {
        const param = {};
        param.officeId = row.officeId
        param.scheduleDate = row.scheduleDate
        _this.$api.sourcePoolListByDeptAndDate(param).then(res => {
          if (res.code === 200) {
            _this.sourcePoolList = res.result

          }
        })
      }
    },
    updateData(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.ruleForm.sourceNumber > _this.sourceNumberTotal) {
            _this.$notify.warning('当天排班数量大于号源池设置的号源总数')
            return false
          }
          _this.listLoading = true
          _this.$api.modifySourcePlan(_this.ruleForm).then(res => {
            if (res.code === 200) {
              _this.updateAddDialogFormVisible = false
              _this.fetchData()
              _this.$notify({
                showClose: true,
                type: 'success',
                message: '修改成功!',
                duration: 1000
              })
            }
            _this.listLoading = false
          })
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
        this.$api.sourcePlanDelete(row.id).then(res => {
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
      _this.sourcePoolList = []
      _this.sourceNumberTotal = 0
      _this.formData.sourcePlanDetail = []
      _this.$api.genShortNumStr8().then(res => {
        _this.formData.sourcePlanCode = res.result
      })
    },
    batchAdd() {
      const _this = this
      _this.batchAddDialogFormVisible = true
      _this.calendar5.value = []
      _this.sourcePoolList = []
      _this.batchFormData.scheduleDateList = []
      _this.batchFormData.sourcePlanDetail = []
    },
    save(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.formData.sourcePlanDetail.length === 0) {
            _this.$notify.warning('班次不能为空')
            return
          }
          _this.$api.sourcePlanSave(_this.formData).then(res => {
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
          if (_this.batchFormData.sourcePlanDetail.length === 0) {
            _this.$notify.warning('班次不能为空')
            return
          }
          if (_this.batchFormData.scheduleDateList.length === 0) {
            _this.$notify.warning('请输入排班日期')
            return
          }
          _this.$api.sourcePlanBatchSave(_this.batchFormData).then(res => {
            if (res.code === 200) {
              _this.listLoading = false
              _this.batchAddDialogFormVisible = false
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
    checkSourceNumTotal(value) {
      const _this = this
      _this.ruleForm.sourceNumber = 0
      if (value > _this.sourceNumberTotal) {
        _this.$notify.warning('请输入小于' + _this.sourceNumberTotal + '的数字')
        return
      }
      const detail = _this.ruleForm.sourcePlanDetail
      if (detail != null) {
        detail.forEach(n => {
          _this.ruleForm.sourceNumber += n.sourceNumber
        })
        if (_this.ruleForm.sourceNumber > _this.sourceNumberTotal) {
          _this.$notify.warning('当天排班数量大于号源池设置的号源总数')
          return false
        }
      }
    },
    checkTotalSourceNum(value) {
      const _this = this
      debugger
      _this.formData.sourceNumber = 0
      if (value > _this.sourceNumberTotal) {
        _this.$notify.warning('请输入小于' + _this.sourceNumberTotal + '的数字')
        return
      }
      const detail = _this.formData.sourcePlanDetail
      if (detail != null) {
        detail.forEach(n => {
          _this.formData.sourceNumber += n.sourceNumber
        })
        if (_this.formData.sourceNumber > _this.sourceNumberTotal) {
          _this.$notify.warning('当天排班数量大于号源池设置的号源总数')
          return false
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
