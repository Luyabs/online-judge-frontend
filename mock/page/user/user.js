const Mock = require('mockjs')

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    id: 1234567890,
    username: 'saidhsaodasd',
    description: 'sadadsadasdas'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const data = Mock.mock({
  'users|100': [{
    userId: '@integer(1, 65536)',
    roles: '@sentence(1, 2)',
    username: '@sentence(1, 5)',
    introduction: '@sentence(0, 8)',
    tag: '@sentence(1, 4)',
    'banStatus|1': [true, false]
  }]
})

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          success: false,
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        success: true,
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          success: false,
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        success: true,
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        success: true,
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/user/page',
    type: 'get',
    response: config => {
      const params = config.query
      const users = data.users
      return {
        success: true,
        code: 20000,
        data: {
          total: users.length,
          pageSize: params.pageSize,
          currentPage: params.currentPage,
          page: {
            users: users.slice((params.currentPage - 1) * params.pageSize, params.currentPage * params.pageSize)
          }
        }
      }
    }
  },

  {
    url: '/vue-admin-template/user/\.*',
    type: 'get',
    response: config => {
      const userId = config.url.match(/\/vue-admin-template\/user\/(.*)/)[1]
      const users = data.users
      for (const user of users) {
        if (user.userId.toString() === userId.toString()) {
          return {
            success: true,
            code: 20000,
            data: {
              'user': user
            }
          }
        }
      }
    }
  }
]
