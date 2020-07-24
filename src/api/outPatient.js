import request from '@/utils/request'

export function getPatientAndInspectInfo(params) {
  return request({
    url: '/reservation/reservation/queryPatientAndInspectInfoByApplicationId/' + params,
    method: 'post'
  })
}

export function getSourcePoolList(params) {
  return request({
    url: '/reservation/reservation/queryWorkScheduleRuleListByMedicalType',
    method: 'post',
    data: params
  })
}

export function saveReservationInfo(params) {
  return request({
    url: '/reservation/reservation/saveReservationInfo',
    method: 'post',
    data: params
  })
}

