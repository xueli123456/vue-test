<template>
  <div class="app-container calendar-list-container">
    <el-form ref="dataForm" :rules="rules" :model="article" label-position="right" label-width="120px" style="margin-left:50px;margin-top:100px;">
      <div class="grid-content">
        <el-form-item label="归属栏目：" prop="categoryId" style="position: relative">
          <el-input v-model.trim="article.categoryId" style="display:none" />
          <el-input v-model.trim="categoryName" readonly disabled style="width:176px;" />
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
        <el-form-item label="标题：" prop="title">
          <el-input v-model.trim="article.title" style="width:250px" />
        </el-form-item>
        <el-form-item label="短标题：" prop="shortTitle">
          <el-input v-model.trim="article.shortTitle" style="width:250px" />
        </el-form-item>
        <el-form-item label="关键字：" prop="keywords">
          <el-input v-model.trim="article.keywords" style="width:250px" />
        </el-form-item>
        <el-form-item label="排序号：" prop="weight">
          <el-input v-model.trim="article.weight" style="width:250px" />
        </el-form-item>
        <el-form-item label="模板：" prop="modelType">
          <el-select v-model="article.modelType" style="width: 250px;" class="filter-item" @change="selectModelType">
            <el-option
              v-for="item in modelTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            />
          </el-select>
          <el-button @click="showThumbnail()">查看模板缩略图</el-button>
          <div :style="isThumbnailDisplay?'display:block':'display:none'" class="thumbnail">
            <img src="../../assets/images/list.png" style="margin:15px 0 0 15px">
          </div>
        </el-form-item>
        <el-form-item label="缩略图:" prop="photo" :style="isThumbnailListDisplay?'display:block':'display:none'">
          <table>
            <tr v-for="(item, index ) in article.photo" :key="item" style="vertical-align: central">
              <td style="width: 20px">{{ index+1 }}.</td>
              <td>
                <img
                  :src="item"
                  style="max-width:200px;max-height:200px;height:200px;border:0;padding:3px;"
                  alt=""
                >
              </td>
              <td><i style="margin-left:20px" class="el-icon-delete" @click="removePhoto(item)" /></td>
            </tr>
          </table>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="doUpload"
            :limit="1"
            :before-upload="beforeUpload"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="正文：" prop="content">
          <quill-editor
            ref="myQuillEditor"
            v-model="article.articleData.content"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
        </el-form-item>
        <el-form-item label="来源：" prop="copyfrom" style="margin-top:80px;">
          <el-input v-model.trim="article.articleData.copyfrom" style="width:250px" />
        </el-form-item>
        <el-form-item label="发布时间：" prop="createDate">
          <el-date-picker
            v-model="article.createDate"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            style="width: 250px"
            type="datetime"
          />
        </el-form-item>
        <el-form-item label="点击量：" prop="hits">
          <el-input v-model.trim="article.hits" style="width:250px" />
        </el-form-item>
      </div>
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="saveData('dataForm')">确 定</el-button>
    </el-form>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'Tab',
  components: { quillEditor },
  data() {
    return {
      isThumbnailDisplay: false,
      isThumbnailListDisplay: false,
      isDisplay: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      categoryName: null,
      createdTimes: 0,
      article: {
        categoryId: null,
        title: null,
        shortTitle: null,
        keywords: null,
        weight: null,
        modelType: null,
        photo: [],
        hits: null,
        createDate: null,
        articleData: {
          copyfrom: null,
          content: null
        }
      },
      rules: {
        categoryId: [{ required: true, message: '请选择归属栏目', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        keywords: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        modelType: [{ required: true, message: '请选择模板', trigger: 'blur' }],
        createTime: [{ required: true, message: '请选择发布时间', trigger: 'blur' }]
      },
      editorOption: {
        placeholder: '请输入...'
      },
      modelTypeList: []
    }
  },
  computed: {
    editor() {
      // false禁止编辑  true语序编辑
      // this.$refs.myQuillEditor.quill.enable(false)
      return this.$refs.myQuillEditor.quill
    }
  },
  created() {
    const art = this.$route.params.res
    if (typeof (art) !== 'undefined') {
      const data = Object.assign({}, JSON.parse(art))
      // var arr = Object.keys(art)
      if (data !== null) {
        if (data.articleData == null) {
          data.articleData.content = null
          data.copyfrom = null
        }
        this.categoryName = data.categoryName
        this.article = data
        this.article.modelType = data.modelType.toString()
      }
    }
    this.loadModelTypeList()
  },
  methods: {
    saveData(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.$api.articleSave(this.article).then(res => {
            if (res.code === 200) {
              this.$notify({
                type: 'success',
                message: res.result
              })
              this.$router.go(-1)
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
    loadCagegoryList() {
      const _this = this
      // this.listLoading = true
      this.$api.categoryList({}).then(res => {
        _this.treeData = res.result
      })
    },
    loadModelTypeList() {
      const _this = this
      this.$api.getDictList('72798072507133952').then(res => {
        res.result.forEach(n => {
          n.value = parseInt(n.dictValue)
        })
        _this.modelTypeList = res.result
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    onEditorReady(editor) { }, // 准备编辑器

    onEditorBlur() { }, // 失去焦点事件

    onEditorFocus(val, editor) {
      console.log(val) // 富文本获得焦点时的内容
    }, // 获得焦点事件

    onEditorChange() {}, // 内容改变事件
    selectParentCategory() {
      this.loadCagegoryList()
      if (this.isDisplay) {
        this.isDisplay = false
      } else {
        this.isDisplay = true
      }
    },
    showThumbnail() {
      if (this.isThumbnailDisplay) {
        this.isThumbnailDisplay = false
      } else {
        this.isThumbnailDisplay = true
      }
    },
    getNodeData(data) {
      console.log(data)
      this.categoryName = data.name
      this.article.categoryId = data.id
      this.isDisplay = false
    },
    selectModelType() {
      if (this.article.modelType === 0) {
        this.article.photo = []
        this.isThumbnailListDisplay = false
      } else {
        this.isThumbnailListDisplay = true
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
          _this.article.photo.push(res.result)
        } else {
          _this.$notify.error('图片上传失败！')
        }
      })
    },
    removePhoto(params) {
      const photos = this.article.photo
      for (var i = 0; i < photos.length; i++) {
        if (photos[i] === params) {
          this.article.photo.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
  .parent-category{z-index:10000;position: absolute;margin-top:2px;width:250px;border:1px solid #DCDFE6;border-radius:5px;}
  .thumbnail{z-index:10000;position: absolute;margin-top:2px;margin-left:250px;width:250px;border:1px solid #DCDFE6;border-radius:5px;background:#FFFFFF;}
  .quill-editor {
    height: 350px;
    width: 1200px;
  }
</style>
