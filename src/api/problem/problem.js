import request from '@/utils/request'

export function sayHello() {
  return request({
    url: '/vue-admin-template/problem/hello',
    method: 'get'
  })
}

export function getPage(params) {
  return request({
    url: '/vue-admin-template/problem/page',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/vue-admin-template/problem/${id}`,
    method: 'get'
  })
}

