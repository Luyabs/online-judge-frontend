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
        <el-button type="success" @click="openAddForm()"> 上传 </el-button>
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
        <el-table-column label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag @click="showVerifyMessage(scope.row.problemId)" v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag @click="showVerifyMessage(scope.row.problemId)" v-if="scope.row.status === 2" type="info">审核中</el-tag>
            <el-tag @click="showVerifyMessage(scope.row.problemId)" v-if="scope.row.status === 3" type="danger">待修改</el-tag>
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
            <el-button type="success" @click="editTestCase(scope.row.problemId)">测试用例</el-button>
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
          <el-form-item label="标题" required> <el-input v-model="addFormData.title" /> </el-form-item>
          <el-form-item label="内容" required> <el-input v-model="addFormData.content" type="textarea" :rows="3" autosize/> </el-form-item>
          <el-form-item label="类型" required>
            <el-radio-group v-model="addFormData.type">
              <el-radio :label="1"> SQL </el-radio>
              <el-radio :label="2"> 高级语言 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度" required>
            <el-radio-group v-model="addFormData.difficulty">
              <el-radio :label="1"> 简单 </el-radio>
              <el-radio :label="2"> 中等 </el-radio>
              <el-radio :label="3"> 困难 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间限制"> <el-input v-model="addFormData.runtimeLimit" /> </el-form-item>
          <el-form-item label="内存限制"> <el-input v-model="addFormData.memoryLimit" /> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addConfirm()">确定上传</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 修改信息框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="editFormVisible" width="30%">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="编号"> <el-input v-model="editFormData.problemId" disabled /> </el-form-item>
          <el-form-item label="标题" required> <el-input v-model="editFormData.title" /> </el-form-item>
          <el-form-item label="内容" required> <el-input type="textarea" :rows="2" v-model="editFormData.content" autosize/> </el-form-item>
          <el-form-item label="类型" required>
            <el-radio-group v-model="editFormData.type">
              <el-radio :label="1"> SQL </el-radio>
              <el-radio :label="2"> 高级语言 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度" required>
            <el-radio-group v-model="editFormData.difficulty">
              <el-radio :label="1"> 简单 </el-radio>
              <el-radio :label="2"> 中等 </el-radio>
              <el-radio :label="3"> 困难 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间限制"> <el-input v-model="editFormData.runtimeLimit" /> </el-form-item>
          <el-form-item label="内存限制"> <el-input v-model="editFormData.memoryLimit" /> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="success" @click="editTestCase(editFormData.problemId)">编辑测试用例</el-button>
          <el-button type="primary" @click="editConfirm()">确定修改</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  getById,
  getMyUpload,
  getVerifiedMessageById,
  modify,
  remove,
  upload
} from '@/api/problem/problem'
import { mapGetters } from 'vuex'

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

      addFormData: {}, // 新增信息表单数据
      addFormVisible: false, // 新增信息表单可见度
      editFormData: {}, // 修改信息表单数据
      editFormVisible: false // 修改信息表单可见度

    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
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
        title: this.searchTitle, // 条件查询 标题
        type: this.searchType, // 条件查询 题目类型
        tag: this.searchTag // 条件查询 题目标签
      }
      getMyUpload(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
        } else { this.$message.error(response.message) }
      })
    },

    // 展示审核评语
    showVerifyMessage(problemId) {
      getVerifiedMessageById(problemId).then(response => {
        if (response.success === true) {
          let result = response.data.editRecord.verifyMessage
          if (result === null || result.trim() === '') {
            result = '暂无审核信息'
          }
          this.$notify({
            title: '审核信息 id:' + problemId,
            message: this.$createElement(
              'i',
              { style: 'color: teal' },
              '审核信息: ' + result
            ),
            duration: 6000
          })
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
      upload(this.addFormData).then(response => {
        if (response.success === true) {
          if (this.roles[0] === 'admin') {
            this.$message.success('上传成功')
          } else {
            this.$message.success('已上传, 待审核')
          }
          this.addFormVisible = false
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.fetchData()
      })
    },

    // 打开修改窗口
    openEditForm(problemId) {
      this.showVerifyMessage(problemId)
      this.editFormVisibleFormClear()
      getById(problemId).then(response => {
        if (response.success === true) {
          this.editFormVisible = true
          const problem = response.data.problem
          this.editFormData = {
            problemId: problem.problemId,
            title: problem.title,
            content: problem.content,
            type: problem.type,
            difficulty: problem.difficulty,
            runtimeLimit: problem.runtimeLimit,
            memoryLimit: problem.memoryLimit
          }
        } else { this.$message.error(response.message) }
      })
    },

    editTestCase(problemId) {
      this.$router.push({
        path: '/test_case',
        query: {
          problemId: problemId
        }
      })
    },

    // 确认修改
    editConfirm() {
      modify(this.editFormData).then(response => {
        if (response.success === true) {
          if (this.roles[0] === 'admin') {
            this.$message.success('修改成功')
          } else {
            this.$message.success('已提交修改, 待审核')
          }
          this.editFormVisible = false
        } else { this.$message.error(response.message) }
      }).finally(() => {
        this.fetchData()
      })
    },

    // 删除
    remove(problemId) {
      this.$confirm('此操作将永久删除该题目(problemId: ' + problemId + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(problemId).then(response => {
          if (response.success === true) {
            if (this.roles[0] === 'admin') {
              this.$message.success('删除成功')
            } else {
              this.$message.success('已提交删除请求, 待审核')
            }
            this.editFormVisible = false
          } else { this.$message.error(response.message) }
        }).finally(() => {
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }

  }
}
</script>
