import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/audit/page',
    method: 'get',
    params
  })
}

export function getById(editRecordId) {
  return request({
    url: `/audit/${editRecordId}`,
    method: 'get'
  })
}

export function audit(params, editRecordId) {
  return request({
    url: `/audit/${editRecordId}`,
    method: 'get',
    params
  })
}

