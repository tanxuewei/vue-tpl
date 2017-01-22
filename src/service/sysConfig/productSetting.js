/*
 * --------------------------------------------
 * 产品设置
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 
 */
export function getList(params) {
    return request.get('/api/product/config', params);
}
export function add(params) {
    return request.post('/api/product/config', params);
}
export function del(id) {
    return request.del('/api/product/config/'+id, {});
}
export function get(id) {
    return request.get('/api/product/config/'+id, {});
}