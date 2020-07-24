import request from '@/utils/request'
export function getProjectList() {
  return request({
    url: '/reservation/thirdProject/getAllProjectList',
    method: 'post'
  })
}

export function queryList(params) {
  return request({
    url: '/reservation/thirdProject/listPage',
    method: 'post',
    data: params
  })
}

export function deleteProject(params) {
  return request({
    url: '/reservation/thirdProject/delete/' + params,
    method: 'post'
  })
}

export function modifyProject(params) {
  return request({
    url: '/reservation/thirdProject/modifyProject',
    method: 'post',
    data: params
  })
}

export function saveProject(params) {
  return request({
    url: '/reservation/thirdProject/saveProject',
    method: 'post',
    data: params
  })
}
