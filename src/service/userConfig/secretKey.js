/*
 * --------------------------------------------
 * 个人配置 - 密钥管理
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 
 */
export function getList(params){
    return request.get('/api/key/config/keyConfig/allkeys', params);
}

export function get(id) {
    return request.get('/api/key/config/keyConfig/'+id, {});
}

export function add(params) {
    return request.post('/api/key/config/keyConfig', params);
}

export function del(id){
    return request.del('/api/key/config/keyConfig/'+id, {});
}
