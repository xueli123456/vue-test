<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="">
          <el-input v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="医技项目名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.isEnabled" style="width: 200px;" class="filter-item" placeholder="是否启用">
            <el-option
              v-for="item in isEnabledArr"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateStatus(scope.row.id)">{{ scope.row.isEnabled=='0'?"启用":"停用" }}</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备品牌" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备型号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceVersion }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="是否启用" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnabled | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作人" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updater!=null ? scope.row.updater : scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作时间" align="center">
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

    <!--新增模态框-->
    <el-dialog class="customWidth" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="device" label-position="right" label-width="120">
        <el-row>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="设备名称：" prop="name">
                <el-input v-model.trim="device.name" style="width:200px" />
              </el-form-item>
              <el-form-item label="设备类型：" prop="type">
                <el-select v-model="device.type" style="width:200px">
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属科室：" prop="deviceOffice">
                <el-select v-model="device.deviceOffice" style="width:200px">
                  <el-option
                    v-for="item in officeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="设备编码：" prop="deviceCode">
                <el-input v-model.trim="device.deviceCode" style="width:200px" disabled="disabled" />
              </el-form-item>
              <el-form-item label="设备品牌：" prop="brand">
                <el-input v-model.trim="device.brand" style="width:200px" />
              </el-form-item>
              <el-form-item label="设备型号：" prop="deviceVersion">
                <el-input v-model.trim="device.deviceVersion" style="width:200px" />
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="设备用途：" prop="devicePurpose">
                <el-input v-model.trim="device.devicePurpose" style="width:200px" />
              </el-form-item>
              <el-form-item label="设备位置：" prop="devicePosition">
                <el-input v-model.trim="device.devicePosition" style="width:200px" />
              </el-form-item>
              <el-form-item label="设备购入时间：" prop="deviceBuytime">
                <el-date-picker
                  v-model="device.deviceBuytime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  style="width: 200px"
                  type="date"
                />
                <!--<datepicker v-on:picked="picked" v-model.trim="device.deviceBuytime"></datepicker>-->
              </el-form-item>
              <el-form-item label="是否启用：" prop="isEnabled">
                <el-select v-model="device.isEnabled" style="width:200px">
                  <el-option
                    v-for="item in isEnabledArr"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="备注：" prop="remarks">
                <el-input v-model.trim="device.remarks" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
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
  name: 'Index',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        0: '停用'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      const statusMap = {
        1: '超声',
        2: 'CT',
        3: 'MRI'
      }
      return statusMap[type]
    }
  },
  components: {
  },
  data() {
    return {
      listLoading: true,
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceCode: [{ required: true, message: '设备编码不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        deviceOffice: [{ required: true, message: '请选择所属科室', trigger: 'blur' }],
        deviceBuytime: [{ required: true, message: '请选择设备购买时间', trigger: 'blur' }],
        isEnabled: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      tableData: [],
      device: {
        name: null,
        type: null,
        deviceCode: null,
        brand: null,
        deviceVersion: null,
        devicePurpose: null,
        devicePosition: null,
        deviceBuytime: null,
        isEnabled: null,
        remarks: null
      },
      officeList: [],
      total: 0,
      listQuery: {
        keyword: '',
        isEnabled: null,
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      isEnabledArr: [{ code: '1', value: '启用' }, { code: '0', value: '停用' }],
      typeList: [],
      createdTimes: 0,
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
    this.loadOfficeList()
    this.loadDeviceTypeList()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.deviceList(this.listQuery).then(res => {
        _this.tableData = res.result.list
        _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    loadOfficeList() {
      const _this = this
      this.$api.officeList().then(res => {
        _this.officeList = res.result
      })
    },
    loadDeviceTypeList() {
      this.$api.getDictList('72151438974709760').then(res => {
        this.typeList = res.result
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
        isEnabled: null,
        pageNo: 1,
        pageSize: 10
      }
      this.fetchData()
    },
    openSave() {
      const _this = this
      this.resetDataForm()
      this.$api.genNumStr().then(res => {
        _this.device.deviceCode = res.result
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDataForm() {
      this.device = {
        name: null,
        type: null,
        deviceCode: null,
        brand: null,
        deviceVersion: null,
        devicePurpose: null,
        devicePosition: null,
        deviceBuytime: null,
        isEnabled: null,
        remarks: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.deviceSave(this.device).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: res.result
              })
              this.dialogStatus = 'create'
              this.dialogFormVisible = false
              this.fetchData()
            }
          })
        }
      })
    },
    updateStatus(id) {
      this.$api.deviceUpdateStatus({ id: id }).then(res => {
        if (res.code === 200) {
          this.fetchData()
        }
      })
    },
    edit(row) {
      this.device = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定将该患者移除黑名单吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.deviceDelete({ id: id }).then(res => {
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
    picked(year, month, date) {
      this.device.deviceBuytime = year + '-' + month + '-' + date
    }
  }
}
</script>

<style scoped>
</style>
