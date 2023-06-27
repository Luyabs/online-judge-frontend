import request from '@/utils/request'
import md5 from 'md5'

export function login(data) {
  data.password = md5(data.password)
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function register(data) {
  data.password = md5(data.password)
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getPage(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}

export function getById(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function reverseBan(id) {
  return request({
    url: `/user/ban/${id}`,
    method: 'post'
  })
}
