/*
 * --------------------------------------------
 * 构建
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 类型
 */
export function get(clusterId) {
    return request.get('/api/cluster/config/build/'+clusterId, {});
}
export function add(params) {
    return request.post('/api/cluster/config/build', params);
}
export function del(clusterId) {
    return request.del('/api/cluster/config/build/'+clusterId, params);
}
export function getBuildEnv(params) {
    return request.get('/api/cluster/config/build/env', params);
}
export function getBuildType(params) {
    return request.get('/api/cluster/config/build/buildtype', params);
}
export function getSSHkey(params) {
    return request.get('/api/cluster/config/build/sshkey', params);
}