import request from '@/utils/request'

export function getListPage(params) {
  return request({
    url: '/msg/tempRegist/findPage',
    method: 'post',
    data: params
  })
}
// /msg/tempRegist/replaceDoctor
export function replaceDoctor(params) {
  return request({
    url: '/msg/tempRegist/replaceDoctor',
    method: 'post',
    data: params
  })
}
