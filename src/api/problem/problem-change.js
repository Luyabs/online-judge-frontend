import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/vue-admin-template/problem_change/page',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/vue-admin-template/problem_change/${id}`,
    method: 'get'
  })
}

