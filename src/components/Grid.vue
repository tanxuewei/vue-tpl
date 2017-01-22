<template>
<div class="tb">
    <div class="tb-hd">
        <table class="m-table">
            <thead>
                <tr>
                    <th>主机</th>
                    <th>实例名</th>
                    <th>发布状态</th>
                    <th>权限</th>
                </tr>
            </thead>
            <tbody style="display: none;">
                <!-- <slot name="tbody"></slot> -->
            </tbody>
        </table>
    </div>
    <div class="tb-bd" v-el:tbody>
        <slot name="body"></slot>
    </div>
</div>
</template>
<script>
    import { oneOf } from './utils/assist';
    export default {
        props: {
            status: {
                validator (value) {
                    return oneOf(value, ['wait', 'process', 'finish', 'error']);
                }
            },
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String
            },
            icon: {
                type: String
            }
        },
        data () {
            return {
                stepNumber: '',
                nextError: false,
                total: 1
            }
        },
        computed: {
            
        },
        watch: {
            
        }
    }
</script>
<style lang="less">
.tb {
    border: 1px solid #e5e5e5;
    .tb-hd {

    }
    .tb-bd {
        overflow: auto;
        height: 200px;
    }
    .m-table {
        border: none;
        tr {
            border: none;
            border-top: 1px solid #e5e5e5;
        }
        thead tr {
            border: none;
        }
    }
}
</style>