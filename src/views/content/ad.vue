<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="">
          <el-input v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="医技项目名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetSearchData()">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openSave">新增</el-button>
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
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="ID" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告位位置" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否开放" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isopen | openFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作人" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updater!=null ? scope.row.updater : scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="220px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
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
      <el-form ref="dataForm" :rules="rules" :model="ad" label-position="right" label-width="120px">
        <div class="grid-content">
          <el-form-item label="广告位位置：" prop="name">
            <el-input v-model.trim="ad.name" />
          </el-form-item>

          <el-form-item label="描述：" prop="description">
            <el-input v-model.trim="ad.description" />
          </el-form-item>
          <el-form-item label="是否开放：" prop="isopen">
            <el-select v-model="ad.isopen">
              <el-option value="">---请选择---</el-option>
              <el-option label="开放" value="1" />
              <el-option label="不开放" value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间：" prop="beginDate">
            <el-date-picker
              v-model="ad.beginDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable
              type="date"
            />
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate">
            <el-date-picker
              v-model="ad.endDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable
              type="date"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="ad.remarks"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 100}"
              placeholder="请输入内容"
              maxlength="255"
            />
          </el-form-item>
        </div>
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
  name: 'Tab',
  filters: {
    openFilter(isOpen) {
      const openMap = {
        1: '开放',
        2: '不开放'
      }
      return openMap[isOpen]
    }
  },
  components: {
  },
  data() {
    return {
      listLoading: true,
      rules: {
        name: [{ required: true, message: '请填写广告位位置', trigger: 'blur' }],
        isopen: [{ required: true, message: '请选择是否开放', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      },
      tableData: [],
      ad: {
        name: null,
        description: null,
        isopen: null,
        beginDate: null,
        endDate: null,
        remarks: null
      },
      total: 0,
      listQuery: {
        keyword: '',
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
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
      this.$api.adList(this.listQuery).then(res => {
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
    resetSearchData() {
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
      this.ad = {
        name: null,
        description: null,
        isopen: null,
        beginDate: null,
        endDate: null,
        remarks: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.adSave(this.ad).then(res => {
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
    edit(row) {
      this.ad = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定删除该广告位吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.adDelete({ id: id }).then(res => {
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
