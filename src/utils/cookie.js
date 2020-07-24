import Cookies from 'js-cookie'

class PcCookie {
  constructor() {
    this.domain = '.tianxuan01.cn'
    this.expireTime = 30
  }

  set(cookieParam) {
    const { key, value, expires, path, success } = cookieParam
    PcCookie.checkKey(key)
    Cookies.set(key, value, { expires: expires || this.expireTime, path: path || '/', domain: this.domain })
    success && success()
  }

  get(key) {
    PcCookie.checkKey(key)
    return Cookies.get(key)
  }

  delete(cookieParam) {
    const { key, path, success } = cookieParam
    PcCookie.checkKey(key)
    Cookies.remove(key, { path: path || '/', domain: this.domain })
    success && success()
  }

  geteAll() {
    Cookies.get()
  }

  static checkKey(key) {
    if (!key) {
      throw new Error('没有找到key。')
    }
    if (typeof key === 'object') {
      throw new Error('key不能是一个对象。')
    }
  }
}

export default new PcCookie()
