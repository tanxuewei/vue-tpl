/*
 * --------------------------------------------
 * extend 公共方法
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
const util = {
    /**
     * 用于在本项目中查找map.js中的对象
     * @param  {Array} arr     [{},{}]
     * @param  {String} key   查找的key
     * @param   value         查找的key对应的值
     * @return {Object}       返回Object
     */
    findInMap(arr, key, value) {
        for (let i=0; i<arr.length; i++) {
            if (arr[i][key] == value) {
                return arr[i];
            }
        }
        // return {};
    },
    findInArr(arr, key, value) {

        return arr.filter((item) => {
            return (item[key] == value);
        });
    },
    optionsData(list, id, name) {
        return list.map((item, index) => {
            item.value = item[id];
            item.label = item[name] || '';
            return item;
        });
    },
    findIdList(arr, key) {
        let newArr = [];
        arr.forEach((item) => {
            newArr.push(item[key]);
        });
        return newArr;
    },
    checkIp(ip) {
        var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配ip地址的正则表达式
        if(re.test(ip)){
          if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
              return true;
          }
        }
        return false;
    }
};

export default util;