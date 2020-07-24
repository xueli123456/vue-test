import request from '@/utils/request'

export function getMedicalTypeList(params) {
  return request({
    url: '/reservation/medicalType/getMedicalTypeList/' + params,
    method: 'post',
    data: params
  })
}

export function getDepartmentInfos() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getListPage(params) {
  return request({
    url: '/reservation/reservation/queryReservationList',
    method: 'post',
    data: params
  })
}

export function saveInterfacer(params) {
  return request({
    url: '/reservation/interfaceInfo/saveInterfaceInfo',
    method: 'post',
    data: params
  })
}

export function updateInterfacer(params) {
  return request({
    url: '/reservation/interfaceInfo/modifyInterfaceInfo',
    method: 'post',
    data: params
  })
}

export function deleteInterface(params) {
  return request({
    url: '/reservation/interfaceInfo/delete/' + params,
    method: 'post'
  })
}

export function viewLog(params) {
  return request({
    url: '/reservation/reservation/queryReservationLog/' + params,
    method: 'post'
  })
}


