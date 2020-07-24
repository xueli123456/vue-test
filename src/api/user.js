import request from '@/utils/request'
// import qs from 'qs'
export function login(username, password, captchaCode) {
  return request({
    url: '/auth/oauth/form',
    method: 'post',
    params: {
      systemCode: '20000',
      username: username,
      password: password,
      captchaCode: captchaCode,
      grant_type: 'password',
      client_id: 'medical-auth',
      client_secret: 'Fk1mLXpCwCGr*Cb3KKSbXVB0KoEH%D2l*6Jsa0wO*5R32KEAtboXmu$X*#KMJDzl'
    }
  })
}

export function getInfo() {
  return request({
    url: '/auth/user/getCurrentUserInfo/20000',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
// /auth/menu/getMenuTreeByUserId
export function getMenuTreeByUserId() {
  return request({
    url: '/auth/menu/getMenuTreeByUserId',
    method: 'post',
  })
}
export function getListPage(params) {
  return request({
    url: '/auth/user/listPage',
    method: 'post',
    data: params
  })
}

export function deleteUser(params) {
  return request({
    url: '/auth/user/delete/' + params,
    method: 'post'
  })
}

export function enableUser(params) {
  return request({
    url: '/auth/user/enable/' + params,
    method: 'post'
  })
}

export function disableUser(params) {
  return request({
    url: '/auth/user/disable/' + params,
    method: 'post'
  })
}

export function modifyUser(params) {
  return request({
    url: '/auth/user/modifyUser',
    method: 'post',
    data: params
  })
}

export function saveUser(params) {
  return request({
    url: '/auth/user/saveUserInfo',
    method: 'post',
    data: params
  })
}

export function checkUserName(params) {
  return request({
    url: '/auth/user/checkUserName',
    method: 'post',
    data: params
  })
}

export function checkUserNo(params) {
  return request({
    url: '/auth/user/checkUserNo',
    method: 'post',
    data: params
  })
}

export function getRoleList() {
  return request({
    url: '/auth/role/getRoleList',
    method: 'post'
  })
}

export function bindRole(params) {
  return request({
    url: '/auth/user/bindRole',
    method: 'post',
    data: params
  })
}

export function getBindRoleListByUserId(params) {
  return request({
    url: '/auth/user/getBindRoleListByUserId/' + params,
    method: 'post'
  })
}

export function getDepartmentList() {
  return request({
    url: '/auth/office/getDepartmentList',
    method: 'post'
  })
}

export function exploreUser(params) {
  return request({
    url: '/auth/user/exploreUser',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

export function resetPassword(params) {
  return request({
    url: '/auth/user/resetPassword',
    method: 'post',
    data: params
  })
}

export function modifyPassword(params) {
  return request({
    url: '/auth/user/modifyPassword',
    method: 'post',
    data: params
  })
}

export function generateValidateCode() {
  return request({
    url: '/auth/generateValidateCode',
    method: 'get'
  })
}
// /auth/menu/getMenuById/{menuId}
export function getMenuById(params) {
  return request({
    url: '/auth/menu/getMenuTreeIncludeSelf/' + params,
    method: 'post',
    data: params
  })
}
