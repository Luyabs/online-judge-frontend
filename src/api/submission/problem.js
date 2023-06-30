import request from '@/utils/request'

export function submitAnswer(data) {
  return request({
    url: '/submission',
    method: 'post',
    data
  })
}

