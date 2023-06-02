const Mock = require('mockjs')

const data = Mock.mock({
  'problems|50': [{
    // date: '@datetime',
    // id: '@id',
    problemId: '@integer(1, 65536)',
    'completionStatus|1': ['已完成', '尝试中', '未完成', '已完成', '未完成'],
    title: '@sentence(10, 20)',
    problemName: '@sentence(1, 8)',
    'type|1': ['SQL', 'VAJA', 'D++'],
    'tag|1': ['ORDER BY', 'GROUP BY', 'JOIN', 'FUNCTION', 'INSERT', 'DELETE', 'UPDATE'],
    solution: '@integer(0, 65536)',
    passPossibility: '@integer(1, 100).@integer(0,99)%',
    'level|1': ['EZ', 'MEDIUM', 'CRAZY'],
    content: '@sentence(15, 100)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/problem/hello',
    type: 'get',
    response: config => {
      return {
        success: true,
        code: 20000,
        data: {
          'hello': 'hello world'
        }
      }
    }
  }, {
    url: '/vue-admin-template/problem/page',
    type: 'get',
    response: config => {
      const params = config.query
      const problems = data.problems
      return {
        success: true,
        code: 20000,
        data: {
          total: problems.length,
          pageSize: params.pageSize,
          currentPage: params.currentPage,
          page: {
            problems: problems.slice((params.currentPage - 1) * params.pageSize, params.currentPage * params.pageSize)
          }
        }
      }
    }
  }, {
    url: '/vue-admin-template/problem/\.*',
    type: 'get',
    response: config => {
      const problemId = config.url.match(/\/vue-admin-template\/problem\/(.*)/)[1];
      const problems = data.problems
      for (const problem of problems) {
        if (problem.problemId.toString() === problemId.toString()) {
          return {
            success: true,
            code: 20000,
            data: {
              'problem': problem
            }
          }
        }
      }
      return {
        success: false,
        code: 20001,
        message: 'no such id'
      }
    }
  }
]
