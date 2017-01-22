/**
 * @method request 请求
 * @param {string}                  url                 请求路径
 * @param {object}                  options             请求选项
 * @param {boolean=true}            options.data        请求数据
 * @param {string}                  options.method      请求方式
 */
import Vue from 'vue'
import 'whatwg-fetch';

const request = function (url, options = {}) {
    const opt = {
        credentials: 'same-origin', // send cookie
        headers: {
            'Accept': 'application/json',
        },
    };

    // const isJSON = typeof options.data === 'object';
    const isJSON = options.type === 'formData'?false:true;
    isJSON && (opt.headers['Content-Type'] = 'application/json');
    // !isJSON && (opt.headers['Content-Type'] = `multipart/form-data;`);

    opt.method = (options.method || 'GET').toUpperCase();

    if (options.data && isJSON) {
        switch (opt.method) {
            case 'GET':
            case 'DELETE':
                url += '?' + serialize(options.data);
                break;
            case 'POST':
            case 'PUT':
                // opt.body = JSON.stringify(options.data);
                var cache = [];
                opt.body = JSON.stringify(options.data, function(key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Circular reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
                cache = null; // Enable garbage collection
                break;
            default:
                throw new Error('No `method` when request!');
        }
    } else
        opt.body = options.data;

    return new Promise((resolve, reject) => {
        fetch(url, opt)
            .then((res) => {
                if (res.ok)
                    return res.json();
                else {
                    console.log("Looks like the response wasn't perfect, got status", res.status);
                    throw new Error(res.status);
                }
            }).then((json) => {
                // json.code === 200 ? resolve(json) : reject(json);
                if (json.code === 200){
                    json.data ? resolve(json.data) : resolve(json.data);
                }else if (json.code === 401){
                    resolve(json.data);
                    json.message ? Vue.$alert(json.message, 'danger') : Vue.$alert('您没有权限', 'danger');
                }else{
                    json.message ? Vue.$alert(json.message, 'danger') : Vue.$alert('请求失败', 'danger');
                }
            }).catch((err) => {
                console.error('Request failed:', err);
                // alert('获取失败');
            });
    });
};

const serialize = function (obj) {
    return Object.keys(obj).map((name) =>
        `${name}=${obj[name]}`).join('&');
};

/**
 * @method request GET请求
 * @param {string}                  url                 请求路径
 * @param {var}                     data                请求数据
 */
export function get(url, data = {}, timestamp = true) {
    if (timestamp) {
        data = data || {};
        data.timestamp = +new Date();
    }
    return request(url, { method: 'GET', data });
}

/**
 * @method request POST请求
 * @param {string}                  url                 请求路径
 * @param {var}                     data                请求数据
 */
export function post(url, data, type) {
    return request(url, { method: 'POST', data, type});
}

/**
 * @method request PUT请求
 * @param {string}                  url                 请求路径
 * @param {var}                     data                请求数据
 */
export function put(url, data) {
    return request(url, { method: 'PUT', data });
}

/**
 * @method request DEL请求
 * @param {string}                  url                 请求路径
 * @param {var}                     data                请求数据
 */
export function del(url, data) {
    return request(url, { method: 'DELETE', data });
}
