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

export function getOfficeTimeList(params) {
  return request({
    url: '/reservation/officeTime/getOfficeTimeList/' + params,
    method: 'post'
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/applicationForm/listPage',
    method: 'post',
    data: params
  })
}

export function handleApplicationForm(params) {
  return request({
    url: '/reservation/applicationForm/handleApplicationForm',
    method: 'post',
    data: params
  })
}

export function queryBloodCollectionDetails(params) {
  return request({
    url: '/reservation/applicationForm/queryBloodCollectionDetails/' + params,
    method: 'post'
  })
}

export function queryApplicationForm(params) {
  return request({
    url: '/reservation/applicationForm/queryApplicationFormByPatientIdCard',
    method: 'post',
    data: params
  })
}

export function queryPatientInfo(params) {
  return request({
    url: '/reservation/applicationForm/queryPatientInfo/' + params,
    method: 'post'
  })
}

export function emergencyDeduction(params) {
  return request({
    url: '/reservation/applicationForm/emergencyDeduction',
    method: 'post',
    data: params
  })
}


