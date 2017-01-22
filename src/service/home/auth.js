/*
 * --------------------------------------------
 * 权限
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * get
 */
export function getPersonInCharge(clusterId) {
    return request.get('/api/cluster/getPersonInCharge/'+clusterId, {});
}

export function updateDeployer(clusterId, params) {
    return request.post('/api/cluster/updateDeployer/'+clusterId, params);
}

//搜索人员
export function searchUser(params) {
    return request.get('/api/cluster/searchUser', params);
}