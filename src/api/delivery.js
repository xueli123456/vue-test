import request from '@/utils/request'

export function getListPage(params) {
  return request({
    url: '/auth/role/listPage',
    method: 'post',
    data: params
  })
}

export function getDepartment() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getAllDoctorList() {
  return request({
    url: '/auth/workPeople/getAllDoctorList',
    method: 'post'
  })
}

