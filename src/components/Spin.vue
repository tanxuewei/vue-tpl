<template>
    <div :class="classes" transition="fade">
        <div :class="mainClasses">
            <span :class="dotClasses"></span>
            <div :class="textClasses" v-el:text><slot></slot></div>
        </div>
    </div>
</template>
<script>
    import { oneOf } from './utils/assist';
    const prefixCls = 'ivu-spin';
    export default {
        props: {
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            fix: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showText: false
            }
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-fix`]: this.fix,
                        [`${prefixCls}-show-text`]: this.showText,
                    }
                ]
            },
            mainClasses () {
                return `${prefixCls}-main`;
            },
            dotClasses () {
                return `${prefixCls}-dot`;
            },
            textClasses () {
                return `${prefixCls}-text`;
            }
        },
        compiled () {
            const text = this.$els.text.innerHTML;
            if (text != '') {
                this.showText = true;
            }
        }
    }
</script>
<style lang="less">
.ivu-spin {
    color: #0099e5;
    text-align: center;
}
.ivu-spin-dot {
    position: relative;
    display: block;
    border-radius: 50%;
    background-color: #0099e5;
    width: 25px;
    height: 25px;
    -webkit-animation: ani-spin-bounce 1s 0s ease-in-out infinite;
    animation: ani-spin-bounce 1s 0s ease-in-out infinite;
}
.ivu-spin-show-text .ivu-spin-dot, .ivu-spin-text {
    display: none;
}
.ivu-spin-small .ivu-spin-dot {
    width: 12px;
    height: 12px;
}
.ivu-spin-large .ivu-spin-dot {
    width: 32px;
    height: 32px;
}
@keyframes ani-spin-bounce{
    0%{
        -webkit-transform:scale(0);
        -moz-transform:scale(0);
        transform:scale(0);
    }
    100%{
        -webkit-transform:scale(1);
        -moz-transform:scale(1);
        transform: scale(1);
        opacity: 0;
    }
}
</style>