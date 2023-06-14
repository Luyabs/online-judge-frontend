<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchProblem" placeholder="题目" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchType" placeholder="类型" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchTag" placeholder="标签" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-button size="primary" @click="fetchData()"> 查询 </el-button>
        <el-button size="success" @click="fetchData()"> Hello! </el-button>
      </el-row>
    </div>

    <!-- 表格 -->
    <div style="margin-top: 10px;">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" width="30" align="center"> </el-table-column>-->
        <el-table-column prop="problemId" label="编号" width="100" align="center" />
        <el-table-column label="完成状态" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.hasDone === 1" size="small" type="success">未完成</el-button>
            <el-button v-if="scope.row.hasDone === 2" size="small" type="danger">尝试中</el-button>
            <el-button v-if="scope.row.hasDone === 3" size="small" type="info">已完成</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="题目" width="300" />
        <el-table-column prop="type" label="类型" width="150" />
        <el-table-column prop="tags" label="标签" width="150" />
        <el-table-column prop="solutionNum" label="题解" width="100" />
        <el-table-column prop="passRate" label="通过率" width="100" />
        <el-table-column label="难度" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.difficulty === 1" size="small" type="success" plain> easy </el-button>
            <el-button v-if="scope.row.difficulty === 2" size="small" type="warning" plain> medium </el-button>
            <el-button v-if="scope.row.difficulty === 3" size="small" type="danger" plain> hard </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warn" size="medium" @click="fetchDataById(scope.row.problemId)"> 详细 </el-button>
            <el-button type="primary" size="medium" @click="enjoy(scope.row.problemId)"> 来一题 </el-button>
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
      <el-dialog title="详细信息" :visible.sync="detailedFormVisible" width="40%">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="detailedFormData.problemId" disabled /> </el-form-item>
          <el-form-item label="作者"> <el-input v-model="detailedFormData.userId" disabled /> </el-form-item>
          <el-form-item label="标题"> <el-input v-model="detailedFormData.title" disabled /> </el-form-item>
          <el-form-item label="内容"> <el-input v-model="detailedFormData.content" disabled /> </el-form-item>
          <el-form-item label="类型"> <el-input v-model="detailedFormData.type" disabled /> </el-form-item>
          <el-form-item label="练习人次"> <el-input v-model="detailedFormData.attemptNum" disabled /> </el-form-item>
          <el-form-item label="通过人次"> <el-input v-model="detailedFormData.successNum" disabled /> </el-form-item>
          <el-form-item label="难度"> <el-input v-model="detailedFormData.difficulty" disabled /> </el-form-item>
          <el-form-item label="时间限制"> <el-input v-model="detailedFormData.runtimeLimit" disabled /> </el-form-item>
          <el-form-item label="内存限制"> <el-input v-model="detailedFormData.memoryLimit" disabled /> </el-form-item>
          <el-form-item label="更新时间"> <el-input v-model="detailedFormData.updateTime" disabled /> </el-form-item>
          <el-form-item label="创建时间"> <el-input v-model="detailedFormData.insertTime" disabled /> </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="detailedFormVisible = false">确定</el-button>
          <el-button type="primary" @click="enjoy(detailedFormData.problemId)">来一题</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getById, getPage } from '@/api/problem/problem'

export default {
  data() {
    return {
      searchProblem: '',
      searchType: '',
      searchTag: '',

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
        title: this.title, // 条件查询 标题
        type: this.searchType, // 条件查询 题目类型
        tag: this.searchTag, // 条件查询 题目标签
        isVerified: true // 已审核通过
      }
      getPage(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
        } else { this.$message.error(response.message) }
      })
    },

    // 获取id对应数据的详细信息
    fetchDataById(problemId) {
      this.detailedFormClear()
      getById(problemId).then(response => {
        if (response.success === true) {
          this.detailedFormVisible = true
          this.detailedFormData = response.data.problem
          this.detailedFormData.problemId = problemId
        } else { this.$message.error(response.message) }
      })
    },

    // 享受oj
    enjoy(problemId) {
      // alert('享受OJ: ' + problemId)
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
