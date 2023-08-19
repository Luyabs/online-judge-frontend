import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/problem/page',
    method: 'get',
    params
  })
}

export function getPageInAdmin(params) {
  return request({
    url: '/problem/admin/page',
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

export function getByIdAdmin(problemId) {
  return request({
    url: `/problem/admin/${problemId}`,
    method: 'get'
  })
}

export function getMyUpload(params) {
  return request({
    url: '/problem/my_upload',
    method: 'get',
    params
  })
}

export function getVerifiedMessageById(editRecordId) {
  return request({
    url: `/audit/by_problem_id/${editRecordId}`,
    method: 'get'
  })
}

export function upload(data) {
  return request({
    url: '/problem/my_upload',
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: '/problem/my_upload',
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/problem/my_upload/${id}`,
    method: 'delete'
  })
}

