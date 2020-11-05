<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <!--面包屑和卡片之间的距离太近，覆盖默认样式尽量都写到assets/css/global.css全局样式下-->
        <el-card>
            <!--搜素与添加区域-->
            <!--Row 组件 提供 gutter 属性来指定每一栏之间的间隔，默认间隔为 0。-->
            <el-row :gutter="20">
                <!--使用栅格系统来布局-->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!--用户列表区域-->
            <!-- :data="userList"表格绑定了用于存储数据的数组,
            里面每一个元素都是数据对象-->
            <el-table :data="userList" border stripe>
                <!--添加索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <!--prop中属性为userList中的属性-->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <!--mg_state为布尔值，在页面上无法直接渲染-->
                <!--通过作用域插槽(会覆盖掉prop属性)，将switch通过布尔值，双向绑定，渲染到表格中-->
                <el-table-column label="状态">
                   <!--slot-scope="scope"2.6版本之前；也可使用
                   这是作用域插槽中定义一个对象(这里对象被定义为scope)来存储插槽上绑定的数据的用法-->
                    <template  v-slot="scope">
                        <!--scope.row
                        在这里使用ElementUI表格模板渲染数据时,
                        "当前行数据的获取也会用到插槽,scope相当于一行的数据，
                         scope.row相当于当前行的数据对象"-->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template v-slot="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit"
                                   size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!--effect="dark"提示的背景色为黑色
                            placement属性决定展示效果（展示位置）-->
                        <!--enterable	鼠标是否可进入到 tooltip 中
                            若不设置，会遮挡住其他元素-->
                        <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <!--分配角色按钮-->
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <!--current-page当前的页数-->
            <!--total	总条目数
            -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed">
            <!--内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户的对话框-->
        <el-dialog
                title="修改用户信息"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            /*验证邮箱的规则*/
            var checkEmail = (rule, value, callback) => {
                /*验证邮箱的正则表达式*/
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    /*合法的邮箱*/
                    return callback()
                }
                callback(new Error("请输入合法的邮箱"))
            };
            /*验证手机号的规则*/
            var checkMobile = (rule, value, callback) => {
                /*验证手机号的正则表达式*/
                const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    /*合法的手机号*/
                    return callback()
                }
                callback(new Error("请输入合法的手机号"))
            };
            return {
                /*获取用户列表的参数对象*/
                queryInfo: {
                    query: '',
                    /*当前的页数*/
                    pagenum: 1,
                    /*当前每页显示多少条数据*/
                    pagesize: 2,
                },
                userList:[],
                total:0,
                /*控制添加用户对话框的显示与隐藏*/
                addDialogVisible:false,
                /*控制修改用户对话框的显示与隐藏*/
                editDialogVisible:false,
                /*添加用户的表单数据*/
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                /*查询到的用户信息对象*/
                editForm:{
                    username:'',
                    email:'',
                    mobile:''
                },
                /*修改表单的验证规则对象*/
                editFormRules:{
                    email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                        {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ]
                },
                /*添加表单的验证规则对象*/
                addFormRules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                        {
                            min: 3,
                            max: 10,
                            message: '用户名的长度在3-10个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                        {
                            min: 6,
                            max: 15,
                            message: '用户名的长度在6-15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                        {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ]
                },
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if(res.meta.status !== 200) {
                    return this.$message.error("获取用户列表失败！")
                }
                this.userList = res.data.users
                this.total = res.data.total
                console.log(res)
            },
            /*pageSize 改变时会触发*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
                // console.log(newSize)
            },
            /*currentPage 改变时会触发*/
            handleCurrentChange(newPage){
                // console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            /*监听 switch开关状态的改变*/
            async userStateChanged(userinfo) {
                console.log(userinfo)
                /*ES6的模板字符串`users/${userinfo.id}/state/${userinfo.mg_state}`*/
               const {data:res} =await this.$http.put(
                   `users/${userinfo.id}/state/${userinfo.mg_state}`)
                if(res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error("更新用户状态失败")
                }
                this.$message.success("更新用户状态成功")

            },
            /*监听添加用户对话框的关闭事件*/
            /*this.$refs.addFormRef拿到整个表单的引用对象*/
            /*vm.$refs一个对象，
            持有注册过 ref attribute 的所有 DOM 元素和组件实例。*/
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            /*监听修改用户对话框的关闭事件*/
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            /*点击按钮，添加新用户*/
            addUser() {
                /*若所有表单项验证成功，则valid为true*/
                this.$refs.addFormRef.validate(async valid => {
                    /*失败，直接return*/
                    if(!valid) return
                    /*成功，可以发起添加用户的网络请求*/
                    /*请求参数为：
                    username | 用户名称 | 不能为空 |
                    | password | 用户密码 | 不能为空 |
                    | email    | 邮箱     | 可以为空 |
                    | mobile   | 手机号   | 可以为空 |*/
                    /*this.addForm对象包括以上请求参数*/
                    const {data:res} = await this.$http.post("users",this.addForm)
                    if(res.meta.status !== 201){
                        this.$message.error("添加用户失败")
                    }
                        this.$message.success("添加用户成功")
                        /*添加用户成功后，隐藏添加用户的对话框*/
                    this.addDialogVisible = false
                    /*重新获取用户列表数据*/
                    this.getUserList()
                })
            },
            /*展示编辑用户的对话框*/
            async showEditDialog(id) {
                const {data:res} = await this.$http.get("users/"+id)
                if(res.meta.status !== 200){
                    /*终止后续操作*/
                    return this.$message.error('查询用户信息失败')
                }
                    this.editForm = res.data
                this.editDialogVisible = true
                // console.log(id)
            },
            /*修改用户信息并提交*/
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid =>{
                    if(!valid) {
                        return
                    }
                    /*发起修改用户信息的数据请求*/
                    const {data:res} = await  this.$http.put("users/"+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    if(res.meta.status !== 200){
                        this.$message.error("更新用户信息失败")
                    }
                    /*关闭对话框*/
                    this.editDialogVisible = false
                    /*刷新数据列表*/
                    this.getUserList()
                    /*提示修改成功*/
                    this.$message.success("更新用户信息成功")
                })
            },
            /*根据id删除对应的用户信息*/
            async removeUserById(id) {
                /*弹框询问用户是否删除数据*/
                const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                /*如果用户确认删除。则返回值为字符串 confirm*/
                /*如果用户取消了删除，则返回值为字符串cancel*/
                // console.log(res)
                if(confirmResult !== "confirm"){
                   return this.$message.info("已取消删除")
                }
                const {data:res} = await this.$http.delete("users/"+id)
                if(res.meta.status !== 200){
                     this.$message.error("删除用户失败")
                }
                     this.$message.success("删除用户成功")
                this.getUserList()
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
