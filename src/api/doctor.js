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

export function doctorListPage(params) {
  return request({
    url: '/reservation/reservation/doctorListPage',
    method: 'post',
    data: params
  })
}
export function feachDataPage(params) {
  return request({
    url: '/reservation/reservation/doctorListPage',
    method: 'post',
    data: params
  })
}

export function listPage(params) {
  return request({
    url: '/reservation/reservation/listPageWithCall',
    method: 'post',
    data: params
  })
}

export function feachListPgae(params) {
  return request({
    url: '/reservation/reservation/listPageWithStatus',
    method: 'post',
    data: params
  })
}

export function doctorCall(params) {
  return request({
    url: '/reservation/reservation/call',
    method: 'post',
    data: params
  })
}

export function sequenceSign(params) {
  return request({
    url: '/reservation/reservation/sequenceSign',
    method: 'post',
    data: params
  })
}

export function hangUp(params) {
  return request({
    url: '/reservation/reservation/hangUp',
    method: 'post',
    data: params
  })
}

export function revoke(params) {
  return request({
    url: '/reservation/reservation/revoke',
    method: 'post',
    data: params
  })
}

export function doComplete(params) {
  return request({
    url: '/reservation/reservation/complete',
    method: 'post',
    data: params
  })
}

