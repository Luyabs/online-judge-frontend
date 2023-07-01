<template>
  <div class="dashboard-container">
    <div>
      <el-descriptions class="margin-top" title="个人信息" :column="3" :size="'medium'">
        <el-descriptions-item label="用户ID">{{ userId }} </el-descriptions-item>
        <el-descriptions-item label="身份">{{ roles[0] }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ nickname }}</el-descriptions-item>
        <el-descriptions-item label="加入时间">{{ insertTime }}</el-descriptions-item>
        <el-descriptions-item label="个人介绍">{{ introduction }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 审批信息drawer -->
    <el-drawer
      title="修改个人信息"
      :visible.sync="editDrawerVisible"
      direction="rtl"
      size="30%"
      :before-close="closeDrawer"
    >
      <div class="demo-drawer__content">
        <el-form size="medium" label-position="right" label-width="80px" style="margin-left: 3%; margin-right: 3%">
          <el-form-item label="用户ID"> <el-input v-model="userId" disabled /> </el-form-item>
          <el-form-item label="用户名"> <el-input v-model="username" disabled /> </el-form-item>
          <el-form-item label="密码"> <el-input v-model="password" type="password" show-password/> </el-form-item>
          <el-form-item label="昵称"> <el-input v-model="nickname" /> </el-form-item>
          <el-form-item label="个人介绍"> <el-input v-model="introduction" type="textarea" :rows="1" autosize /> </el-form-item>
          <div class="demo-drawer__footer" style="margin-left: 3%">
            <el-button type="danger" @click="updateSelfInfo">
              <i class="el-icon-edit"></i>
              更新个人信息
            </el-button>
            <el-button @click="closeDrawer">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-drawer>

    <hr>
    <el-button type="success" @click="editDrawerVisible = true">
      <i class="el-icon-edit"></i>
      更新个人信息
    </el-button>
<!--    <div>name: {{ name }}</div>-->
    <div style="margin-top: 10px"> <img :src="avatar" alt="头像加载失败"> </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/user/user'

export default {
  data() {
    return {
      userId: 0,
      username: '',
      nickname: '',
      insertTime: '',
      introduction: '',

      editDrawerVisible: false,
      password: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'token',
      'roles'
    ])
  },
  // 获取用户自身信息
  created() {
    getInfo(this.token).then(response => {
      if (response.success === true) {
        const user = response.data.user
        this.userId = user.userId
        this.username = user.username
        this.nickname = user.nickname
        this.insertTime = user.insertTime
        this.introduction = user.introduction
      } else { this.$message.error(response.message) }
    })
  },

  // 关闭drawer
  closeDrawer(done) {
    this.$confirm('确认关闭？')
      .then(_ => {
        this.judgeFormVisible = false
        done()
      })
      .catch(_ => {})
  },

  updateSelfInfo() {
    // todo
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
