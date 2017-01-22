/*
 * --------------------------------------------
 * 异步接口 - 角色配置
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
import * as request from 'src/base/request';

// 获取所有产品
export function getAllProductList(params) {
    return request.get('/api/product/config/products', params);
}

// 获取我的产品
export function getProductList(params) {
    return request.get('/api/product', params);
}
//获取产品下应用
export function getAppList(params) {
    return request.get('/api/app', params);
}
//获取应用下集群
export function getClusterList(params) {
    return request.get('/api/app/cluster', params);
}
//收藏应用
export function follow(params) {
    return request.get('/api/app/follow', params);
}
//获取我收藏的产品
export function getFollowedProList(params) {
    return request.get('/api/app/followed', params);
}
//获取我收藏产品下的应用
export function getFollowedAppList(id) {
    return request.get('/api/app/followed/'+id, {});
}