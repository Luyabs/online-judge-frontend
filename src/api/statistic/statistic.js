import request from '@/utils/request'

export function statistic() {
  return request({
    url: '/user/statistic',
    method: 'get'
  })
}

export function submission(params) {
  return request({
    url: '/user/submission',
    method: 'get',
    params
  })
}

