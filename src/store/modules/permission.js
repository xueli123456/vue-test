import { asyncRoutes, constantRoutes } from '@/router'
import { getInfo } from '@/api/user'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  //先取出根节点，没有父id的就是根节点
  data.forEach((item, i) => {
    let module = null
    if (item.parentId == 1) {
      module = {
        path: item.path,
        component: Layout,
        meta: {id: item.id, title: item.name, icon: item.icon},
        children: [
          {
            path: '',
            component: (resolve) => require([`@/views${item.path}`], resolve),
            name: item.name,
            meta: {id: item.id, title: item.name, icon: item.icon },
          }
        ]
      }
      routes.push(module)
    }
  })
  convertTree(routes) //用递归填充
  console.log(routes)
}
//定义一个递归方法
function convertTree(routers) {
  routers.forEach((r,i) => {
    if(menuList[i]){
      if( menuList[i].children.length>0){
        r.children = []
        menuList[i].children.forEach((m, i) => {
          if(r.meta){
            if (m.parentId && m.parentId === r.meta.id) {
              let menu = {
                path: m.path,
                component: (resolve) => require([`@/views${m.path}`], resolve),
                name: 'Index',
                meta: { title: m.name, icon: m.icon }
              }
              r.children.push(menu)
            }
          }
        })
        if (r.children) convertTree(r.children)
      }
    }

  })
}


const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

let menuList = null
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getInfo(state.token).then(response => {
        let data = response
        if (response.code !== 200) {
          this.$message({
            message: '菜单数据加载异常',
            type: 0
          })
        } else {
          data = response.result.menuList
          menuList = data
          Object.assign(loadMenuData, data)
          generaMenu(asyncRoutes, loadMenuData)
          let accessedRoutes
          if (roles.includes('admin')) {
            accessedRoutes = asyncRoutes || []
          } else {
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          }
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
