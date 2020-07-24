<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="规则类型" prop="ruleType">
          <el-select v-model="listQuery.ruleType" filterable clearable placeholder="请选择规则类型">
            <el-option
              v-for="item in ruleTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="ruleName">
          <el-input v-model="listQuery.ruleName" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <div class="page-header">
          <el-button class="filter-item" type="primary" @click="searchFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="resetQueryForm('listQuery')">重置</el-button>
          <el-button class="filter-item" type="primary" @click="addMergeRule">新增</el-button>
        </div>
      </el-form>
    </div>
    <el-table v-loading.body="listLoading" :data="tableData" stripe highlight-current-row element-loading-text="Loading" border tooltip-effect="dark">
      <el-table-column align="center" label="操作" width="200" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="viewRule(scope.row)">查看</el-button>
          <el-button type="danger" size="mini" @click="deleteRule(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="30" fixed label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="规则编码" min-width="100" align="center" prop="ruleCode">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" min-width="100" align="center" prop="ruleName">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则类型" align="center" min-width="100" prop="ruleTypeName">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用场景" align="center" min-width="200" prop="applicationScenariosName">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationScenariosName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则有先级" align="center" min-width="50" prop="priority">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则描述" align="center" min-width="200" prop="ruleItemsDesc">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleItemsDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="200" prop="remarks">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--新增模态框-->
    <el-dialog class="customWidth" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" @close="resetForm('dataForm')">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="right" label-width="120px">
        <el-form-item label="规则编码" prop="ruleCode">
          <el-input v-model.trim="ruleForm.ruleCode" style="width:300px" readonly />
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model.trim="ruleForm.ruleName" style="width:300px" />
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-select v-model="ruleForm.ruleType" filterable placeholder="请选择规则类型" @change="changeRuleType()">
            <el-option
              v-for="item in ruleTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用场景" prop="applicationScenarios">
          <el-select v-model="ruleForm.applicationScenarios" filterable placeholder="请选择应用场景">
            <el-option
              v-for="item in applicationScenariosList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model.trim="ruleForm.priority" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item v-if="ruleForm.ruleType === '30001'" label="规则条件" prop="ruleItems">
          <el-checkbox-group v-model="ruleForm.ruleItems" @change="handleCheckedChange">
            <el-checkbox v-for="item in mergeItemList" :key="item.dictCode" :label="item.dictCode">{{ item.dictName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.ruleType === '30002'" label="规则条件" prop="ruleItems">
          <el-checkbox-group v-model="ruleForm.ruleItems" @change="handleCheckedChange">
            <el-checkbox v-for="item in distinctItemList" :key="item.dictCode" :label="item.dictCode">{{ item.dictName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.ruleType === '30003' || ruleForm.ruleType === '30004' || ruleForm.ruleType === '30005'" label="规则条件" prop="ruleItem">
          <el-select v-model="ruleForm.logicOperationalSymbol" filterable placeholder="请选择运算符号" disabled>
            <el-option
              v-for="item in logicOperationalSymbolList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-select v-model="ruleForm.conditionType" filterable placeholder="请选择条件类型" @change="handleConditionTypeChange">
            <el-option
              v-for="item in conditionTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
          <el-select v-model="ruleForm.containRelation" filterable placeholder="请选择包含关系">
            <el-option
              v-for="item in containRelationList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-select v-model="ruleForm.ruleItem" filterable placeholder="请选择条件项目">
            <el-option
              v-for="item in ruleItemList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
          <el-button type="primary" @click="addItem()">增加</el-button>
        </el-form-item>
        <div v-if="ruleForm.ruleType === '30003' || ruleForm.ruleType === '30004' || ruleForm.ruleType === '30005'">
          <div v-for="(item, index) in ruleForm.dynamicItem" :key="index">
            <el-form-item
              label=""
              :prop="'dynamicItem.' + index + '.ruleItem'"
              :rules="{
                required: true, message: '条件项目不能为空', trigger: 'blur'
              }"
            >
              <el-select v-model="item.logicOperationalSymbol" filterable placeholder="请选择运算符号">
                <el-option
                  v-for="it in logicOperationalSymbolList"
                  :key="it.key"
                  :label="it.value"
                  :value="it.key"
                />
              </el-select>

              <el-select v-model="item.conditionType" filterable placeholder="请选择条件" @change="handleConditionTypeChange1">
                <el-option
                  v-for="it in conditionTypeList"
                  :key="it.dictCode"
                  :label="it.dictName"
                  :value="it.dictCode"
                />
              </el-select>

              <el-select v-model="item.containRelation" filterable placeholder="请选择包含关系">
                <el-option
                  v-for="it in containRelationList"
                  :key="it.key"
                  :label="it.value"
                  :value="it.key"
                />
              </el-select>

              <el-select v-model="item.ruleItem" filterable placeholder="请选择条件项目">
                <el-option
                  v-for="it in ruleItemList1"
                  :key="it.dictCode"
                  :label="it.dictName"
                  :value="it.dictCode"
                />
              </el-select>
              <el-input v-show="false" v-model="item.index = index + 1">下标</el-input>
              <el-button type="danger" @click="deleteItem(item, index)">删除</el-button>
            </el-form-item>
          </div>
        </div>
        <el-form-item v-if="ruleForm.ruleType === '30003'" label="号源池" prop="sourcePool">
          <el-select v-model="ruleForm.sourcePool" filterable placeholder="请选择号源池">
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.ruleType === '30004'" label="排队号是否生成" prop="generateLineNo">
          <el-radio v-model.trim="ruleForm.generateLineNo" label="1">是</el-radio>
          <el-radio v-model.trim="ruleForm.generateLineNo" label="0">否</el-radio>
        </el-form-item>
        <el-form-item v-if="ruleForm.ruleType === '30005'" label="预约时间限制" prop="limitDate">
          <el-select v-model="ruleForm.relationOperationalSymbol" filterable placeholder="请选择关系运算符">
            <el-option
              v-for="it in relationOperationalSymbolList"
              :key="it.key"
              :label="it.value"
              :value="it.key"
            />
          </el-select>
          <el-time-select
            v-model="ruleForm.limitDate"
            :picker-options="{
              start: '00:30',
              step: '00:15',
              end: '24:00'
            }"
            placeholder="选择时间"
          /><span style="margin-left: 10px">24h</span>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dataForm')">取 消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog class="customWidth" title="查看" :visible.sync="viewDialogFormVisible" width="60%" @close="resetForm('dataForm')">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm1" label-position="right" label-width="120px">
        <el-form-item label="规则编码" prop="ruleCode">
          <el-input v-model.trim="ruleForm1.ruleCode" style="width:300px" disabled />
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model.trim="ruleForm1.ruleName" style="width:300px" disabled/>
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-select v-model="ruleForm1.ruleType" filterable placeholder="请选择规则类型" @change="changeRuleType()" disabled>
            <el-option
              v-for="item in ruleTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用场景" prop="applicationScenarios">
          <el-select v-model="ruleForm1.applicationScenarios" filterable placeholder="请选择应用场景" disabled>
            <el-option
              v-for="item in applicationScenariosList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model.trim="ruleForm1.priority" controls-position="right" :min="1" disabled/>
        </el-form-item>
        <el-form-item v-if="ruleForm1.ruleType === '30001'" label="规则条件" prop="ruleItems">
          <el-checkbox-group v-model="ruleForm1.ruleItems" @change="handleCheckedChange" disabled>
            <el-checkbox v-for="item in mergeItemList" :key="item.dictCode" :label="item.dictCode">{{ item.dictName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="ruleForm1.ruleType === '30002'" label="规则条件" prop="ruleItems">
          <el-checkbox-group v-model="ruleForm1.ruleItems" @change="handleCheckedChange" disabled>
            <el-checkbox v-for="item in distinctItemList" :key="item.dictCode" :label="item.dictCode">{{ item.dictName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-if="ruleForm1.ruleType === '30003' || ruleForm1.ruleType === '30004' || ruleForm1.ruleType === '30005'">
          <div v-for="(item, index) in ruleForm1.dynamicItem" :key="index">
            <el-form-item
              label="规则条件"
              :prop="'dynamicItem.' + index + '.ruleItem'"
              :rules="{
                required: true, message: '条件项目不能为空', trigger: 'blur'
              }"
            >
              <el-select v-model="item.logicOperationalSymbol" filterable placeholder="请选择运算符号" disabled>
                <el-option
                  v-for="it in logicOperationalSymbolList"
                  :key="it.key"
                  :label="it.value"
                  :value="it.key"
                />
              </el-select>

              <el-select v-model="item.conditionType" filterable placeholder="请选择条件" @change="handleConditionTypeChange1" disabled>
                <el-option
                  v-for="it in conditionTypeList"
                  :key="it.dictCode"
                  :label="it.dictName"
                  :value="it.dictCode"
                />
              </el-select>

              <el-select v-model="item.containRelation" filterable placeholder="请选择包含关系" disabled>
                <el-option
                  v-for="it in containRelationList"
                  :key="it.key"
                  :label="it.value"
                  :value="it.key"
                />
              </el-select>

              <el-select v-model="item.ruleItem" filterable placeholder="请选择条件项目" disabled>
                <el-option
                  v-for="it in viewRuleItemList"
                  :key="it.dictCode"
                  :label="it.dictName"
                  :value="it.dictCode"
                />
              </el-select>
              <el-input v-show="false" v-model="item.index = index + 1">下标</el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item v-if="ruleForm1.ruleType === '30003'" label="号源池" prop="sourcePool">
          <el-select v-model="ruleForm1.sourcePool" filterable placeholder="请选择号源池" disabled>
            <el-option
              v-for="item in sourcePoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm1.ruleType === '30004'" label="排队号是否生成" prop="generateLineNo">
          <el-radio v-model.trim="ruleForm1.generateLineNo" label="1" disabled>是</el-radio>
          <el-radio v-model.trim="ruleForm1.generateLineNo" label="0" disabled>否</el-radio>
        </el-form-item>
        <el-form-item v-if="ruleForm1.ruleType === '30005'" label="预约时间限制" prop="limitDate">
          <el-select v-model="ruleForm1.relationOperationalSymbol" filterable placeholder="请选择关系运算符" disabled>
            <el-option
              v-for="it in relationOperationalSymbolList"
              :key="it.key"
              :label="it.value"
              :value="it.key"
            />
          </el-select>
          <el-time-select
            disabled
            v-model="ruleForm1.limitDate"
            :picker-options="{
              start: '00:30',
              step: '00:15',
              end: '24:00'
            }"
            placeholder="选择时间"
          /><span style="margin-left: 10px">24h</span>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input disabled
            v-model.trim="ruleForm1.remarks"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 100}"
            placeholder="请输入内容"
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dataForm')">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPage, getChildrenByCode, saveMergeRuleInfo, getRuleCode, getSourcePoolList, deleteRuleById, getMedicalProjectList, recursionChildrenByParentCode } from '@/api/rule'
export default {
  name: 'Tab',
  filters: {
    ruleTypeFilter(val) {
      let status = ''
      switch (val) {
        case '1': {
          status = '检验项目合并规则'
          break
        }
        case '2': {
          status = '申请单合并规则'
          break
        }
      }
      return status
    }
  },
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      ruleForm: {
        relationOperationalSymbol: '>',
        logicOperationalSymbol: '&&',
        generateLineNo: '1',
        conditionType: '20001',
        containRelation: '1',
        applicationScenarios: '10001',
        priority: '',
        sourcePool: '',
        ruleCode: '',
        ruleName: '',
        ruleType: '30001',
        ruleItems: [],
        ruleItem: '',
        dynamicItem: [],
        remarks: '',
        limitDate: ''
      },
      ruleForm1: {
        relationOperationalSymbol: '>',
        logicOperationalSymbol: '&&',
        generateLineNo: '1',
        conditionType: '20001',
        containRelation: '1',
        applicationScenarios: '10001',
        priority: '',
        sourcePool: '',
        ruleCode: '',
        ruleName: '',
        ruleType: '30001',
        ruleItems: [],
        ruleItem: '',
        dynamicItem: [],
        remarks: '',
        limitDate: ''
      },
      relationOperationalSymbolList: [
        {
          key: '>',
          value: '大于'
        },
        {
          key: '=',
          value: '等于'
        },
        {
          key: '<',
          value: '小于'
        }
      ],
      logicOperationalSymbolList: [
        {
          key: '&&',
          value: '并且'
        },
        {
          key: '||',
          value: '或者'
        }
      ],
      conditionTypeList: [],
      containRelationList: [
        {
          key: '0',
          value: '不包含'
        },
        {
          key: '1',
          value: '包含'
        },
        {
          key: '2',
          value: '等于'
        }
      ],
      ruleItemList1: [],
      ruleItemList: [],
      sourcePoolList: [],
      distinctItemList: [],
      applicationScenariosList: [],
      medicalProjectList: [],
      mergeItemList: [],
      dialogFormVisible: false,
      viewDialogFormVisible: false,
      listLoading: false,
      tableData: [],
      listQuery: {
        ruleName: '',
        ruleType: ''
      },
      ruleTypeList: [],
      viewRuleItemList: [],
      rules: {
        ruleName: [
          { required: true, message: '规则名称不能为空', trigger: 'blur' },
          { min: 2, max: 40, message: '名称长度为2到40个字符', trigger: 'blur' }
        ],
        ruleType: [
          { required: true, message: '规则类型不能为空', trigger: 'blur' }
        ],
        fixMedicalProjectId: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        ruleItems: [
          { required: true, message: '规则条件不能为空', trigger: 'blur' }
        ],
        ruleItem: [
          { required: true, message: '规则条件不能为空', trigger: 'blur' }
        ],
        applicationScenarios: [
          { required: true, message: '应用场景不能为空', trigger: 'blur' }
        ],
        sourcePool: [
          { required: true, message: '号源池不能为空', trigger: 'blur' }
        ],
        relationOperationalSymbol: [
          { required: true, message: '关系运算符不能为空', trigger: 'blur' }
        ],
        limitDate: [
          { required: true, message: '限制时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.getApplicationScenariosList()
    this.getMergeItemList()
    this.getRuleTypeList()
    this.getMedicalProjectList()
    this.getConditionTypeList()
    this.getRuleItemList('20001')
    this.getRuleItemList1('20001')
  },
  methods: {
    recursionChildrenByParentCode(param){
      const _this = this
      recursionChildrenByParentCode(param).then(res => {
        if (res.code === 200) {
          _this.viewRuleItemList = res.result
        }
      })
    },
    handleConditionTypeChange(event) {
      const _this = this
      if (event === '20001') {
        _this.getRuleItemList(event)
        _this.ruleForm.ruleItem = ''
      } else if (event === '20002') {
        _this.ruleForm.ruleItem = ''
        _this.getRuleItemList(event)
      } else if (event === '20003') {
        _this.ruleForm.ruleItem = ''
        _this.getRuleItemList(event)
      }
    },
    handleConditionTypeChange1(event) {
      const _this = this
      if (event === '20001') {
        _this.getRuleItemList1(event)
      } else if (event === '20002') {
        _this.getRuleItemList1(event)
      } else if (event === '20003') {
        _this.getRuleItemList1(event)
      }
    },
    changeRuleType() {
      const _this = this
      if (_this.ruleForm.ruleType === '30001') {
        _this.getMergeItemList()
      } else if (_this.ruleForm.ruleType === '30002') {
        _this.getDistinctItemList()
      } else if (_this.ruleForm.ruleType === '30003') {
        _this.getSourcePoolList()
      } else if (_this.ruleForm.ruleType === '30004') {
        _this.ruleForm.generateLineNo = '1'
      }
    },
    addItem() {
      const _this = this
      _this.ruleForm.dynamicItem.push({
        relationOperationalSymbol: '>',
        logicOperationalSymbol: '&&',
        conditionType: '20001',
        containRelation: '1',
        ruleItem: '',
        index: 0
      })
    },
    deleteItem(item, index) {
      this.index = this.ruleForm.dynamicItem.indexOf(item)
      if (index !== -1) {
        this.ruleForm.dynamicItem.splice(index, 1)
      }
    },
    getMedicalProjectList() {
      const _this = this
      getMedicalProjectList().then(res => {
        if (res.code === 200) {
          _this.medicalProjectList = res.result
        }
      })
    },
    getRuleItemList(param) {
      const _this = this
      getChildrenByCode(param).then(res => {
        if (res.code === 200) {
          _this.ruleItemList = res.result
        }
      })
    },
    getRuleItemList1(param) {
      const _this = this
      getChildrenByCode(param).then(res => {
        if (res.code === 200) {
          _this.ruleItemList1 = res.result
        }
      })
    },
    getConditionTypeList() {
      const _this = this
      getChildrenByCode('20000').then(res => {
        if (res.code === 200) {
          _this.conditionTypeList = res.result
        }
      })
    },
    getRuleTypeList() {
      const _this = this
      getChildrenByCode('30000').then(res => {
        if (res.code === 200) {
          _this.ruleTypeList = res.result
        }
      })
    },
    getSourcePoolList() {
      const _this = this
      getSourcePoolList().then(res => {
        if (res.code === 200) {
          _this.sourcePoolList = res.result
        }
      })
    },
    getDistinctItemList() {
      const _this = this
      getChildrenByCode('30002').then(res => {
        if (res.code === 200) {
          _this.distinctItemList = res.result
        }
      })
    },
    getMergeItemList() {
      const _this = this
      getChildrenByCode('30001').then(res => {
        if (res.code === 200) {
          _this.mergeItemList = res.result
        }
      })
    },
    getApplicationScenariosList() {
      const _this = this
      getChildrenByCode('10000').then(res => {
        if (res.code === 200) {
          _this.applicationScenariosList = res.result
        }
      })
    },
    getRuleCode() {
      const _this = this
      getRuleCode().then(res => {
        if (res.code === 200) {
          _this.ruleForm.ruleCode = res.result
        }
      })
    },
    fetchData() {
      this.listLoading = true
      listPage(this.listQuery).then(res => {
        if (res.code === 200) {
          this.tableData = res.result.list
          this.total = res.result.total
          this.listLoading = false
        }
      })
    },
    resetQueryForm(formName) {
      const _this = this
      _this.fetchData()
      _this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      const _this = this
      _this.viewDialogFormVisible = false
      _this.dialogFormVisible = false
      _this.$refs[formName].resetFields()
      _this.ruleForm.ruleItems = []
      _this.ruleForm.dynamicItem = []
      _this.ruleForm.conditionType = '20001'
      _this.getRuleItemList('20001')
    },
    searchFilter() {
      const _this = this
      _this.listQuery.pageNum = 1
      _this.fetchData()
    },
    addMergeRule() {
      const _this = this
      _this.dialogFormVisible = true
      _this.dialogStatus = '新增'
      _this.getRuleCode()
    },
    viewRule(row) {
      const _this = this
      _this.viewDialogFormVisible = true
      _this.recursionChildrenByParentCode('20000')
      _this.dialogStatus = '查看'
      _this.ruleForm1.ruleCode = row.ruleCode
      _this.ruleForm1.ruleName = row.ruleName
      _this.ruleForm1.ruleType = row.ruleType
      _this.ruleForm1.applicationScenarios = row.applicationScenarios
      _this.ruleForm1.priority = row.priority
      _this.ruleForm1.ruleItems = row.ruleItems
      _this.ruleForm1.ruleItem = row.ruleItem
      _this.ruleForm1.remarks = row.remarks
      _this.ruleForm1.limitDate = row.limitDate
      _this.ruleForm1.sourcePool = row.sourcePool
      _this.ruleForm1.relationOperationalSymbol = row.relationOperationalSymbol
      _this.ruleForm1.containRelation = row.containRelation
      _this.ruleForm1.generateLineNo = row.generateLineNo.toString()
      _this.ruleForm1.dynamicItem = row.dynamicItemList
      if (_this.ruleForm1.ruleType === '30001') {
        _this.getMergeItemList()
      } else if (_this.ruleForm1.ruleType === '30002') {
        _this.getDistinctItemList()
      } else if (_this.ruleForm1.ruleType === '30003') {
        _this.getSourcePoolList()
      }
    },
    saveData(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.ruleForm.ruleType !== '30005') {
            _this.ruleForm.relationOperationalSymbol = ''
            _this.ruleForm.limitDate = ''
          } else if (_this.ruleForm.ruleType !== '30003') {
            _this.ruleForm.sourcePool = ''
          } else if (_this.ruleForm.ruleType !== '30004') {
            _this.ruleForm.generateLineNo = '0'
          }
          saveMergeRuleInfo(_this.ruleForm).then(res => {
            if (res.code === 200) {
              _this.addDialogFormVisible = false
              _this.fetchData()
              _this.resetForm(formName)
              _this.$notify({
                type: 'success',
                message: '新增成功!'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCheckedChange() {

    },
    editRule(row) {
      const _this = this
      _this.dialogFormVisible = true
      _this.dialogStatus = '修改'
      _this.getRuleCode()
    },
    deleteRule(row) {
      this.$confirm(`确定删除${row.ruleName}吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteRuleById(row.id).then(res => {
          if (res.code === 200) {
            this.fetchData()
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
