<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchTitle" placeholder="题目" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchTag" placeholder="标签 (目前未实现)" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4">
          <el-select v-model="searchType" placeholder="类型" size="medium" prefix-icon="el-icon-search" clearable>
            <el-option
              v-for="item in [{value: 1, label: 'SQL'}, { value: 2, label: '高级语言'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-button type="primary" @click="fetchData()"> 查询 </el-button>
      </el-row>
    </div>

    <!-- 表格 -->
    <div style="margin-top: 10px;">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" width="30" align="center"> </el-table-column>-->
        <el-table-column prop="problemId" label="编号" width="98" align="center" />
        <el-table-column label="完成状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hasDone === 1" type="info">未完成</el-tag>
            <el-tag v-if="scope.row.hasDone === 2" type="danger">尝试中</el-tag>
            <el-tag v-if="scope.row.hasDone === 3" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="300" />
        <el-table-column label="类型" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1" type="success" plain> SQL </el-tag>
            <el-tag v-if="scope.row.type === 2" type="warning" plain> 高级语言 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="150" />
        <el-table-column prop="solutionNum" label="题解" width="100" />
        <el-table-column prop="passRate" label="通过率" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.passRate === null" plain> - - </el-tag>
            <el-tag v-else plain> {{ scope.row.passRate }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.difficulty === 1" type="success" plain> easy </el-tag>
            <el-tag v-if="scope.row.difficulty === 2" type="warning" plain> medium </el-tag>
            <el-tag v-if="scope.row.difficulty === 3" type="danger" plain> hard </el-tag>
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
          <el-form-item label="编号"> <el-input v-model="detailedFormData.problemId" /> </el-form-item>
          <el-form-item label="作者"> <el-input v-model="detailedFormData.userId" /> </el-form-item>
          <el-form-item label="标题"> <el-input v-model="detailedFormData.title" /> </el-form-item>
          <el-form-item label="内容"> <el-input v-model="detailedFormData.content" type="textarea" :rows="3" autosize/> </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="detailedFormData.type">
              <el-radio :label="1"> SQL </el-radio>
              <el-radio :label="2"> 高级语言 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度">
            <el-radio-group v-model="detailedFormData.difficulty">
              <el-radio :label="1"> 简单 </el-radio>
              <el-radio :label="2"> 中等 </el-radio>
              <el-radio :label="3"> 困难 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="练习人次"> <el-input v-model="detailedFormData.attemptNum" /> </el-form-item>
          <el-form-item label="通过人次"> <el-input v-model="detailedFormData.successNum" /> </el-form-item>
          <el-form-item label="时间限制"> <el-input v-model="detailedFormData.runtimeLimit" /> </el-form-item>
          <el-form-item label="内存限制"> <el-input v-model="detailedFormData.memoryLimit" /> </el-form-item>
          <el-form-item label="更新时间"> <el-input v-model="detailedFormData.updateTime" /> </el-form-item>
          <el-form-item label="创建时间"> <el-input v-model="detailedFormData.insertTime" /> </el-form-item>

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
      searchTitle: '',
      searchTag: '',
      searchType: '',

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
        title: this.searchTitle, // 条件查询 标题
        type: this.searchType, // 条件查询 题目类型
        tag: this.searchTag, // 条件查询 题目标签
        status: 1 // 已审核通过
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
