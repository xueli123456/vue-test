import request from '@/utils/request'

export function getDepartment() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getSourcePoolList(params) {
  return request({
    url: '/reservation/sourcePool/getSourcePoolList/' + params,
    method: 'post'
  })
}

export function queryCurrentSourceNum(params) {
  return request({
    url: '/reservation/workScheduleRule/queryCurrentSourceNum',
    method: 'post',
    data: params
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/workScheduleRule/listScheduleInfo',
    method: 'post',
    data: params
  })
}

export function listPageDetail(params) {
  return request({
    url: '/reservation/workScheduleRule/listScheduleDetail',
    method: 'post',
    data: params
  })
}
