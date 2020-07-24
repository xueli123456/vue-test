<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="医技项目名称">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="医技项目名称" @keyup.enter.native="searchFilter" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="listQuery.isEnabled" style="width: 200px;" class="filter-item" placeholder="是否启用">
            <el-option
              v-for="item in isEnabledArr"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="listQuery.department" placeholder="科室">
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          <el-button v-if="scope.row.id !== '1'" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.id !== '1'" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="医技项目名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行科室" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用设备" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医技分组名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.medicalTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="是否启用" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnabled | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作人" width="100px" align="center">
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
      <el-form ref="dataForm" :rules="rules" :model="medicalProject" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="医技项目名称：" prop="name">
              <el-input v-model.trim="medicalProject.name" style="width:200px" />
            </el-form-item>
            <el-form-item label="项目代码：" prop="projectCode">
              <el-input v-model.trim="medicalProject.projectCode" style="width:200px" disabled="disabled" />
            </el-form-item>
            <el-form-item label="项目单位：" prop="projectUnit">
              <el-input v-model.trim="medicalProject.projectUnit" style="width:200px" />
            </el-form-item>
            <el-form-item label="项目价格：" prop="projectPrice">
              <el-input v-model.trim="medicalProject.projectPrice" style="width:200px" />
            </el-form-item>
            <el-form-item label="项目类型：" prop="projectType">
              <el-input v-model.trim="medicalProject.projectType" style="width:200px" />
            </el-form-item>
            <el-form-item label="使用设备类型：" prop="deviceType">
              <el-input v-model.trim="medicalProject.deviceType" style="width:200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="his对应编码：" prop="hisCode">
              <el-input v-model.trim="medicalProject.hisCode" style="width:200px" />
            </el-form-item>
            <el-form-item label="PACS/LIS对应编码：" prop="pacsCode">
              <el-input v-model.trim="medicalProject.pacsCode" style="width:200px" />
            </el-form-item>
            <el-form-item label="执行科室：" prop="department">
              <el-select v-model="medicalProject.department" @change="changeMedicalProjectDepartment">
                <el-option
                  v-for="item in officeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="使用设备：" prop="device">
              <el-select v-model="medicalProject.device">
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="医技分组：" prop="medicalType">
              <el-select v-model="medicalProject.medicalType">
                <el-option
                  v-for="item in medicalTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用：" prop="isEnabled">
              <el-select v-model="medicalProject.isEnabled">
                <el-option
                  v-for="item in isEnabledArr"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-form-item label="注意事项：" prop="content">
          <el-input v-model.trim="medicalProject.content" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model.trim="medicalProject.remarks"
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
  name: 'Index',
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
      listLoading: true,
      rules: {
        name: [{ required: true, message: '请输入医技项目名称', trigger: 'blur' }],
        projectUnit: [{ required: true, message: '请输入项目单位', trigger: 'blur' }],
        projectType: [{ required: true, message: '请输入项目类型', trigger: 'blur' }],
        hisCode: [{ required: true, message: 'his对应编码', trigger: 'blur' }],
        department: [{ required: true, message: '请选择执行科室', trigger: 'blur' }],
        medicalType: [{ required: true, message: '请选择医技分组', trigger: 'blur' }],
        isEnabled: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      tableData: [],
      medicalProject: {
        name: '',
        projectCode: '',
        projectUnit: null,
        projectPrice: null,
        projectType: null,
        deviceType: null,
        hisCode: null,
        pacsCode: null,
        device: null,
        department: null,
        medicalType: null,
        isEnabled: null,
        isChild: null,
        content: null,
        remarks: null
      },
      officeList: [],
      medicalTypeList: [],
      deviceList: [],
      total: 0,
      listQuery: {
        name: '',
        isEnabled: null,
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
    console.log('确认最新')
    this.fetchData()
    this.loadOfficeList()
    this.loadDeviceList()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.medicalProjectList(this.listQuery).then(res => {
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
    changeMedicalProjectDepartment() {
      const _this = this
      if (this.medicalProject.department !== null && this.medicalProject.department !== '') {
        this.$api.loadMedicalTypeListByDepartment(this.medicalProject.department).then(res => {
          _this.medicalTypeList = res.result
        })
      }
    },
    loadDeviceList() {
      const _this = this
      this.$api.loadDeviceList().then(res => {
        _this.deviceList = res.result
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
        name: '',
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
        _this.medicalProject.projectCode = res.result
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetDataForm() {
      this.medicalProject = {
        name: '',
        no: '',
        department: null,
        isEnabled: null,
        isChild: null,
        remarks: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.medicalProjectSave(this.medicalProject).then(res => {
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
      this.$api.medicalProjectUpdateStatus({ id: id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            type: 'success',
            message: '操作成功'
          })
          this.fetchData()
        }
      })
    },
    edit(row) {
      this.medicalProject = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$api.loadMedicalTypeListByDepartment(row.departmentId).then(res => {
        this.medicalTypeList = res.result
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定删除该医技项目吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.medicalProjectDelete({ id: id }).then(res => {
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
