/*
 * --------------------------------------------
 * 部署
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 获取构建状态
 */
export function getBuildStatus(params) {
    return request.get('/api/main/build/status', params);
}

/*
 * 获取构建日志
 */
export function getBuildLog(params) {
    return request.get('/api/main/build/getlog', params);
}

/*
 * 获取构建完后的日志
 */
export function getBuildTaskLog(params) {
    return request.get('/api/main/build/buildTaskLog', params);
}

/*
 * 启动单集群的build过程
 */
export function startBuild(params) {
    return request.get('/api/main/build/startBuild', params);
}

/*
 * 当一次build为error状态下重新启动build
 */
export function restartBuild(params) {
    return request.get('/api/main/build/restartBuild', params);
}

/*
 * 获取发布状态，包括发布的分组信息，以及分组的状态，以及分组
 */
export function getDeployStatus(params) {
    return request.get('/api/main/deploy/status', params);
}

/*
 * 获取各个发布批次的状态
 */
export function getDeployGroupStatus(params) {
    return request.get('/api/main/deploy/groupStatus', params);
}

/*
 * 实例的状态
 */
export function getInstanceStatus(params) {
    return request.get('/api/main/deploy/instanceStatus', params);
}

/*
 * 获取发布日志
 */
export function getDeployLog(params) {
    return request.get('/api/main/deploy/deployLog', params);
}

/*
 * 手工启动下一个批次
 */
export function groupContinue(params) {
    return request.get('/api/main/deploy/groupContinue', params);
}

/*
 * 实例发布error时，重试某个实例
 */
export function retryInstance(params) {
    return request.get('/api/main/deploy/retryInstanceAction', params);
}

/*
 * 实例发布error时，忽略某个实例
 */
export function ignoreInstance(params) {
    return request.get('/api/main/deploy/ignoreInstance', params);
}