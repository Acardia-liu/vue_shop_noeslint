<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>
            <!--border为表格添加边框线-->
            <!--stripe为表格添加隔行变色-->
            <!--只要在el-table元素中定义了height属性，即可实现固定表头的表格，而不需要额外的代码。-->
            <!--若不设置table的height，则默认带滚动条撑开页面，使得左侧菜单栏一起滚动-->
<!--            <el-table :data="rightsList" border stripe height="550">-->
            <el-table :data="rightsList" border stripe height="520">

                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="权限名称" prop="authName"></el-table-column>
                <el-table-column  label="路径" prop="path"></el-table-column>
                <el-table-column  label="权限等级" prop="level">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /*权限列表*/
                rightsList:[]
            }
        },
        created() {
            this.getRightsList()
        },
        methods:{
            /*获取权限列表*/
            async getRightsList() {
                /*get函数会返回promise，所以异步封装*/
                const {data:res} = await this.$http.get("rights/list")
                if(res.meta.status !== 200){
                    this.$message.error("获取权限列表失败")
                }
                this.rightsList = res.data
                console.log(this.rightsList)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
