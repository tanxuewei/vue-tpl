/*
 * --------------------------------------------
 * 拖放
 * @version  1.0
 * @author   shirley(hztanxuewei@corp.netease.com)
 * --------------------------------------------
 */
var manager = {};

var getElementIndex = function(element){
    return Array.prototype.indexOf.call(element.parentElement.children, element);
}

export function onDragStart(e) {
    manager.source = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/html", e.target.innerHTML);
    setTimeout(function(){
        e.target.className = 'w2 graph js-blog z-dragSource'
    },0);
}
export function onDragEnd(e) {
    e.target.className = 'w2 graph js-blog';
}
export function onDragOver(e) {
    e.preventDefault();

    var source = manager.source;
    var target = e.target;

    while(target && target.tagName !== 'TR')
        target = target.parentElement;
    if(!target || target.tagName !== 'TR')
        return;

    // 排除source和target相同的情况
    if(source === target)
       return;

    var sourceParent = source.parentElement;
    var targetParent = target.parentElement;
    var sourceIndex = getElementIndex(source);
    var targetIndex = getElementIndex(target);

    // 删除起始元素
    sourceParent.removeChild(source);

    // 再将起始元素插入到新的位置
    if(sourceIndex >= targetIndex || sourceParent !== targetParent)
       targetParent.insertBefore(source, target);
    else
       targetParent.insertBefore(source, target.nextElementSibling);
}