/*
 * --------------------------------------------
 * 基础件管理
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

/*
 * 类型
 */
export function getAllType(params) {
    return request.get('/api/software/type/all', params);
}

export function addType(params) {
    return request.post('/api/software/type', params);
}

export function delType(params){
    return request.del('/api/software/type', params);
}

export function getType(params){
    return request.get('/api/software/type', params);
}

/*
 * 基础包
 */
export function searchPackage(params) {
    return request.get('/api/software/base/query', params);
}

export function addPackage(params) {
    return request.post('/api/software/base/upload', params, 'formData');
}

export function getPackage(id) {
    return request.get('/api/software/base/get/'+id, {});
}

export function updatePackage(params){
    return request.post('/api/software/base/update', params);
}

export function delPackage(id){
    return request.del('/api/software/base/delete/'+id, {});
}

export function addConfig(params){
    return request.post('/api/software/config/upload', params, 'formData');
}

export function delConfig(id){
    return request.del('/api/software/config/delete/'+id, {});
}
/****功能: 获取某一个基础软件包下面的所有配置包信息******/
export function getAllConfig(params){
    return request.get('/api/software/config/query', params);
}
/*****功能: 获取对应配置软件包下的所有占位符信息****/
export function getPlaceholder(id){
    return request.get('/api/software/placeholder/'+id, {});
}
/*******功能：更新占位符信息，更新只能更新对应的数据类型、默认值、描述 这个的更新批量 */
export function updatePlaceholder(params){
    return request.post('/api/software/placeholder/update', params);
}

/*
 * 基础包全局搜索
 */
export function searchPackageByWord(params){
    return request.get('/api/software/base/search', params);
}
