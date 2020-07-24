import request from '@/utils/request'

export function getListPage(params) {
  return request({
    url: '/api/preHospital/listPage',
    method: 'post',
    data: params
  })
}

