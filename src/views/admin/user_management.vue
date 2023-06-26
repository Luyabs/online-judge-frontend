<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchUsername" placeholder="用户名 (username)" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchNickname" placeholder="昵称 (nickname)" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchIntroduction" placeholder="个人简介" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-button size="primary" @click="fetchData()"> 查询 </el-button>
      </el-row>
    </div>

    <!-- 表格 -->
    <div style="margin-top: 10px;">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" width="30" align="center"> </el-table-column>-->
        <el-table-column prop="userId" label="编号" width="98" align="center" />
        <el-table-column label="权限" width="98">
          <template slot-scope="scope">
            <el-button v-if="scope.row.role === 2" size="small" type="primary" plain> admin </el-button>
            <el-button v-if="scope.row.role === 1" size="small" plain> user </el-button>
          </template>
        </el-table-column>>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="introduction" label="个人简介" width="340" />
        <el-table-column prop="updateTime" label="信息更新时间" width="150" />
        <el-table-column prop="insertTime" label="加入本站时间" width="150" />
        <el-table-column label="封禁状态" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isBanned"
              active-color="#ff4949"
              inactive-color="#13ce66"
              disabled
            />
            <!--            <el-button v-if="scope.row.isBanned === false" size="small" type="success" plain @click="changeBanStatus(scope.row.userId)">正常</el-button>-->
            <!--            <el-button v-if="scope.row.isBanned === true" size="small" type="warning" plain @click="changeBanStatus(scope.row.userId)">被封禁</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="medium" @click="fetchDataById(scope.row.userId)"> 详细 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div style="margin-top: 15px; margin-left: 20px;">
      <el-pagination
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详细信息框 -->
    <div>
      <el-dialog title="详细信息" :visible.sync="detailedFormVisible" width="30%">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="detailedFormData.userId" /> </el-form-item>
          <el-form-item label="权限">
            <el-radio-group v-model="detailedFormData.role">
              <el-radio :label="1"> user </el-radio>
              <el-radio :label="2"> admin </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户名"> <el-input v-model="detailedFormData.username" /> </el-form-item>
          <el-form-item label="昵称"> <el-input v-model="detailedFormData.nickname" /> </el-form-item>
          <el-form-item label="个人简介"> <el-input v-model="detailedFormData.introduction" /> </el-form-item>
          <el-form-item label="封禁状态">
            <el-radio-group v-model="detailedFormData.isBanned">
              <el-radio :label="true"> 被封禁 </el-radio>
              <el-radio :label="false"> 正常 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="更新时间"> <el-input v-model="detailedFormData.updateTime" /> </el-form-item>
          <el-form-item label="加入时间"> <el-input v-model="detailedFormData.insertTime" /> </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="detailedFormVisible = false">关闭</el-button>
          <el-button type="warning" plain @click="changeBanStatus(detailedFormData.userId)">调整封禁状态</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getById, getPage, reverseBan } from '@/api/user/user'

export default {
  data() {
    return {
      searchNickname: '',
      searchUsername: '',
      searchIntroduction: '',

      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 5,

      detailedFormData: {}, // 详细信息表单数据
      detailedFormVisible: false // 详细信息表单可见度

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 改变每页大小
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },

    // 改变当前页号
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    // 清除详细信息表单数据
    detailedFormClear() {
      this.detailedFormData = {}
    },

    // 获取全部数据
    fetchData() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        username: this.searchUsername,
        nickname: this.searchNickname,
        introduction: this.searchIntroduction
      }
      getPage(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
        } else { this.$message.error(response.message) }
      })
    },

    // 获取id对应数据的详细信息
    fetchDataById(userId) {
      this.detailedFormClear()
      getById(userId).then(response => {
        if (response.success === true) {
          this.detailedFormVisible = true
          this.detailedFormData = response.data.user
        } else { this.$message.error(response.message) }
      })
    },

    // 修改封禁状态
    changeBanStatus(userId) {
      reverseBan(userId).then(response => {
        if (response.success === true) {
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
      this.detailedFormVisible = false
      this.fetchData()
    }
  }
}
</script>
