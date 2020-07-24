import request from '@/utils/request'

export function getDepartmentInfos() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/order/listPage',
    method: 'post',
    data: params
  })
}

export function querySummary(params) {
  return request({
    url: '/reservation/order/querySummary',
    method: 'post',
    data: params
  })
}

