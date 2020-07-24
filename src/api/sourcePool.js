import request from '@/utils/request'

export function getAlldepartmentList() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getMedicalTypeList(param) {
  return request({
    url: '/reservation/medicalType/getMedicalTypeList/' + param,
    method: 'post'
  })
}

export function getQueueList(param) {
  return request({
    url: '/reservation/queue/findQueueListByOfficeId/' + param,
    method: 'post'
  })
}

export function getSourcePoolList() {
  return request({
    url: '/reservation/sourcePool/getAllSourcePoolList',
    method: 'post'
  })
}

export function getListPage(params) {
  return request({
    url: '/reservation/sourcePool/listPage',
    method: 'post',
    data: params
  })
}

export function saveSourcePool(params) {
  return request({
    url: '/reservation/sourcePool/saveSourcePool',
    method: 'post',
    data: params
  })
}

export function updateSourcePool(params) {
  return request({
    url: '/reservation/sourcePool/modifySourcePool',
    method: 'post',
    data: params
  })
}

export function deleteSourcePool(params) {
  return request({
    url: '/reservation/sourcePool/delete/' + params,
    method: 'post'
  })
}

