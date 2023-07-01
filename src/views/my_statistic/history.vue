<template>
  <div>
    <!-- 表格 -->
    <div style="margin-top: 10px;">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <!-- <el-table-column type="index" width="30" align="center"> </el-table-column>-->
        <el-table-column prop="submissionId" label="编号" width="98" align="center" />
        <el-table-column prop="problemId" label="问题编号" width="98" />
        <el-table-column prop="insertTime" label="完成时间" width="180" />
        <el-table-column label="成功" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isSuccess === true" type="success" plain> 通过 </el-tag>
            <el-tag v-if="scope.row.isSuccess === false" type="warning" plain> 失败 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="详情" width="680">
          <template slot-scope="scope">
            <p v-if="scope.row.isSuccess === true"> 运行时间 {{ scope.row.runtime }} ms </p>
            <p v-if="scope.row.isSuccess === false"> {{ scope.row.errorType }} </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="medium" @click="enjoy(scope.row.problemId)"> 前往此题 </el-button>
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

  </div>
</template>

<script>
import { submission } from '@/api/statistic/statistic'

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,

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
        pageSize: this.pageSize
      }
      submission(params).then(response => {
        if (response.success === true) {
          this.tableData = response.data.page.records
          this.total = response.data.page.total
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
