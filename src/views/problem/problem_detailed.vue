<template>
  <div>
    <!-- 搜索框 与 新增 -->
    <div>
      <el-row>
        <!-- 左半边 -->
        <el-col :span="14" style="margin-top: 20px; margin-left: 20px;">
          <el-descriptions title="垂直带边框列表" direction="vertical" :column="4" border>
            <el-descriptions-item label="编号">{{ descriptionData.problemId }}</el-descriptions-item>
            <el-descriptions-item label="标题">{{ descriptionData.title }}</el-descriptions-item>
            <el-descriptions-item label="类型">
              <el-button v-if="descriptionData.type === 1" size="small" type="success" plain> SQL </el-button>
              <el-button v-if="descriptionData.type === 2" size="small" type="warning" plain> 高级语言 </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="难度">
              <el-button v-if="descriptionData.difficulty === 1" size="small" type="success" plain> easy </el-button>
              <el-button v-if="descriptionData.difficulty === 2" size="small" type="warning" plain> medium </el-button>
              <el-button v-if="descriptionData.difficulty === 3" size="small" type="danger" plain> hard </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="内容">{{ descriptionData.content }}</el-descriptions-item>
          </el-descriptions>

          <br/>
          <el-descriptions v-if="language" title="注意事项" direction="vertical" :column="1" border>
            <el-descriptions-item v-if="descriptionData.type === 1" label="注意事项">
              SQL题只能提交一条语句
            </el-descriptions-item>
            <el-descriptions-item v-if="descriptionData.type === 2 && language === '2'" label="注意事项">
              使用Java解答时，你需要提交必须包含一个public class，且有唯一public static void main方法的类，类中其他方法均限制为static。你不能且无须import任何包，以下包将被自动导入：java.lang, java.util, java.math, java.text。 <br>
              执行用例时，会通过java __classname__ 参数1 参数2 参数3的方式执行，因此实际运行时，都是通过main方法上的String[] args接收到测试用例的输入参数，请务必使用args <br>
              代码示例: <br>
              public class HelloWorld { <br>
              public static int add(int a, int b, int c) { <br>
              return a + b + c; <br>
              } <br>
              <br>
              public static void main(String[] args) { <br>
              // get param from args <br>
              int a = Integer.parseInt(args[0]); <br>
              int b = Integer.parseInt(args[1]); <br>
              int c = Integer.parseInt(args[2]); <br>
              int res = add(a, b, c); <br>
              System.out.println(res); <br>
              } <br>
              } <br>
              此题用例示例: <br>
              1 <br>
              2 <br>
              3 <br>
              输出: <br>
              6 <br>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>

        <!-- 右半边 -->
        <el-col :span="8" style="margin-top: 20px; margin-left: 20px;">
          <!-- 语言选择框-->
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="language" placeholder="请选择语言">
                <el-option v-if="descriptionData.type === 1" value="1" label="MySQL" />
                <el-option v-if="descriptionData.type === 1" value="5" label="PostgresSQL" disabled />

                <el-option v-if="descriptionData.type === 2" value="2" label="Java" />
                <el-option v-if="descriptionData.type === 2" value="3" label="C++" disabled />
                <el-option v-if="descriptionData.type === 2" value="4" label="Python" disabled />
              </el-select>
            </el-col>
            <el-col :span="4"> <el-button size="warning" @click="commit(true)"> 调试 </el-button> </el-col>
            <el-col :span="4"> <el-button size="success" @click="commit(false)"> 提交 </el-button> </el-col>
          </el-row>
          <hr>

          <!-- 输入框 -->
          <el-input
            v-model="textarea"
            type="textarea"
            :rows="15"
            placeholder="请输入代码"
          />

          <!-- 运行结果 -->
          <el-input
            v-model="resultTextArea"
            type="textarea"
            :rows="3"
            autosize
            disabled
          />

        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { getById } from '@/api/problem/problem'
import lastProblemId from '@/store/modules/last-problem-id'
import { mapGetters } from 'vuex'
import store from '@/store'
import { submitAnswer } from '@/api/submission/problem'

export default {
  data() {
    return {
      problemId: 0,
      language: '', // 选择语言
      textarea: '', // 语句输入框
      resultTextArea: '提交后查看运行结果', // 运行结果框

      descriptionData: {} // 描述框数据
    }
  },
  computed: {
    ...mapGetters([
      'last_problem_id'
    ])
  },
  created() {
    this.problemId = this.$route.query.problemId
    this.fetchDataById(this.problemId)
    this.setDefaultCode()
  },
  methods: {
    // 获取id对应数据的详细信息
    fetchDataById(problemId) {
      if (problemId == null && lastProblemId.state.problemId !== null && lastProblemId.state.problemId !== -1) { // 如果 vuex里有记忆上一题id 则调用此id
        problemId = lastProblemId.state.problemId
      }
      if (problemId == null) {
        this.$notify({
          title: '提醒',
          message: this.$createElement('i', { style: 'color: teal' }, '需要先指定题目id')
        })
        this.$router.push('/problem_set/all')
        return
      }
      getById(problemId).then(response => {
        if (response.success === true) {
          this.descriptionData = response.data.problem
        } else {
          this.$message.error(response.message)
        }
      })
      store.dispatch('lastProblemId/setProblemId', problemId) // vuex 最后记忆当前问题id
    },
    setDefaultCode() {
      this.language = '2'
      if (this.textarea === '' && this.language === '2') {
        this.textarea = 'public class HelloWorld {\n' +
          '\tpublic static Object ' + this.descriptionData.title + '(Object object) {\n' +
          '\n\n\t}\n' +
          '\n\tpublic static void main(String[] args) {\n' +
          '\n\n\t}\n' +
          '}'
      }
    },
    commit(isDebug) {
      const json = {
        code: this.textarea,
        isDebug: isDebug,
        language: this.language,
        problemId: this.descriptionData.problemId
      }
      const loading = this.$loading({
        lock: true,
        text: '判题中, 请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      submitAnswer(json).then(response => {
        if (response.success === true) {
          const result = response.data.submission
          if (result.isSuccess) {
            this.resultTextArea = '[运行成功]\n' + result.runtime + 'ms\n[运行结果]\n' + result.codeResult
            this.$message.success('运行成功' + '\n' + result.runtime + 'ms')
          } else {
            this.resultTextArea = '[运行失败]\n' + result.errorType + '\n[运行结果]\n' + result.codeResult
            this.$message.error('运行失败' + '\n' + result.errorType)
          }
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>
