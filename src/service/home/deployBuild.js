/*
 * --------------------------------------------
 * 发布批次配置
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 获取发布计划列表
 */
export function getDeployPlanList(clusterId) {
    return request.get('/api/deployPlan/listDeployPlan/'+clusterId, {});
}

/*
 * 获取具体的发布计划详情
 */
export function getDeployPlanDetail(clusterId, params) {
    return request.get('/api/deployPlan/getDeployPlan/'+clusterId, params);
}

/*
 * 添加发布计划
 */
export function createDeployPlan(params) {
    return request.post('/api/deployPlan/createDeployPlan', params);
}

/*
 * 更新发布计划
 */
export function updateDeployPlan(params) {
    return request.put('/api/deployPlan/updateDeployPlan', params);
}

/*
 * 删除发布计划
 */
export function delDeployPlan(clusterId, params) {
    return request.del('/api/deployPlan/deleteDeployPlan/'+clusterId, params);
}

/*
 * 获取分组
 */
export function getDivision(params) {
    return request.post('/api/deployPlan/groupDivision', params);
}

/*
 * 执行 -- 发布
 */
export function doDeploy(params) {
    return request.post('/api/main/deploy/doDeploy', params);
}

/*
 * 重启、停止、上线和上线获取实例组合
 */
export function getDeployedInstance(clusterId) {
    return request.get('/api/deployPlan/getDeployedInstance/'+clusterId, {});
}

/*
 * 执行 -- 一键发布
 */
export function doBuildAndDeploy(params) {
    return request.post('/api/main/deploy/doBuildAndDeploy', params);
}

/*
 * 一键发布 -- 获取构建版本
 */
export function getBuildVersionList(clusterId) {
    return request.get('/api/deployPlan/listBuildVersionList/'+clusterId, {});
}

/*
 * 执行 -- 回滚
 */
export function doRollBack(params) {
    return request.post('/api/main/deploy/doRollBack', params);
}

/*
 * 执行 -- 重启
 */
export function doRestart(params) {
    return request.post('/api/main/deploy/doRestart', params);
}

/*
 * 执行 --停止
 */
export function doStop(params) {
    return request.post('/api/main/deploy/doStop', params);
}

/*
 * 执行 -- 上线
 */
export function doOnline(params) {
    return request.post('/api/main/deploy/doOnline', params);
}

/*
 * 执行 -- 下线
 */
export function doOffline(params) {
    return request.post('/api/main/deploy/doOffline', params);
}
