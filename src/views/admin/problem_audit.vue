<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div style="margin-top: 20px; margin-left: 20px;">
      <el-row :gutter="20">
        <el-col :span="4"> <el-input v-model="searchTitle" placeholder="题目" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4"> <el-input v-model="searchTag" placeholder="标签 (目前未实现)" size="medium" prefix-icon="el-icon-search" /> </el-col>
        <el-col :span="4">
          <el-select v-model="changeAction" placeholder="修改行为" size="medium" prefix-icon="el-icon-search" clearable>
            <el-option
              v-for="item in [{value: 1, label: '新增'}, { value: 2, label: '删除'}, { value: 3, label: '修改'}]"
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
        <el-table-column prop="editRecordId" label="编号" width="98" align="center" />
        <el-table-column prop="title" label="题目" width="300" />
        <el-table-column label="修改类型" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.changeAction === 1" type="warning" plain> 新增 </el-tag>
            <el-tag v-if="scope.row.changeAction === 2" type="danger" plain> 删除 </el-tag>
            <el-tag v-if="scope.row.changeAction === 3" type="primary" plain> 修改 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题目详细信息" width="400">
          <template slot-scope="scope">
            <el-button v-if="scope.row.changeAction === 1" size="medium" type="success" @click="fetchProblemById(scope.row.originalProblemId)"> 题目信息 </el-button>
            <el-button v-if="scope.row.changeAction === 3" size="medium" type="info" @click="fetchProblemById(scope.row.originalProblemId)"> 改前题目 </el-button>
            <el-button v-if="scope.row.changeAction === 2" size="medium" type="danger" @click="fetchProblemById(scope.row.originalProblemId)"> 题目信息 </el-button>
            <el-button v-if="scope.row.changeAction === 3" size="medium" @click="fetchProblemById(scope.row.editProblemId)"> 改后题目 </el-button>
            <el-button type="primary" size="medium" @click="jump(scope.row.originalProblemId)"> 跳转至此题 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="insertTime" label="修改时间" width="220" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="medium" @click="openJudgeForm(scope.row.editRecordId, scope.row.originalProblemId, scope.row.editProblemId)"> 审批 </el-button>
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
          <el-button type="primary" @click="jump(detailedFormData.problemId)">跳转到此题</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 审批信息drawer -->
    <el-drawer
      title="审批信息"
      :visible.sync="judgeFormVisible"
      direction="rtl"
      size="50%"
      :before-close="closeJudgeForm"
    >
      <div class="demo-drawer__content">
        <el-form size="small" label-position="right" label-width="80px" style="margin-left: 3%; margin-right: 3%" inline>
          <el-form-item label="编号"> <el-input v-model="judgeFormData.editRecordId" /> </el-form-item>
          <el-form-item label="题目id"> <el-input v-model="judgeFormData.problemId" /> </el-form-item>
          <el-form-item label="题目"> <el-input type="textarea" v-model="judgeFormData.title" :rows="1" autosize/> </el-form-item>
          <el-form-item label="修改类型">
            <el-radio-group v-model="judgeFormData.changeAction">
              <el-radio :label="1"> 新增 </el-radio>
              <el-radio :label="2"> 删除 </el-radio>
              <el-radio :label="3"> 修改 </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-divider> <i class="el-icon-right" /> </el-divider>

          <!-- 新增行为 -->
          <el-row v-if="judgeFormData.changeAction === 1" :gutter="24">
            <el-col :span="12">
              <el-descriptions title="修改前" />
              <el-empty description="空" />
            </el-col>

            <el-col :span="12">
              <el-descriptions title="修改后" column="1">
                <el-descriptions-item label="标题">{{ oldProblem.title }}</el-descriptions-item>
                <el-descriptions-item label="内容">{{ oldProblem.content }}</el-descriptions-item>
                <el-descriptions-item label="类型">
                  <el-tag v-if="oldProblem.type === 1" type="success" size="small"> SQL </el-tag>
                  <el-tag v-if="oldProblem.type === 2" type="warning" size="small"> 高级语言 </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="难度">
                  <el-tag v-if="oldProblem.difficulty === 1" type="success" size="small">easy</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 2" type="warning" size="small">medium</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 3" type="danger" size="small">hard</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="运行时间限制">{{ oldProblem.runtimeLimit }}</el-descriptions-item>
                <el-descriptions-item label="内存限制">{{ oldProblem.memoryLimit }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>

          <!-- 删除行为 -->
          <el-row v-if="judgeFormData.changeAction === 2" :gutter="24">
            <el-col :span="12">
              <el-descriptions title="修改前" column="1">
                <el-descriptions-item label="标题">{{ oldProblem.title }}</el-descriptions-item>
                <el-descriptions-item label="内容">{{ oldProblem.content }}</el-descriptions-item>
                <el-descriptions-item label="类型">
                  <el-tag v-if="oldProblem.type === 1" type="success" size="small"> SQL </el-tag>
                  <el-tag v-if="oldProblem.type === 2" type="warning" size="small"> 高级语言 </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="难度">
                  <el-tag v-if="oldProblem.difficulty === 1" type="success" size="small">easy</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 2" type="warning" size="small">medium</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 3" type="danger" size="small">hard</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="运行时间限制">{{ oldProblem.runtimeLimit }}</el-descriptions-item>
                <el-descriptions-item label="内存限制">{{ oldProblem.memoryLimit }}</el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="12">
              <el-descriptions title="修改后" />
              <el-empty description="空" />
            </el-col>
          </el-row>

          <!-- 修改行为 -->
          <el-row v-if="judgeFormData.changeAction === 3" :gutter="24">
            <el-col :span="12">
              <el-descriptions title="修改前" column="1">
                <el-descriptions-item label="标题">{{ oldProblem.title }}</el-descriptions-item>
                <el-descriptions-item label="内容">{{ oldProblem.content }}</el-descriptions-item>
                <el-descriptions-item label="类型">
                  <el-tag v-if="oldProblem.type === 1" type="success" size="small"> SQL </el-tag>
                  <el-tag v-if="oldProblem.type === 2" type="warning" size="small"> 高级语言 </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="难度">
                  <el-tag v-if="oldProblem.difficulty === 1" type="success" size="small">easy</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 2" type="warning" size="small">medium</el-tag>
                  <el-tag v-if="oldProblem.difficulty === 3" type="danger" size="small">hard</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="运行时间限制">{{ oldProblem.runtimeLimit }}</el-descriptions-item>
                <el-descriptions-item label="内存限制">{{ oldProblem.memoryLimit }}</el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="12">
              <el-descriptions title="修改后" column="1">
                <el-descriptions-item label="标题">{{ newProblem.title }}</el-descriptions-item>
                <el-descriptions-item label="内容">{{ newProblem.content }}</el-descriptions-item>
                <el-descriptions-item label="类型">
                  <el-tag v-if="newProblem.type === 1" type="success" size="small"> SQL </el-tag>
                  <el-tag v-if="newProblem.type === 2" type="warning" size="small"> 高级语言 </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="难度">
                  <el-tag v-if="newProblem.difficulty === 1" type="success" size="small">easy</el-tag>
                  <el-tag v-if="newProblem.difficulty === 2" type="warning" size="small">medium</el-tag>
                  <el-tag v-if="newProblem.difficulty === 3" type="danger" size="small">hard</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="运行时间限制">{{ newProblem.runtimeLimit }}</el-descriptions-item>
                <el-descriptions-item label="内存限制">{{ newProblem.memoryLimit }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-form>

        <br>
        <div class="demo-drawer__footer" style="margin-left: 3%">
          <el-button type="danger" @click="judgeConfirm(judgeFormData.editRecordId, false)">不予通过</el-button>
          <el-button type="success" @click="judgeConfirm(judgeFormData.editRecordId, true)">审核通过</el-button>
          <el-button @click="closeJudgeForm">取消</el-button>
        </div>

        <br>
        <div style="margin-left: 3%; margin-right: 2%">
          <el-input
            v-model="verifyMessage"
            type="textarea"
            rows="2"
            autosize
            placeholder="审核评语"
          />
        </div>

      </div>
    </el-drawer>

  </div>
</template>

<script>
import { audit, getById, getPage } from '@/api/problem/problem-audit'
import { getByIdAdmin as getProblemById } from '@/api/problem/problem'

export default {
  data() {
    return {
      searchTitle: '',
      searchTag: '',
      changeAction: '',

      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 5,

      detailedFormData: {}, // 问题详细信息表单数据
      detailedFormVisible: false, // 问题详细信息表单可见度

      judgeFormData: {}, // 修改信息表单数据
      judgeFormVisible: false, // 修改信息表单可见度

      oldProblem: {}, // 旧问题
      newProblem: {}, // 修改后的问题
      verifyMessage: '' // 审核评语
    }
  },
  created() {
    this.fetchData()
    console.log(this.roles[0])

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
    judgeFormClear() {
      this.judgeFormData = {}
      this.verifyMessage = ''
    },

    // 关闭审批drawer
    closeJudgeForm(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.judgeFormVisible = false
          done()
        })
        .catch(_ => {})
    },

    // 获取全部数据
    fetchData() {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.searchTitle,
        tag: this.searchTag,
        changeAction: this.changeAction
      }
      getPage(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
        } else { this.$message.error(response.message) }
      })
    },

    // 获取id对应问题的详细信息
    fetchProblemById(problemId) {
      this.detailedFormData = {}
      getProblemById(problemId).then(response => {
        if (response.success === true) {
          this.detailedFormVisible = true
          this.detailedFormData = response.data.problem
        } else { this.$message.error(response.message) }
      })
    },

    // 跳转到题目
    jump(problemId) {
      this.$router.push({
        path: '/problem_set/problem',
        query: {
          problemId: problemId
        }
      })
    },

    // 打开审批窗口
    openJudgeForm(editRecordId, originalProblemId, editProblemId) {
      this.judgeFormClear()
      this.judgeFormVisible = true
      // 先获取修改记录基本信息 再获取修改后的问题与修改前的问题
      getById(editRecordId).then(response => {
        if (response.success === true) {
          this.judgeFormVisible = true
          this.judgeFormData = response.data.editRecord
        } else { this.$message.error(response.message) }
      })
      getProblemById(originalProblemId).then(response => {
        if (response.success === true) {
          this.oldProblem = response.data.problem
        } else { this.$message.error(response.message) }
      })
      if (editProblemId !== null) {
        getProblemById(editProblemId).then(response => {
          if (response.success === true) {
            this.newProblem = response.data.problem
          } else {
            this.$message.error(response.message)
          }
        })
      }
    },

    // 确认审批
    judgeConfirm(editRecordId, result) {
      const params = {
        auditResult: result,
        verifyMessage: this.verifyMessage
      }
      audit(params, editRecordId).then(response => {
        if (response.success === true) {
          if (result === true) {
            this.$message.success('审批完成: 通过')
          } else { this.$message.success('审批完成: 不通过') }
          this.judgeFormVisible = false
        } else { this.$message.error(response.message) }
      }).finally(() => {
        this.fetchData()
      })
    }

  }
}
</script>
