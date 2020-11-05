<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../assets/logo.png" style="height: 60px" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--页面主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏菜单区域-->
                <!--active-text-color被选中时的颜色-->
                <!--unique-opened="true"；
                若不加冒号，true为字符串，加冒号，true为布尔值；或者直接写unique-opened-->
                <!--collapse自带的折叠效果-->
                <!--router	是否使用 vue-router 的模式，
                启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
                <el-menu background-color="#313743"
                        text-color="#fff"
                        active-text-color="#3693F1"
                         :unique-opened="true" :collapse="isCollapse"
                         :collapse-transition="false" :router="true"
                         :default-active="activePath"
                >
                    <!--一级菜单-->
                    <!--index相同，所以点开一个，其余的也会动-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!--一级菜单的模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconsObj[item.id]"></i>
                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item
                                :index="'/'+subItem.path" v-for="subItem in item.children"
                                :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <!--二级菜单的模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-menu"></i>
                                <!--文本-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <!--路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                /*左侧菜单数据*/
                menuList : [],
                iconsObj:{
                    "125":"iconfont icon-users",
                    "103":"iconfont icon-tijikongjian",
                    "101":"iconfont icon-shangpin",
                    "102":"iconfont icon-danju",
                    "145":"iconfont icon-baobiao"
                },
                /*是否折叠*/
                isCollapse:false,
                /*被激活的链接地址*/
                activePath:''
            }
        },
        /*在整个页面刚加载时，立即获取左侧菜单*/
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')

        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push("/login")
            },
            /*将获取到的数据渲染给data*/
            async getMenuList() {
               const  {data:res} = await this.$http.get('menus')
               if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
               console.log(res)
            },
            /*点击按钮，切换菜单的折叠与展开*/
            toggleCollapse() {
                this.isCollapse=!this.isCollapse
            },
            //*保存链接的激活状态到SessionStorage*/
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<!--scoped防止样式之间的冲突问题-->
<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    /*element-ui中组件名即类名*/
    .el-header{
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        background-color: #363D40;
        /*居中对齐弹性盒的各项 <div> 元素*/
        align-items: center;
        color: #ffffff;
        font-size: 20px;
        > div{
            display: flex;
            align-items: center;
            span{
                margin-left: 15px;
            }
        }
    }
    .el-aside{
        background-color: #313743;
        .el-menu{
            border-right: none;
        }
    }
    .el-main{
        background-color: #E9EDF1;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #475165;
        color: #ffffff;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        /*字符间的间距*/
        letter-spacing: 0.2em;
        /*改变光标的形状*/
        cursor: pointer;
    }
</style>
