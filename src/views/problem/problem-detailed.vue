<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div>
      <el-row>
        <!-- 左半边 -->
        <el-col :span="14" style="margin-top: 20px; margin-left: 20px;">
          <el-descriptions title="垂直带边框列表" direction="vertical" :column="4" border>
            <el-descriptions-item label="编号">{{ descriptionData.problemId }}</el-descriptions-item>
            <el-descriptions-item label="完成状态">
              <el-button v-if="descriptionData.completionStatus === '已完成'" size="small" type="success">{{ descriptionData.completionStatus }}</el-button>
              <el-button v-if="descriptionData.completionStatus === '尝试中'" size="small" type="danger">{{ descriptionData.completionStatus }}</el-button>
              <el-button v-if="descriptionData.completionStatus === '未完成'" size="small" type="info">{{ descriptionData.completionStatus }}</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="题目">{{ descriptionData.problemName }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{ descriptionData.type }}</el-descriptions-item>
            <el-descriptions-item label="标签">{{ descriptionData.tag }}</el-descriptions-item>
            <el-descriptions-item label="题解">{{ descriptionData.solution }}</el-descriptions-item>
            <el-descriptions-item label="通过率">{{ descriptionData.passPossibility }}</el-descriptions-item>
            <el-descriptions-item label="难度">
              <el-button v-if="descriptionData.level === 'EZ'" size="small" type="success" plain>{{ descriptionData.level }}</el-button>
              <el-button v-if="descriptionData.level === 'MEDIUM'" size="small" type="warning" plain>{{ descriptionData.level }}</el-button>
              <el-button v-if="descriptionData.level === 'CRAZY'" size="small" type="danger" plain>{{ descriptionData.level }}</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="内容">{{ descriptionData.content }}</el-descriptions-item>
          </el-descriptions>
        </el-col>

        <!-- 右半边 -->
        <el-col :span="8" style="margin-top: 20px; margin-left: 20px;">
          <!-- 语言选择框-->
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="language" placeholder="请选择语言">
                <el-option label="SQL" value="sql" />
                <el-option label="JAVA" value="java" />
                <el-option label="C++" value="c++" />
              </el-select>
            </el-col>
            <el-col :span="4"> <el-button size="warning" @click="debug()"> 调试 </el-button> </el-col>
            <el-col :span="4"> <el-button size="success" @click="commit()"> 提交 </el-button> </el-col>
          </el-row>
          <hr>

          <!-- 输入框 -->
          <el-input
            v-model="textarea"
            type="textarea"
            :rows="23"
            placeholder="请输入内容"
          />

          <!-- 运行结果 -->
          <el-input
            v-model="resultTextArea"
            type="textarea"
            :rows="3"
            disabled>
          </el-input>

        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { getById } from '@/api/problem/problem'

export default {
  data() {
    return {
      problemId: 0,
      language: 'sql(default)', // 选择语言
      textarea: '', // 语句输入框
      resultTextArea: '提交后查看运行结果', // 运行结果框

      descriptionData: {} // 描述框数据
    }
  },
  created() {
    this.problemId = this.$route.query.problemId
    this.fetchDataById(this.problemId)
  },
  methods: {
    // 获取id对应数据的详细信息
    fetchDataById(problemId) {
      if (problemId == null) {
        this.$notify({
          title: '提醒',
          message: this.$createElement('i', { style: 'color: teal' }, '需要先指定题目id')
        })
        this.$router.push('/problem_set/all')
      }
      getById(problemId).then(response => {
        if (response.success === true) {
          this.descriptionData = response.data.problem
        } else {
          this.$message.error(response.message)
        }
      })
    },
    debug() {
      this.$message.success('调试: ' + this.language + ' ' + this.textarea)
      this.resultTextArea = '提交: ' + this.language + ' ' + this.textarea
      // TODO: 调试接口
    },
    commit() {
      this.$message.success('提交: ' + this.language + ' ' + this.textarea)
      this.resultTextArea = '提交: ' + this.language + ' ' + this.textarea
      // TODO: 提交接口
    }
  }
}
</script>
