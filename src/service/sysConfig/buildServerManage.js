/*
 * --------------------------------------------
 * 构建服务器
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 类型
 */
export function getAllServer(params) {
    return request.get('/api/buildserver/status/clusters', params);
}
/*
 * ****功能: 获取某一个组别下的所有服务器***
 */
export function getServerByGroup(id) {
    return request.get('/api/buildserver/status/'+id, {});
}

export function getServerDetail(id){
    return request.get('/api/buildserver/status/id/'+id, {});
}

export function setServer(params){
    return request.post('/api/buildserver/status', params);
}

export function setServerStatus(params){
    return request.post('/api/buildserver/status/set/servicestatus', params);
}

export function refreshStatus(params){
    return request.get('/api/buildserver/status/refresh', params);
}