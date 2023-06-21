<template>
  <div class="dashboard-container">
    <div>
      <el-descriptions class="margin-top" title="个人信息" :column="3" :size="'medium'">
        <el-descriptions-item label="用户ID">{{ userId }}</el-descriptions-item>
        <el-descriptions-item label="身份">{{ roles[0] }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ nickname }}</el-descriptions-item>
        <el-descriptions-item label="加入时间">{{ insertTime }}</el-descriptions-item>
        <el-descriptions-item label="个人介绍">{{ introduction }}</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">上大路99号 上海大专</el-descriptions-item>
      </el-descriptions>
    </div>

    <hr/>
    <div>name: {{ name }}</div>
    <div> <img :src="avatar" alt="头像加载失败"> </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/user/user'

export default {
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'token',
      'roles'
    ])
  },
  data() {
    return {
      userId: 0,
      username: '',
      nickname: '',
      insertTime: '',
      introduction: ''
    }
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
