<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <span class="el-dropdown-link">
          {{ introduction }}<i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;width: 200px">用户名:{{ introduction }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;">邮箱:{{ email }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="modifyPwd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="pwdDialogFormVisible" @close="resetForm('pwdForm')">
      <el-form ref="pwdForm" :rules="rules" :model="pwdForm" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model.trim="pwdForm.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model.trim="pwdForm.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="pwdForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pwdForm')">取 消</el-button>
        <el-button type="primary" @click="doModifyPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { modifyPassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'introduction',
      'email',
      'currentUserId'
    ])
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      const pwdRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!pwdRegex.test(value)) {
        callback(new Error('密码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      pwdDialogFormVisible: false,
      downloadLoading: false,
      pwdForm: {
        userId: '',
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '旧密码长度为2到20个字符', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '新密码长度为2到20个字符', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '新密码长度为2到20个字符', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm(form) {
      this.pwdDialogFormVisible = false
      this.$refs[form].resetFields()
    },
    modifyPwd() {
      this.pwdDialogFormVisible = true
    },
    doModifyPwd() {
      this.pwdForm.userId = this.currentUserId
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          if (this.pwdForm.password !== this.pwdForm.confirmPassword) {
            this.$notify({
              type: 'warning',
              message: '两次密码输入不一致!'
            })
            return false
          }
          modifyPassword(this.pwdForm).then(res => {
            if (res.code === 200) {
              this.pwdDialogFormVisible = false
              this.$notify({
                type: 'success',
                message: '修改密码成功!'
              })
              this.logout()
            }
          })
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllVisitedViews')
      await this.$store.dispatch('tagsView/delAllCachedViews')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // this.$router.push(`/login`)
      let href = window.location.href
      let loginUrl = 'http://sso.tianxuan01.cn/#/login?redirect=medical-reservation'
      if(href.match('dev')) {  //开发
        loginUrl = 'http://sso.test.tianxuan01.cn/#/login?redirect=medical-reservation'
      } else if(href.match('test')){ //测试
        loginUrl = 'http://sso.test.tianxuan01.cn/#/login?redirect=medical-reservation'
      }else{
        loginUrl = 'http://sso.tianxuan01.cn/#/login?redirect=medical-reservation'
      }
      window.location.href = loginUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
