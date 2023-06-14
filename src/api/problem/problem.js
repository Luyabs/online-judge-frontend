import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/problem/page',
    method: 'get',
    params
  })
}

export function getById(problemId) {
  return request({
    url: `/problem/${problemId}`,
    method: 'get'
  })
}

export function getMyUpload(params) {
  return request({
    url: `/problem/my_upload`,
    method: 'get',
    params
  })
}

