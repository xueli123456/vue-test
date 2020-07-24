<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="" prop="date">
          <el-date-picker
            v-model="listQuery.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
            style="width: 250px"
            type="date"
          />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetData()">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openSave">新增</el-button>

        <el-select v-model="year" placeholder="请选择年份">
          <el-option :label="2019" :value="2019" />
          <el-option :label="2020" :value="2020" />
          <el-option :label="2021" :value="2021" />
          <el-option :label="2022" :value="2022" />
          <el-option :label="2023" :value="2023" />
          <el-option :label="2024" :value="2024" />
          <el-option :label="2025" :value="2025" />
          <el-option :label="2026" :value="2026" />
          <el-option :label="2027" :value="2027" />
          <el-option :label="2028" :value="2028" />
          <el-option :label="2029" :value="2029" />
          <el-option :label="2030" :value="2030" />
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="init">初始化</el-button>
      </el-form>
    </div>

    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.id !== '1'" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="日期" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作人" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updater!=null ? scope.row.updater : scope.row.creator }}</span>
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

    <!--新增模态框-->
    <el-dialog class="customWidth" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="holiday" label-position="right" label-width="120px" style="margin-left:50px;">
        <el-form-item label="日期：" prop="date">
          <el-date-picker
            v-model="holiday.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
            style="width: 250px"
            type="date"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="holiday.remarks"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 100}"
            placeholder="请输入内容"
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        0: '停用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      year: null,
      listLoading: true,
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      tableData: [],
      holiday: {
        date: null,
        remarks: null
      },
      total: 0,
      listQuery: {
        date: '',
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      isEnabledArr: [{ code: '1', value: '启用' }, { code: '0', value: '停用' }],
      isChildArr: [{ code: '0', value: '有' }, { code: '1', value: '没有' }],
      createdTimes: 0,
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.holidayList(this.listQuery).then(res => {
        _this.tableData = res.result.list
        _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.fetchData()
    },
    resetData() {
      this.listQuery = {
        keyword: '',
        pageNo: 1,
        pageSize: 10
      }
      this.fetchData()
    },
    openSave() {
      this.resetDataForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDataForm() {
      this.holiday = {
        date: null,
        remarks: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.holidaySave(this.holiday).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: res.result
              })
              this.dialogStatus = 'create'
              this.dialogFormVisible = false
              this.fetchData()
            } else {
              this.$notify({
                type: 'success',
                message: '保存失败'
              })
            }
          })
        }
      })
    },
    del(id) {
      this.$confirm(`确定要删除吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.holidayDelete(id).then(res => {
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
    },
    init() {
      if (this.year === null || this.year === '') {
        this.$notify({
          type: 'error',
          message: '请选择年份!'
        })
        return
      }
      this.$api.initHolidayConfigure(this.year).then(res => {
        if (res.code === 200) {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '初始化成功!'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .customWidth{
    min-width: 500px;
    width: 100%;
  }
</style>
