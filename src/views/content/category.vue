<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openSave">新增</el-button>
        <el-button class="filter-item" type="primary" @click="saveSort()">保存排序</el-button>
      </el-form>
    </div>
    <el-table
      v-loading.body="listLoading"
      row-key="id"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!--      <el-table-column align="center" label="ID" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.$index+1 }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="栏目名称" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="栏目ID" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属机构" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.officeName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="栏目模型" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.moduleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" sortable align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" style="width:60px;text-align:center;" />
        </template>
      </el-table-column>

      <el-table-column label="导航菜单" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inMenu | inMenuFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="栏目列表" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inList | inListFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="260px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          <el-button type="primary" size="mini" @click="addNext(scope.row.id)">添加下机栏目</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增模态框-->
    <el-dialog class="customWidth" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="category" label-position="right" label-width="150px" style="margin-left:50px;">
        <el-row>

          <el-col :span="18">
            <div class="grid-content">
              <el-form-item label="归属机构：" prop="officeId">
                <el-input v-model.trim="category.officeId" style="display:none" />
                <el-input v-model.trim="officeName" readonly disabled style="width:176px;" />
                <el-button @click="selectOffice()">选择</el-button>
                <div :style="isOfficeDisplay?'display:block':'display:none'" class="office-tree">
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                  />
                  <el-tree
                    ref="officeTree"
                    class="filter-tree"
                    :data="officeTreeData"
                    :props="defaultOfficeProps"
                    default-expand-all
                    node-key="id"
                    highlight-current
                    accordion
                    :filter-node-method="filterNode"
                    @node-click="getOfficeNodeData"
                  />
                </div>
              </el-form-item>
              <el-form-item label="上级栏目：" prop="parentId" style="position: relative">
                <el-input v-model.trim="category.parentId" style="display:none" />
                <el-input v-model.trim="parentCategoryName" readonly disabled style="width:176px;" />
                <el-button @click="selectParentCategory()">选择</el-button>
                <div :style="isDisplay?'display:block':'display:none'" class="parent-category">
                  <el-tree
                    class="filter-tree"
                    :data="treeData"
                    :props="defaultProps"
                    default-expand-all
                    node-key="id"
                    highlight-current
                    accordion
                    @node-click="getNodeData"
                  />
                </div>
              </el-form-item>
              <el-form-item label="栏目模型：" prop="module">
                <el-select v-model="category.module" style="width:250px">
                  <el-option value="">---请选择---</el-option>
                  <el-option
                    v-for="item in moduleList"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="栏目名称：" prop="name">
                <el-input v-model.trim="category.name" style="width:250px" />
              </el-form-item>
              <el-form-item label="缩略图：" prop="image">
                <span>{{ fileName }}</span>
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="doUpload"
                  :limit="1"
                  :before-upload="beforeUpload"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button type="primary" @click="submitUpload()">上传</el-button>
                </el-upload>
                <el-input v-model.trim="category.image" type="hidden" value="" style="width:250px;display:none" />
              </el-form-item>
              <el-form-item label="排序：" prop="categoryVersion">
                <el-input v-model.trim="category.sort" style="width:250px" />
              </el-form-item>
              <el-form-item label="描述：" prop="brand">
                <el-input
                  v-model.trim="category.description"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 100}"
                  placeholder="请输入内容"
                  maxlength="255"
                />
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
  name: 'Tab',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        0: '停用'
      }
      return statusMap[status]
    },
    inMenuFilter(type) {
      const statusMap = {
        0: '隐藏',
        1: '显示'
      }
      return statusMap[type]
    },
    inListFilter(type) {
      const statusMap = {
        0: '隐藏',
        1: '显示'
      }
      return statusMap[type]
    }
  },
  components: {
  },
  data() {
    return {
      filterText: '',
      isDisplay: false,
      isOfficeDisplay: false,
      officeTreeData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultOfficeProps: {
        children: 'children',
        label: 'officeName'
      },
      fileName: null,
      listLoading: true,
      rules: {
        officeId: [{ required: true, message: '请选择归属机构', trigger: 'blur' }],
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        module: [{ required: true, message: '请选择栏目模型', trigger: 'blur' }]
      },
      tableData: [],
      officeName: null,
      parentCategoryName: null,
      category: {
        officeId: null,
        parentId: null,
        module: null,
        name: null,
        image: null,
        discription: null,
        sort: null
      },
      moduleList: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.officeTree.filter(val)
    }
  },
  created() {
    this.fetchData()
    this.loadModuleList()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.categoryList(this.listQuery).then(res => {
        _this.tableData = res.result
        _this.treeData = res.result
        // _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.officeName.indexOf(value) !== -1
    },
    getOfficeNodeData(data) {
      console.log(data)
      this.officeName = data.officeName
      this.category.officeId = data.id
      this.isOfficeDisplay = false
    },
    getNodeData(data) {
      console.log(data)
      this.parentCategoryName = data.name
      this.category.parentId = data.id
      this.isDisplay = false
    },
    loadModuleList() {
      const _this = this
      this.$api.getDictList('72152019332165632').then(res => {
        _this.moduleList = res.result
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
    beforeUpload(file) {
      console.log(file, '文件')
      const extension = file.name.split('.')[1] === 'jpg'
      const extension2 = file.name.split('.')[1] === 'png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        this.$notify.warning('上传图片只能是jpg,png格式!')
        return
      }
      if (!isLt2M) {
        this.$notify.warning('上传图片大小不能超过 5MB!')
        return
      }
      this.file = file
      this.fileName = file.name
      return false // 返回false不会自动上传
    },
    submitUpload() {
      // console.log('上传' + this.files.name)
      if (this.fileName === null) {
        this.$notify.warning('请选择要上传的文件！')
        return false
      }
      const fileFormData = new FormData()
      fileFormData.append('file', this.file, this.fileName) // filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      const _this = this
      this.$api.uploadFile(fileFormData).then((res) => {
        if (res && res.code === 200) {
          _this.$notify.success('图片上传成功！')
          _this.category.image = res.result
        } else {
          _this.$notify.error('图片上传失败！')
        }
      })
    },
    addNext(id) {
      this.resetDataForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
      this.officeName = null
      this.parentCategoryName = null
      this.fileName = null
      this.category = {
        officeId: null,
        parentId: null,
        module: null,
        name: null,
        image: null,
        discription: null,
        sort: null
      }
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.categorySave(this.category).then(res => {
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
    selectOffice() {
      const _this = this
      this.$api.getOfficeTree('1').then(res => {
        if (res.code === 200) {
          _this.officeTreeData = res.result
          _this.isOfficeDisplay = true
        }
      })
    },
    selectParentCategory() {
      if (this.isDisplay) {
        this.isDisplay = false
      } else {
        this.isDisplay = true
      }
    },
    edit(row) {
      this.officeName = row.officeName
      this.parentCategoryName = row.parentCategoryName
      this.fileName = null
      this.category = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定删除该栏目吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.categoryDelete({ id: id }).then(res => {
          if (res.code === 200) {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          } else {
            this.$notify.error(res.result)
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveSort() {
      console.log('')
    }
  }
}
</script>

<style scoped>
  .parent-category{z-index:10000;position: absolute;margin-top:2px;width:250px;border:1px solid #DCDFE6;border-radius:5px;}
  .office-tree{z-index:10000;position: absolute;margin-top:2px;width:250px;border:1px solid #DCDFE6;border-radius:5px;}
  .filter-tree{overflow:auto;height:400px;}

</style>
