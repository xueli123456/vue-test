import PcCookie from '@/utils/cookie'

let TokenKey = 'medical-dev-token'
let href = window.location.href
if(href.match('dev')) {  //开发
  TokenKey = 'medical-test-token'
} else if(href.match('test')) {  //测试
  TokenKey = 'medical-test-token'
} else if(href.match('prod')) { //正式
  TokenKey = 'medical-prod-token'
}

export function getToken() {
  return PcCookie.get(TokenKey)
}

export function setToken(token) {
  PcCookie.set({
    key: TokenKey,
    value: token
  })
}

export function removeToken() {
  PcCookie.delete({
    key: TokenKey
  })
}
