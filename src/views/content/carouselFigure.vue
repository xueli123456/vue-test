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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="轮播图" sortable align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.img" width="100" height="50"></span>
        </template>
      </el-table-column>
      <el-table-column label="链接" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告位" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerPositionDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否开放" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isopen | openFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="mb" label-position="right" label-width="120px" style="margin-left:50px;">
        <div class="grid-content">
          <el-form-item label="图片：" prop="name">
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
            <el-input v-model.trim="mb.img" type="hidden" value="" style="width:250px;display:none" />
          </el-form-item>
          <el-form-item label="链接：" prop="linkUrl">
            <el-input v-model.trim="mb.linkUrl" style="width:250px" />
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model.trim="mb.sort" style="width:250px" />
          </el-form-item>
          <el-form-item label="广告位：" prop="type">
            <el-select v-model="mb.bannerPosition" style="width:250px">
              <el-option value="">---请选择---</el-option>
              <el-option
                v-for="item in bannerPositionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间：" prop="beginDate">
            <el-date-picker
              v-model="mb.beginDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable
              style="width: 250px"
              type="date"
            />
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate">
            <el-date-picker
              v-model="mb.endDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable
              style="width: 250px"
              type="date"
            />
          </el-form-item>
          <el-form-item label="是否开放：" prop="isopen">
            <el-select v-model="mb.isopen">
              <el-option value="">---请选择---</el-option>
              <el-option label="开放" value="1" />
              <el-option label="不开放" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model.trim="mb.remarks"
              style="width:250px"
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
      file: null,
      fileName: null,
      listLoading: true,
      rules: {
        // img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        bannerPosition: [{ required: true, message: '请选择广告位', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        isopen: [{ required: true, message: '请选择是否开放', trigger: 'blur' }]
      },
      tableData: [],
      mb: {
        img: null,
        linkUrl: null,
        sort: null,
        bannerPosition: null,
        beginDate: null,
        endDate: null,
        isopen: null,
        remarks: null
      },
      bannerPositionList: [],
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
    this.loadBannerPositionList()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.mainBannerList(this.listQuery).then(res => {
        _this.tableData = res.result.list
        _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    loadBannerPositionList() {
      const _this = this
      this.$api.adfindAll().then(res => {
        _this.bannerPositionList = res.result
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
      this.mb = {
        img: null,
        sort: null,
        bannerPosition: null,
        beginDate: null,
        endDate: null,
        isopen: null,
        remarks: null
      }
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
          _this.mb.img = res.result
        } else {
          _this.$notify.error('图片上传失败！')
        }
      })
    },
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.mainBannerSave(this.mb).then(res => {
            if (res.code === 200) {
              // this.$notify({
              //   type: 'success',
              //   message: res.result
              // })
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
      this.mb = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    del(id) {
      this.$confirm(`确定删除轮播图吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.mainBannerDelete({ id: id }).then(res => {
          if (res.code === 200) {
            this.fetchData()
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
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
    }
  }
}
</script>

<style scoped>
</style>
