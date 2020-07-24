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

export function getOfficeTimeList(params) {
  return request({
    url: '/reservation/officeTime/getOfficeTimeList/' + params,
    method: 'post'
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/workScheduleRule/listPage',
    method: 'post',
    data: params
  })
}

export function getUnUseCount(params) {
  return request({
    url: '/reservation/workScheduleRule/getUnUseCount',
    method: 'post',
    data: params
  })
}

export function deleteWorkScheduleRule(params) {
  return request({
    url: '/reservation/workScheduleRule/deleteWorkScheduleRule/' + params,
    method: 'post'
  })
}

export function saveWorkScheduleRule(params) {
  return request({
    url: '/reservation/workScheduleRule/saveWorkScheduleRule',
    method: 'post',
    data: params
  })
}

export function batchSaveWorkScheduleRule(params) {
  return request({
    url: '/reservation/workScheduleRule/batchSaveWorkScheduleRule',
    method: 'post',
    data: params
  })
}

export function updateWorkScheduleRule(params) {
  return request({
    url: '/reservation/workScheduleRule/updateWorkScheduleRule',
    method: 'post',
    data: params
  })
}

