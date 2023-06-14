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
            <el-button type="primary" size="medium" @click="openEditForm(scope.row.problemId)"> 修改 </el-button>
            <el-button type="warning" size="medium" @click="remove(scope.row.problemId)"> 删除 </el-button>
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

    <!-- 新增信息框 -->
    <div>
      <el-dialog title="新增信息" :visible.sync="addFormVisible" width="30%">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="addFormData.problemId" /> </el-form-item>
          <el-form-item label="完成状态"> <el-input v-model="addFormData.completionStatus" /> </el-form-item>
          <el-form-item label="题目"> <el-input v-model="addFormData.problemName" /> </el-form-item>
          <el-form-item label="类型"> <el-input v-model="addFormData.type" /> </el-form-item>
          <el-form-item label="标签"> <el-input v-model="addFormData.tag" /> </el-form-item>
          <el-form-item label="题解"> <el-input v-model="addFormData.solution" /> </el-form-item>
          <el-form-item label="通过率"> <el-input v-model="addFormData.passPossibility" /> </el-form-item>
          <el-form-item label="难度"> <el-input v-model="addFormData.level" /> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addConfirm()">确定上传并提交审核</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 修改信息框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="editFormVisible" width="30%">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="editFormData.problemId" /> </el-form-item>
          <el-form-item label="完成状态"> <el-input v-model="editFormData.completionStatus" /> </el-form-item>
          <el-form-item label="题目"> <el-input v-model="editFormData.problemName" /> </el-form-item>
          <el-form-item label="类型"> <el-input v-model="editFormData.type" /> </el-form-item>
          <el-form-item label="标签"> <el-input v-model="editFormData.tag" /> </el-form-item>
          <el-form-item label="题解"> <el-input v-model="editFormData.solution" /> </el-form-item>
          <el-form-item label="通过率"> <el-input v-model="editFormData.passPossibility" /> </el-form-item>
          <el-form-item label="难度"> <el-input v-model="editFormData.level" /> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editConfirm(editFormData.problemId)">确定修改并提交审核</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getById, getMyUpload } from '@/api/problem/problem'

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

      addFormData: {}, // 新增信息表单数据
      addFormVisible: false, // 新增信息表单可见度
      editFormData: {}, // 修改信息表单数据
      editFormVisible: false // 修改信息表单可见度

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

    // 清除新增信息表单数据
    addFormVisibleFormClear() {
      this.addFormData = {}
    },

    // 清除修改信息表单数据
    editFormVisibleFormClear() {
      this.editFormData = {}
    },

    // 获取全部数据
    fetchData() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.title, // 条件查询 标题
        type: this.searchType, // 条件查询 题目类型
        tag: this.searchTag, // 条件查询 题目标签
      }
      getMyUpload(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
        } else { this.$message.error(response.message) }
      })
    },

    // 打开新增窗口
    openAddForm() {
      // TODO: 提供新增多级的页面
      this.addFormVisibleFormClear()
      this.addFormVisible = true
    },

    // 新增题目
    addConfirm() {
      // TODO: 上传接口
      this.$message.success('已上传题目, 待审核')
      this.addFormVisible = false
      this.fetchData()
    },

    // 打开修改窗口
    openEditForm(problemId) {
      this.editFormVisibleFormClear()
      getById(problemId).then(response => {
        if (response.success === true) {
          this.editFormVisible = true
          this.editFormData = response.data.problem
          this.editFormData.problemId = problemId
        } else { this.$message.error(response.message) }
      })
    },

    // 确认修改
    editConfirm(problemId) {
      // TODO: 修改接口，提供修改题目内容，测试用例的按钮
      this.$message.success('已提交修改审核')
      this.editFormVisible = false
      this.fetchData()
    },

    // 删除
    remove(problemId) {
      this.$confirm('此操作将永久删除该题目(problemId: ' + problemId + '), 是否继续?', '提示', {
        confirmButtonText: '确定并提交审核',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 删除接口
        this.$message.success('已提交删除审核')
        this.fetchData()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }

  }
}
</script>
