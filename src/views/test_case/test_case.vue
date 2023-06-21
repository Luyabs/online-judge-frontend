<template>
  <div>
    <h1>problemId: {{ problemId }}</h1>
    <el-empty description="还没做" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      problemId: 0
    }
  },
  created() {
    this.problemId = this.$route.query.problemId
  }
}
</script>
