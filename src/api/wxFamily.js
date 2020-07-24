import request from '@/utils/request'
export function queryList(params) {
  return request({
    url: '/api/wxFamily/queryList',
    method: 'post',
    data: params
  })
}

export function deleteUser(params) {
  return request({
    url: '/api/wxFamily/delete/' + params,
    method: 'post'
  })
}

export function modifyUser(params) {
  return request({
    url: '/api/wxFamily/modifyFamily',
    method: 'post',
    data: params
  })
}

