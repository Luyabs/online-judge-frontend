const Mock = require('mockjs')

const data = Mock.mock({
  'changes|50': [{

    changeId: '@integer(1, 65536)',
    problemId: '@integer(1, 65536)',
    problemName: '@sentence(1, 8)',
    'changeType|1': ['UPDATE', 'INSERT', 'DELETE'],
    changeContent: '@sentence(15, 100)',
    oldContent: '@sentence(0, 100)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/problem_change/page',
    type: 'get',
    response: config => {
      const params = config.query
      const changes = data.changes
      return {
        success: true,
        code: 20000,
        data: {
          total: changes.length,
          pageSize: params.pageSize,
          currentPage: params.currentPage,
          page: {
            changes: changes.slice((params.currentPage - 1) * params.pageSize, params.currentPage * params.pageSize)
          }
        }
      }
    }
  }, {
    url: '/vue-admin-template/problem_change/\.*',
    type: 'get',
    response: config => {
      const changeId = config.url.match(/\/vue-admin-template\/problem_change\/(.*)/)[1]
      const changes = data.changes
      for (const change of changes) {
        if (change.changeId.toString() === changeId.toString()) {
          return {
            success: true,
            code: 20000,
            data: {
              'change': change
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
