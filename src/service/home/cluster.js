/*
 * --------------------------------------------
 * 集群
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 
 */
export function get(id) {
    return request.get('/api/clusterConfig/'+id, {});
}

export function update(params) {
    return request.post('/api/clusterConfig', params);
}