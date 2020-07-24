import request from '@/utils/request'

export function getTaskTypeList(params) {
  return request({
    url: '/auth/dict/getChildrenByCode/' + params,
    method: 'post'
  })
}

export function getListPage(params) {
  return request({
    url: '/reservation/worker/listPage',
    method: 'post',
    data: params
  })
}

export function retryWorker(params) {
  return request({
    url: '/reservation/worker/retry/' + params,
    method: 'post'
  })
}

