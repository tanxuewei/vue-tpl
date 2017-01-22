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
export function getAdminList(params) {
    return request.post('/api/user/listAdmin', params);
}

export function searchUser(params) {
    return request.get('/api/user/searchUser', params);
}

/*
 * 设置管理员
 */
export function setAdmin(account) {
    return request.get('/api/user/setAdmin/'+account, {});
}

/*
 * 取消管理员
 */
export function cancelAdmin(account) {
    return request.get('/api/user/cancelAdmin/'+account, {});
}