/*
 * --------------------------------------------
 * 模板配置
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 模板
 */
export function getTplList(params) {
    return request.get('/api/template/list', params);
}

//获取应用类型
export function getAppType(params) {
    return request.get('/api/template/config/templateTypeList', params);
}

export function add(params) {
    return request.post('/api/template/add', params);
}

export function edit(params) {
    return request.post('/api/template/update', params);
}

export function del(id) {
    return request.del('/api/template/'+id, {});
}

export function get(id) {
    return request.get('/api/template/'+id, {});
}

/*
 * 组件
 */
export function addComponent(params) {
    return request.post('/api/template/config/add', params);
}

export function delComponent(id) {
    return request.del('/api/template/config/'+id, {});
}

/*
 * 脚本
 */
export function addScript(params) {
    return request.post('/api/template/config/file/add', params, 'formData');
}

export function delScript(id) {
    return request.del('/api/template/config/file/'+id, {});
}

/*
 * 查看配置
 */
export function getAllConfig(id) {
    return request.get('/api/template/config/'+id, {});
}