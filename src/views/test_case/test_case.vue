<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="5">
          <div>
            <el-input v-model="problemId" placeholder="problemId">
              <template slot="prepend">problemId: </template>
            </el-input>
          </div>
        </el-col>
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
        <el-table-column prop="testCaseId" label="编号" width="98" align="center" />
        <el-table-column prop="input" label="测试输入" width="400" />
        <el-table-column prop="output" label="预期输出" width="300" />
        <el-table-column prop="description" label="用例描述" width="180" />
        <el-table-column label="优先级" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isPrehandle === true" size="small" type="primary" plain> 前置处理 </el-button>
            <el-button v-else-if="scope.row.isPosthandle === true" size="small" type="info" plain> 后置处理 </el-button>
            <el-button v-else size="small" plain> {{ scope.row.torder }} </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="medium" @click="openEditForm(scope.row.testCaseId)"> 修改 </el-button>
            <el-button type="warning" size="medium" @click="remove(scope.row.testCaseId)"> 删除 </el-button>
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
          <el-form-item label="测试输入"> <el-input v-model="addFormData.input" type="textarea" :rows="3" autosize /> </el-form-item>
          <el-form-item label="预期输出"> <el-input v-model="addFormData.output" type="textarea" :rows="3" autosize /> </el-form-item>
          <el-form-item label="用例描述"> <el-input v-model="addFormData.description" type="textarea" :rows="3" autosize /> </el-form-item>
          <el-form-item label="前置处理">
            <el-switch v-model="addFormData.isPrehandle" />
          </el-form-item>
          <el-form-item label="后置处理">
            <el-switch v-model="addFormData.isPosthandle"/>
          </el-form-item>
          <el-form-item label="优先级">
            <el-input-number size="small" v-model="addFormData.torder" :min="0" :max="10" label="描述文字" @change="null" />
          </el-form-item>
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
          <el-form-item label="编号"> <el-input v-model="editFormData.testCaseId" disabled/> </el-form-item>
          <el-form-item label="测试输入"> <el-input v-model="editFormData.input" type="textarea" :rows="3" autosize/> </el-form-item>
          <el-form-item label="预期输出"> <el-input v-model="editFormData.output" type="textarea" :rows="3" autosize/> </el-form-item>
          <el-form-item label="用例描述"> <el-input v-model="editFormData.description" type="textarea" :rows="3" autosize/> </el-form-item>
          <el-form-item label="前置处理">
            <el-switch v-model="editFormData.isPrehandle" />
          </el-form-item>
          <el-form-item label="后置处理">
            <el-switch v-model="editFormData.isPosthandle"/>
          </el-form-item>
          <el-form-item label="优先级">
            <el-input-number v-model="editFormData.torder" size="small" :min="0" :max="10" label="描述文字" @change="null" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editFormData = false">取消</el-button>
          <el-button type="primary" @click="editConfirm()">确定修改</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPageByProblemId, getById, modify, remove, upload } from '@/api/test_case/test_case'

export default {
  data() {
    return {
      problemId: -1,

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
    this.problemId = this.$route.query.problemId
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
      this.addFormData = {
        problemId: this.problemId
      }
    },

    // 清除修改信息表单数据
    editFormVisibleFormClear() {
      this.editFormData = {
        problemId: this.problemId,
        torder: 0
      }
    },

    // 获取全部数据
    fetchData() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      getPageByProblemId(params, this.problemId).then(response => {
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
      upload(this.addFormData).then(response => {
        if (response.success === true) {
          this.$message.success('上次成功')
          this.addFormVisible = false
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.fetchData()
      })
    },

    // 打开修改窗口
    openEditForm(testCaseId) {
      this.editFormVisibleFormClear()
      getById(testCaseId).then(response => {
        if (response.success === true) {
          this.editFormVisible = true
          const testCase = response.data.testCase
          this.editFormData = {
            testCaseId: testCase.testCaseId,
            problemId: testCase.problemId,
            input: testCase.input,
            output: testCase.output,
            description: testCase.description,
            isPrehandle: testCase.isPrehandle,
            isPosthandle: testCase.isPosthandle,
            torder: testCase.torder
          }
        } else { this.$message.error(response.message) }
      })
    },

    // 确认修改
    editConfirm() {
      modify(this.editFormData).then(response => {
        if (response.success === true) {
          this.$message.success('修改成功')
          this.editFormVisible = false
        } else { this.$message.error(response.message) }
      }).finally(() => {
        this.fetchData()
      })
    },

    // 删除
    remove(testCaseId) {
      this.$confirm('此操作将永久删除该题目(testCaseId: ' + testCaseId + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(testCaseId).then(response => {
          if (response.success === true) {
            this.$message.success('删除成功')
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
