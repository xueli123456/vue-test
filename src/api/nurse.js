import request from '@/utils/request'

export function getDepartment() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getRoomList(params) {
  return request({
    url: '/auth/office/getRoomList/' + params,
    method: 'post'
  })
}

export function getSourcePoolList(params) {
  return request({
    url: '/reservation/sourcePool/getSourcePoolList/' + params,
    method: 'post'
  })
}

export function getCurrentSourceNum(params) {
  return request({
    url: '/reservation/reservation/getCurrentSourceNum',
    method: 'post',
    data: params
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/reservation/nurseListPage',
    method: 'post',
    data: params
  })
}

export function getAllDoctorList() {
  return request({
    url: '/auth/workPeople/getAllDoctorList',
    method: 'post'
  })
}

export function getWorkScheduleRuleList(params) {
  return request({
    url: '/reservation/reservation/queryWorkScheduleRuleList',
    method: 'post',
    data: params
  })
}

export function nurseSignUp(params) {
  return request({
    url: '/reservation/reservation/nurseSignUp',
    method: 'post',
    data: params
  })
}
export function revision(params) {
  return request({
    url: '/reservation/reservation/revision',
    method: 'post',
    data: params
  })
}

export function withdrawalContract(params) {
  return request({
    url: '/reservation/reservation/withdrawalContract',
    method: 'post',
    data: params
  })
}

export function getOfficeTimeList(params) {
  return request({
    url: '/reservation/officeTime/getOfficeTimeList/' + params,
    method: 'post'
  })
}

export function generageCode(params) {
  return request({
    url: '/reservation/reservation/createCode/' + params,
    method: 'post'
  })
}

export function revoke(params) {
  return request({
    url: '/reservation/reservation/revoke',
    method: 'post',
    data: params
  })
}

export function queryApplicationForm(params) {
  return request({
    url: '/reservation/reservation/queryApplicationFormByPatientIdCard',
    method: 'post',
    data: params
  })
}

export function queryPatientInfo(params) {
  return request({
    url: '/reservation/reservation/queryPatientInfo/' + params,
    method: 'post'
  })
}

export function emergencyDeduction(params) {
  return request({
    url: '/reservation/reservation/emergencyDeduction',
    method: 'post',
    data: params
  })
}
