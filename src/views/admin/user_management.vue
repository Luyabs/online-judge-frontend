<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchAuthority" placeholder="权限" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchUsername" placeholder="用户名" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchBanStatus" placeholder="封禁状态" size="medium" prefix-icon="el-icon-search" /> </el-col>
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
        <el-table-column prop="userId" label="编号" width="100" align="center" />
        <el-table-column prop="roles" label="权限" width="150" />
        <el-table-column prop="username" label="用户名" width="250" />
        <el-table-column prop="introduction" label="个人简介" width="400" />
        <el-table-column prop="tag" label="标签" width="200" />
        <el-table-column label="封禁状态" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.banStatus === true" size="small" type="success" plain @click="changeBanStatus(scope.row.userId)">正常</el-button>
            <el-button v-if="scope.row.banStatus === false" size="small" type="warning" plain @click="changeBanStatus(scope.row.userId)">被封禁</el-button>
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
          <el-form-item label="编号"> <el-input v-model="detailedFormData.userId" disabled /> </el-form-item>
          <el-form-item label="权限"> <el-input v-model="detailedFormData.roles" disabled /> </el-form-item>
          <el-form-item label="用户名"> <el-input v-model="detailedFormData.username" disabled /> </el-form-item>
          <el-form-item label="个人简介"> <el-input v-model="detailedFormData.introduction" disabled /> </el-form-item>
          <el-form-item label="标签"> <el-input v-model="detailedFormData.tag" disabled /> </el-form-item>
          <el-form-item label="封禁状态"> <el-input v-model="detailedFormData.banStatus" disabled /> </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="detailedFormVisible = false">关闭</el-button>
          <el-button type="warning" @click="changeBanStatus(detailedFormData.userId)">调整封禁状态</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getById, getPage } from '@/api/user/user'

export default {
  data() {
    return {
      searchAuthority: '',
      searchUsername: '',
      searchBanStatus: '',

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
        authority: this.searchAuthority,
        username: this.searchUsername,
        banStatus: this.searchBanStatus
      }
      getPage(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.users
          this.total = response.data.total
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
          this.detailedFormData.userId = userId
        } else { this.$message.error(response.message) }
      })
    },

    // 享受oj
    changeBanStatus(userId) {
      // TODO: 状态修改
      this.$message.success(userId + '状态修改成功')
    }
  }
}
</script>
