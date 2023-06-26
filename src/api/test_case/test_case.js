import request from '@/utils/request'

export function getPageByProblemId(params, problemId) {
  return request({
    url: `/problem/page/test_case/${problemId}`,
    method: 'get',
    params
  })
}

export function getById(testCaseId) {
  return request({
    url: `/test_case/${testCaseId}`,
    method: 'get'
  })
}

export function upload(data) {
  return request({
    url: '/test_case/my_upload',
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: '/test_case/my_upload',
    method: 'put',
    data
  })
}

export function remove(testCaseId) {
  return request({
    url: `/test_case/my_upload/${testCaseId}`,
    method: 'delete'
  })
}

