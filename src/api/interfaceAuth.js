import request from '@/utils/request'

export function getDepartmentInfos() {
  return request({
    url: '/auth/office/getHasPerssionDeprtment',
    method: 'post'
  })
}

export function getListPage(params) {
  return request({
    url: '/reservation/interfaceRole/listPage',
    method: 'post',
    data: params
  })
}

export function saveInterfacer(params) {
  return request({
    url: '/reservation/interfaceRole/saveInterfaceInfo',
    method: 'post',
    data: params
  })
}

export function updateInterfacer(params) {
  return request({
    url: '/reservation/interfaceRole/modifyInterfaceInfo',
    method: 'post',
    data: params
  })
}

export function deleteInterface(params) {
  return request({
    url: '/reservation/interfaceRole/delete/' + params,
    method: 'post'
  })
}

export function getProjectList() {
  return request({
    url: '/reservation/thirdProject/getAllProjectList',
    method: 'post'
  })
}

export function getInterfaceList() {
  return request({
    url: '/reservation/interfaceInfo/getAllInterfaceList',
    method: 'post'
  })
}

