<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item label="">
          <el-input v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="标题" @keyup.enter.native="searchFilter" />
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
      <el-table-column label="标题" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属栏目" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点击数" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hits }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="发布者" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" sortable label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
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
      category: {
        name: ''
      },
      listLoading: true,

      tableData: [],
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
      createdTimes: 0,
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
    this.loadCategoryById()
  },
  methods: {
    search() {
      this.fetchData()
    },
    fetchData() {
      const _this = this
      this.listLoading = true
      this.$api.articleList(this.listQuery).then(res => {
        _this.tableData = res.result.list
        _this.total = parseInt(res.result.total)
        _this.listLoading = false
      })
    },
    loadCategoryById() {
      const _this = this
      this.$api.loadCategoryById({ 'id': '71d7800903ce43e3a019f5251afb277a' }).then(res => {
        _this.category = res.result
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
      this.$router.push({ path: '/content/createArticle' })
      // this.resetDataForm()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    resetDataForm() {
      this.article = {
        categoryId: null,
        title: null,
        keywords: null,
        weight: null,
        modelType: null,
        hits: null,
        createTime: null,
        articleData: {
          copyfrom: null,
          content: null
        }
      }
    },
    edit(row) {
      const data = JSON.stringify(row)
      this.$router.push({ name: 'createArticle', params: { res: data }})
    },
    del(id) {
      this.$confirm(`确定删除消息吗？`, '删除提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.articleDelete({ id: id }).then(res => {
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
