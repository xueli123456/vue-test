import request from '@/utils/request'

export function listPage(params) {
  return request({
    url: '/reservation/rule/listPage',
    method: 'post',
    data: params
  })
}

export function deleteRuleById(params) {
  return request({
    url: '/reservation/rule/deleteRule/' + params,
    method: 'post'
  })
}

export function saveMergeRuleInfo(params) {
  return request({
    url: '/reservation/rule/saveRule',
    method: 'post',
    data: params
  })
}

export function modifyMergeRuleInfo(params) {
  return request({
    url: '/reservation/rule/modifyRule',
    method: 'post',
    data: params
  })
}

export function getChildrenByCode(params) {
  return request({
    url: '/auth/dict/getChildrenByCode/' + params,
    method: 'post'
  })
}

export function getRuleCode() {
  return request({
    url: '/auth/common/genNumStr',
    method: 'get'
  })
}

export function getMedicalProjectList() {
  return request({
    url: '/reservation/medicalProject/getAllMedicalProject',
    method: 'post'
  })
}

export function getSourcePoolList() {
  return request({
    url: '/reservation/sourcePool/getAllSourcePoolList',
    method: 'post'
  })
}

export function recursionChildrenByParentCode(params) {
  return request({
    url: '/auth/dict/recursionChildrenByParentCode/' + params,
    method: 'post'
  })
}

