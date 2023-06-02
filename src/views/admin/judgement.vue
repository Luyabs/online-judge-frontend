<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchProblemName" placeholder="题目" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchChangeType" placeholder="修改类型" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchChangeContent" placeholder="修改内容" size="medium" prefix-icon="el-icon-search" /> </el-col>
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
        <el-table-column prop="changeId" label="编号" width="100" align="center" />
        <el-table-column prop="problemName" label="题目" width="200" />
        <el-table-column label="修改类型" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.changeType === 'INSERT'" size="small" type="warning" plain>{{ scope.row.changeType }}</el-button>
            <el-button v-if="scope.row.changeType === 'UPDATE'" size="small" type="primary" plain>{{ scope.row.changeType }}</el-button>
            <el-button v-if="scope.row.changeType === 'DELETE'" size="small" type="danger" plain>{{ scope.row.changeType }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="changeContent" label="修改内容" width="680" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="medium" @click="openJudgeForm(scope.row.changeId)"> 审批 </el-button>
            <el-button type="primary" size="medium" @click="jump(scope.row.problemId)"> 跳转到此题 </el-button>
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

    <!-- 审批信息框 -->
    <div>
      <el-dialog title="审批信息" :visible.sync="judgeFormVisible" width="50%" fullscreen>
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="judgeFormData.changeId" disabled /> </el-form-item>
          <el-form-item label="题目"> <el-input v-model="judgeFormData.problemName" disabled /> </el-form-item>
          <el-form-item label="修改类型"> <el-input v-model="judgeFormData.changeType" disabled /> </el-form-item>
          <el-form-item label="新内容"> <el-input v-model="judgeFormData.changeContent" type="textarea" rows="6" disabled /> </el-form-item>
          <el-form-item label="旧内容"> <el-input v-model="judgeFormData.oldContent" type="textarea" rows="6" disabled /> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="judgeFormVisible = false">取消</el-button>
          <el-button type="primary" @click="judgeConfirm(judgeFormData.changeId)">审批通过</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getById, getPage } from '@/api/problem/problem-change'

export default {
  data() {
    return {
      searchProblemName: '',
      searchChangeType: '',
      searchChangeContent: '',

      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 5,

      judgeFormData: {}, // 修改信息表单数据
      judgeFormVisible: false // 修改信息表单可见度

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

    // 清除修改信息表单数据
    judgeFormVisibleClear() {
      this.judgeFormData = {}
    },

    // 获取全部数据
    fetchData() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        problem: this.searchProblemName,
        type: this.searchChangeType,
        tag: this.searchChangeContent
      }
      getPage(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.changes
          this.total = response.data.total
        } else { this.$message.error(response.message) }
      })
    },

    // 打开审批窗口
    openJudgeForm(judgeId) {
      this.judgeFormVisibleClear()
      getById(judgeId).then(response => {
        if (response.success === true) {
          this.judgeFormVisible = true
          this.judgeFormData = response.data.change
        } else { this.$message.error(response.message) }
      })
    },

    // 审批通过
    judgeConfirm(judgeId) {
      // TODO: 审批通过接口
      this.$message.success('审批通过')
      this.judgeFormVisible = false
      this.fetchData()
    },

    // 跳转到题目
    jump(problemId) {
      this.$router.push({
        path: '/problem_set/problem',
        query: {
          problemId: problemId
        }
      })
    }

  }
}
</script>
