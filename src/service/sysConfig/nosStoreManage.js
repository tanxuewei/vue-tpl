/*
 * --------------------------------------------
 * nos管理
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 类型
 */
export function getAllNos(params) {
    return request.get('/api/nosConfig', params);
}

export function add(params) {
    return request.post('/api/nosConfig', params);
}

export function get(id){
    return request.get('/api/nosConfig/'+id, {});
}

export function edit(params){
    return request.put('/api/nosConfig', params);
}

export function del(id){
    return request.del('/api/nosConfig/'+id, {});
}
