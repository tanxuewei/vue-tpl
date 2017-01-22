/*
 * --------------------------------------------
 * 发布
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 类型
 */
export function getList(clusterId) {
    return request.get('/api/instanceConfig/listInstance/'+clusterId, {});
}

export function getClusterConfig(clusterId) {
    return request.get('/api/instanceConfig/getInstanceRelatedParam/'+clusterId, {});
}

export function add(params) {
    return request.post('/api/instanceConfig/addInstance', params);
}

export function del(params) {
    return request.del('/api/instanceConfig/deleteInstance', params);
}

export function get(params) {
    return request.get('/api/instanceConfig/getInstance', params);
}

export function edit(params) {
    return request.put('/api/instanceConfig/updateInstance', params);
}
/*
 * 变更模板相关
 */
export function addReplaceTpl(params) {
    return request.post('/api/instanceConfig/addReplaceTemplate', params);
}

export function delReplaceTpl(params) {
    return request.del('/api/instanceConfig/deleteReplaceTemplate', params);
}

export function delSouceTpl(params) {
    return request.del('/api/instanceConfig/deleteSourceTemplate', params);
}