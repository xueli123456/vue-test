import request from '@/utils/request'
import url from './serviceurl'
import qs from 'qs'

const hostApi = {
  ...url
}
export default {
  genNumStr() {
    return this.getApi(hostApi.genNumStr, {})
  },
  genShortNumStr() {
    return this.getApi(hostApi.genShortNumStr, { length: 100000 })
  },
  genShortNumStr8() {
    return this.getApi(hostApi.genShortNumStr, { length: 10000000 })
  },
  postJsonApi(url, params) {
    return request({
      url: url,
      method: 'post',
      // params: parms
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
  },
  postApi(url, params) {
    const p = url + '?' + qs.stringify(params)
    return request({
      url: p,
      method: 'post'
    })
  },
  postPathApi(url, params) {
    debugger
    const p = url + params
    return request({
      url: p,
      method: 'post'
    })
  },
  getApi(url, params) {
    const p = url + '?' + qs.stringify(params)
    return request({
      url: p,
      method: 'get'
    })
  },
  // -------------------科室相关接口-------------------
  officeList() {
    return this.postJsonApi(hostApi.officeList, {})
  },
  getOfficeTree(params) {
    return this.postJsonApi(hostApi.getOfficeTree + params, {})
  },
  // -------------------医技类型相关接口-------------------
  medicalTypeList(params) {
    return this.postJsonApi(hostApi.medicalTypeList, params)
  },
  loadMedicalTypeListByDepartment(params) {
    return this.postPathApi(hostApi.getMedicalTypeList, params)
  },
  loadMedicalTypeList(params) {
    return this.postJsonApi(hostApi.loadMedicalTypeList, params)
  },
  medicalTypeSave(params) {
    return this.postJsonApi(hostApi.medicalTypeSave, params)
  },
  medicalTypeUpdateStatus(params) {
    return this.postApi(hostApi.medicalTypeUpdateStatus, params)
  },
  medicalTypeDelete(params) {
    return this.postApi(hostApi.medicalTypeDelete, params)
  },
  // -------------------医技项目相关接口-------------------
  medicalProjectList(params) {
    return this.postJsonApi(hostApi.medicalProjectList, params)
  },
  medicalProjectSave(params) {
    return this.postJsonApi(hostApi.medicalProjectSave, params)
  },
  medicalProjectUpdateStatus(params) {
    return this.postApi(hostApi.medicalProjectUpdateStatus, params)
  },
  medicalProjectDelete(params) {
    return this.postApi(hostApi.medicalProjectDelete, params)
  },
  // -------------------设备相关接口-------------------
  loadDeviceList() {
    return this.postJsonApi(hostApi.loadDeviceList)
  },
  deviceList(params) {
    return this.postJsonApi(hostApi.deviceList, params)
  },
  deviceSave(params) {
    return this.postJsonApi(hostApi.deviceSave, params)
  },
  deviceUpdateStatus(params) {
    return this.postApi(hostApi.deviceUpdateStatus, params)
  },
  deviceDelete(params) {
    return this.postApi(hostApi.deviceDelete, params)
  },
  // ------------------队列-----------------------
  loadQueueList() {
    return this.postJsonApi(hostApi.loadQueueList, {})
  },
  queueList(params) {
    return this.postJsonApi(hostApi.queueList, params)
  },
  queueSave(params) {
    return this.postJsonApi(hostApi.queueSave, params)
  },
  queueDelete(params) {
    return this.postApi(hostApi.queueDelete, params)
  },
  // ------------------人员管理-----------------------l
  workPeopleList(params) {
    return this.postJsonApi(hostApi.workPeopleList, params)
  },
  workPeopleSave(params) {
    return this.postJsonApi(hostApi.workPeopleSave, params)
  },
  workPeopleDelete(params) {
    return this.postApi(hostApi.workPeopleDelete, params)
  },
  // ------------------人员管理-----------------------l
  officeTimeList(params) {
    return this.postJsonApi(hostApi.officeTimeList, params)
  },
  officeTimeSave(params) {
    return this.postJsonApi(hostApi.officeTimeSave, params)
  },
  officeTimeDelete(params) {
    return this.postApi(hostApi.officeTimeDelete, params)
  },
  // ------------------黑名单--------------------------------
  blackList(params) {
    return this.postJsonApi(hostApi.blackList, params)
  },
  blackListSave(params) {
    return this.postJsonApi(hostApi.blackListSave, params)
  },
  blackListDelete(params) {
    return this.postApi(hostApi.blackListDelete, params)
  },
  // ------------------广告位--------------------------------
  adfindAll(params) {
    return this.postJsonApi(hostApi.adfindAll, params)
  },
  adList(params) {
    return this.postJsonApi(hostApi.adList, params)
  },
  adSave(params) {
    return this.postJsonApi(hostApi.adSave, params)
  },
  adDelete(params) {
    return this.postApi(hostApi.adDelete, params)
  },
  // ------------------广告--------------------------------
  mainBannerList(params) {
    return this.postJsonApi(hostApi.mainBannerList, params)
  },
  mainBannerSave(params) {
    return this.postJsonApi(hostApi.mainBannerSave, params)
  },
  mainBannerDelete(params) {
    return this.postApi(hostApi.mainBannerDelete, params)
  },
  // ------------------栏目-----------------------------
  loadCategoryById(params) {
    return this.postApi(hostApi.loadCategoryById, params)
  },
  categoryList(params) {
    return this.postJsonApi(hostApi.categoryList, params)
  },
  categorySave(params) {
    return this.postJsonApi(hostApi.categorySave, params)
  },
  categoryDelete(params) {
    return this.postApi(hostApi.categoryDelete, params)
  },
  // ------------------文章-----------------------------
  articleList(params) {
    return this.postJsonApi(hostApi.articleList, params)
  },
  articleSave(params) {
    return this.postJsonApi(hostApi.articleSave, params)
  },
  articleDelete(params) {
    return this.postApi(hostApi.articleDelete, params)
  },
  // ------------------菜单-----------------------------
  wxMenuList(params) {
    return this.postJsonApi(hostApi.wxMenuList, params)
  },
  wxMenuSave(params) {
    return this.postJsonApi(hostApi.wxMenuSave, params)
  },
  wxMenuDelete(params) {
    return this.postApi(hostApi.wxMenuDelete + '/' + params)
  },
  // ------------------菜单类型-----------------------------
  loadWxMenuTypeList() {
    return this.postJsonApi(hostApi.loadWxMenuTypeList, {})
  },
  wxMenuTypeList(params) {
    return this.postJsonApi(hostApi.wxMenuTypeList, params)
  },
  wxMenuTypeSave(params) {
    return this.postJsonApi(hostApi.wxMenuTypeSave, params)
  },
  wxMenuTypeDelete(params) {
    return this.postApi(hostApi.wxMenuTypeDelete + '/' + params)
  },
  // ------------------文件上传-----------------------------
  uploadFile(formData) {
    return request({
      url: hostApi.uploadFile,
      method: 'post',
      // params: parms
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getDictList(id) {
    return this.postJsonApi(hostApi.getDict + '/' + id, {})
  },
  scheduleAllList(params) {
    return this.postJsonApi(hostApi.scheduleAllList, params)
  },
  scheduleList(params) {
    return this.postJsonApi(hostApi.scheduleList, params)
  },
  scheduleSave(params) {
    return this.postJsonApi(hostApi.scheduleSave, params)
  },
  scheduleDelete(params) {
    return this.postApi(hostApi.scheduleDelete + '/' + params)
  },
  scheduleDetailListByScheduleId(params) {
    return this.postJsonApi(hostApi.scheduleDetailListByScheduleId, params)
  },
  scheduleDetailList(params) {
    return this.postJsonApi(hostApi.scheduleDetailList, params)
  },
  scheduleDetailSave(params) {
    return this.postJsonApi(hostApi.scheduleDetailSave, params)
  },
  scheduleDetailDelete(params) {
    return this.postApi(hostApi.scheduleDetailDelete + '/' + params)
  },
  sourcePlanList(params) {
    return this.postJsonApi(hostApi.sourcePlanList, params)
  },
  sourcePlanSave(params) {
    return this.postJsonApi(hostApi.sourcePlanSave, params)
  },
  sourcePlanBatchSave(params) {
    return this.postJsonApi(hostApi.sourcePlanBatchSave, params)
  },
  sourcePlanDelete(params) {
    return this.postApi(hostApi.sourcePlanDelete + '/' + params)
  },
  sourcePlanDetailList(params) {
    return this.postJsonApi(hostApi.sourcePlanDetailList, params)
  },
  sourcePlanDetailSave(params) {
    return this.postJsonApi(hostApi.sourcePlanDetailSave, params)
  },
  sourcePlanDetailDelete(params) {
    return this.postApi(hostApi.sourcePlanDetailDelete + '/' + params)
  },
  sourcePoolListByDept(params) {
    return this.postApi(hostApi.sourcePoolListByDept + '/' + params)
  },
  loadHolidayAllList() {
    return this.postJsonApi(hostApi.holidayAllList, {})
  },
  holidayList(params) {
    return this.postJsonApi(hostApi.holidayList, params)
  },
  holidaySave(params) {
    return this.postJsonApi(hostApi.holidaySave, params)
  },
  holidayDelete(params) {
    return this.postApi(hostApi.holidayDelete + '/' + params)
  },
  initHolidayConfigure(params) {
    return this.postApi(hostApi.holidayInit + '/' + params)
  },
  sourcePoolListByDeptAndDate(params) {
    return this.postJsonApi(hostApi.sourcePoolListByDeptAndDate, params)
  },
  modifySourcePlan(params){
    return this.postJsonApi(hostApi.modifySourcePlan, params)
  }
}
