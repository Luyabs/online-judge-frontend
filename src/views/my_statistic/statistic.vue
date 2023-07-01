<template>
  <div>
    <div style="margin-top: 40px">
      <el-row :gutter="24">
        <el-col :span="5">
          <el-statistic title="总提交次数">
            <template slot="prefix"> <i class="el-icon-upload" style="color: cornflowerblue" /> </template>
            <template slot="formatter"> {{ formData.totalSubmissionCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="提交通过数">
            <template slot="prefix"> <i class="el-icon-s-claim" style="color: goldenrod" /> </template>
            <template slot="formatter"> {{ formData.passedSubmissionCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="总尝试问题数">
            <template slot="prefix"> <i class="el-icon-question" style="color: cadetblue" /> </template>
            <template slot="formatter"> {{ formData.totalProblemCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="总完成问题数">
            <template slot="prefix"> <i class="el-icon-success" style="color: lightsalmon" /> </template>
            <template slot="formatter"> {{ formData.passedProblemCount }} </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 100px">
      <el-row :gutter="24">
        <el-col :span="7">
          <el-statistic title="通过简单题数">
            <template slot="prefix"> <i class="el-icon-star-on" style="color: lightsalmon" /> </template>
            <template slot="formatter"> {{ formData.proNumbyDiff.easyCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="通过困难题数">
            <template slot="prefix"> <i class="el-icon-star-on" style="color: gold" /> </template>
            <template slot="prefix"> <i class="el-icon-star-on" style="color: gold" /> </template>
            <template slot="prefix"> <i class="el-icon-star-on" style="color: gold" /> </template>
            <template slot="formatter"> {{ formData.proNumbyDiff.hardCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="通过中等题数">
            <template slot="prefix"> <i class="el-icon-star-on" style="color: lightgreen" /> </template>
            <template slot="prefix"> <i class="el-icon-star-on" style="color: lightgreen" /> </template>
            <template slot="formatter"> {{ formData.proNumbyDiff.mediumCount }} </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 100px">
      <el-row :gutter="24">
        <el-col :span="11">
          <el-statistic title="通过SQL题数">
            <template slot="prefix"> <i class="el-icon-s-grid" style="color: rosybrown" /> </template>
            <template slot="formatter"> {{ formData.proNumbyType.sqlCount }} </template>
          </el-statistic>
        </el-col>
        <el-col :span="11">
          <el-statistic title="通过高级语言题数">
            <template slot="prefix"> <i class="el-icon-s-opportunity" style="color: wheat" /> </template>
            <template slot="formatter"> {{ formData.proNumbyType.javaCount }} </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>


    <div style="margin-top: 40px">
      <el-row>
        <el-col :span="22">
          <el-result icon="success" title="">
            <template slot="extra">
              <el-tag type="primary" plain>再接再厉</el-tag>
            </template>
          </el-result>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { statistic } from '@/api/statistic/statistic'

export default {
  data() {
    return {
      formData: {},
      passRate: 0.0
    }
  },
  created() {
    this.getStatistic()
  },
  methods: {
    // 获取统计信息
    getStatistic() {
      statistic().then(response => {
        this.formData = response.data.statistic
      })
    }
  }
}
</script>

<style lang="scss">
.like {
  cursor: pointer;
  font-size: 50px;
  display: inline-block;
}
</style>
