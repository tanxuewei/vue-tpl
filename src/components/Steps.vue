<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf } from './utils/assist';
    const prefixCls = 'ivu-steps';
    export default {
        props: {
            current: {
                type: Number,
                default: 0
            },
            status: {
                validator (value) {
                    return oneOf(value, ['pending', 'ongoing', 'finish', 'error']);
                },
                default: 'ongoing'
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small']);
                }
            },
            direction: {
                validator (value) {
                    return oneOf(value, ['horizontal', 'vertical']);
                },
                default: 'horizontal'
            }
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.direction}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size
                    }
                ]
            }
        },
        ready () {
            this.updateChildProps(true);
            this.setNextError();
            this.updateCurrent(true);
        },
        methods: {
            //里面暂时把所有的index都变成child.id
            updateChildProps (isInit) {
                const total = this.$children.length;
                let self = this;
                this.$children.forEach((child, index) => {
                    child.stepNumber = index + 1;
                    if (self.direction === 'horizontal') {
                        child.total = total;
                    }
                    // 如果已存在status,且在初始化时,则略过
                    // todo 如果当前是error,在current改变时需要处理
                    if (!(isInit && child.status)) {
                        if (child.id == self.current) {
                            if (child.status == 'finish'){
                                child.status == 'finish';
                            }else {
                                
                                if (self.status != 'error') {
                                    child.status = 'ongoing';
                                }
                            }
                        } else if (child.id < self.current) {
                            child.status = 'finish';
                        } else {
                            child.status = 'pending';
                        }
                    }
                    if (child.status != 'error' && child.id != 0 && index != 0) {
                        self.$children[index - 1].nextError = false;
                    }
                });
            },
            setNextError () {
                this.$children.forEach((child, index) => {
                    if (child.status == 'error' && index != 0) {
                        this.$children[index - 1].nextError = true;
                    }
                });
            },
            updateCurrent (isInit) {
                if (this.$children.length>0){

                    if (isInit) {
                        const current_status = this.$children[this.current].status;
                        if (!current_status) {
                            this.$children[this.current].status = this.status;
                        }
                    } else {
                        this.$children[this.current].status = this.status;
                    }
                }
            }
        },
        watch: {
            current () {
                this.updateChildProps();
            },
            status () {
                this.updateCurrent();
            }
        }
    }
</script>