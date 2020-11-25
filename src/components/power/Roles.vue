<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>
            <!--添加角色按钮区-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">
                        添加角色
                    </el-button>
                </el-col>
            </el-row>

            <!--角色列表区-->
            <el-table :data="roleList" border stripe height="490px">
                <!--展开列-->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <!--通过el-row使用栅格系统-->
                        <!--vCenter共有类为垂直居中对齐-->
                        <el-row :class="['bd-bottom',index === 0 ?'bd-top':'','vCenter']"
                                v-for="(item1,index) in scope.row.children"
                                :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="6">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二、三级权限-->
                            <el-col :span="18">
                                <!--通过for循环，嵌套渲染二级权限-->
                                <el-row v-for="(item2,index2) in item1.children" :key="item2.id"
                                        :class="[index2 === 0 ? '' : 'bd-top','vCenter']">
                                    <el-col :span="7">
                                        <!--设置closable属性可以定义一个标签是否可移除。-->
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="17">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children"
                                                :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!--pre 元素可定义预格式化的文本。
                        被包围在 pre 元素中的文本通常会保留空格和换行符。
                        而文本也会呈现为等宽字体。-->
                        <!--                        <pre>-->
                        <!--                            {{scope.row}}-->
                        <!--                        </pre>-->
                    </template>
                </el-table-column>
                <!--el-table-column表格头-->
                <!--index索引列-->
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <!--需要用到作用域插槽，prop可不指定（会被覆盖）-->
                <!--给table加width属性可强制让他在一行显示-->
                <el-table-column label="角色描述" prop="roleDesc" width="300px">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="removeUserById(scope.row.id)">删除
                        </el-button>
                        <!--在点按钮的同时，将当前角色身上所有三级权限的id获取出来存放到数组中
                        并把数组通过属性绑定在default-checked-keys上-->
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                                   @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--添加角色的对话框-->
        <el-dialog
                title="添加角色"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed">
            <!--内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改角色的对话框-->
        <el-dialog
                title="修改角色"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <!--内容主体区域-->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="角色ID">
                    <el-input v-model="this.editForm.roleId" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed">
            <!--树形控件-->
            <!--node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的-->
            <!--default-expand-all	是否默认展开所有节点-->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox
                     node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /*所有角色列表数据*/
                roleList: [],
                addForm: {},
                editForm: {},
                /*所有权限的数据*/
                rightsList: {},
                addDialogVisible: false,
                editDialogVisible: false,
                /*控制分配权限对话框的显示与隐藏*/
                setRightDialogVisible: false,
                /*添加表单的验证规则对象*/
                addFormRules: {
                    roleName: [{
                        required: true,
                        message: '角色名称不能为空',
                        trigger: 'blur'
                    },
                        {
                            min: 1,
                            max: 10,
                            message: '角色名称不能为空',
                            trigger: 'blur'
                        }
                    ],
                    roleDesc: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },
                        {
                            min: 0,
                            message: '角色描述可以为空',
                            trigger: 'blur'
                        }
                    ]
                },
                /*添加表单的验证规则对象*/
                editFormRules: {
                    roleName: [{
                        required: true,
                        message: '角色名称不能为空',
                        trigger: 'blur'
                    },
                        {
                            min: 1,
                            max: 10,
                            message: '角色名称不能为空',
                            trigger: 'blur'
                        }
                    ],
                    roleDesc: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },
                        {
                            min: 0,
                            message: '角色描述可以为空',
                            trigger: 'blur'
                        }
                    ]
                },
                /*树形控件的属性绑定对象*/
                treeProps: {
                    /*label表示看得到的值，
                    children表示父子节点通过什么属性来实现嵌套的*/
                    label: 'authName',
                    children: 'children'
                },
                /*默认选中的节点id值的数组*/
                defKeys: [],
                /*当前即将分配权限的角色id*/
                setRoleId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            /*获取所有角色的列表*/
            /*通过async、await简化网络请求*/
            async getRolesList() {
                const {data: res} = await this.$http.get("roles")
                if (res.meta.status !== 200) {
                    this.$message.success("获取角色列表失败")
                }
                this.roleList = res.data
                console.log(this.roleList)
            },
            /*关闭添加角色时，清空数据*/
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            /*关闭添加角色时，清空数据*/
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            /*点击按钮，添加新角色*/
            addUser() {
                /*若所有表单项验证成功，则valid为true*/
                this.$refs.addFormRef.validate(async valid => {
                    /*失败，直接return*/
                    if (!valid) return
                    /*成功，可以发起添加用户的网络请求*/
                    // 请求参数
                    // | 参数名   | 参数说明 | 备注     |
                    // | -------- | -------- | -------- |
                    // | roleName | 角色名称 | 不能为空 |
                    // | roleDesc | 角色描述 | 可以为空 |
                    const {data: res} = await this.$http.post("roles", this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error("添加角色失败")
                    }
                    this.$message.success("添加角色成功")
                    /*添加用户成功后，隐藏添加用户的对话框*/
                    this.addDialogVisible = false
                    /*重新获取用户列表数据*/
                    this.getRolesList()
                })
            },
            /*展示编辑用户的对话框*/
            async showEditDialog(id) {
                const {data: res} = await this.$http.get("roles/" + id)
                if (res.meta.status !== 200) {
                    /*终止后续操作*/
                    return this.$message.error('查询角色信息失败')
                }
                this.editForm = res.data
                this.editDialogVisible = true
                console.log(id)
            },
            /*点击按钮，修改角色*/
            editUser() {
                /*若所有表单项验证成功，则valid为true*/
                this.$refs.editFormRef.validate(async valid => {
                    /*失败，直接return*/
                    if (!valid) {
                        return
                    }
                    /*成功，可以发起添加用户的网络请求*/
                    // 请求参数
                    // | 参数名   | 参数说明 | 备注                  |
                    // | -------- | -------- | --------------------- |
                    // | roleId      | 角色 ID  | 不能为空`携带在url中` |
                    // | roleName | 角色名称 | 不能为空              |
                    // | roleDesc | 角色描述 | 可以为空              |
                    const {data: res} = await this.$http.put("roles/" + this.editForm.roleId, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    })
                    console.log(this.editForm.roleId + "++++++++++++++++++++++++++")
                    if (res.meta.status !== 200) {
                        this.$message.error("修改角色失败")
                    }
                    /*添加用户成功后，隐藏添加用户的对话框*/
                    this.editDialogVisible = false
                    /*重新获取用户列表数据*/
                    this.getRolesList()
                    this.$message.success("修改角色成功")

                })
            },
            /*根据id删除对应的角色信息*/
            async removeUserById(id) {
                /*弹框询问用户是否删除数据*/
                const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                /*如果用户确认删除。则返回值为字符串 confirm*/
                /*如果用户取消了删除，则返回值为字符串cancel*/
                // console.log(res)
                if (confirmResult !== "confirm") {
                    return this.$message.info("已取消删除")
                }
                const {data: res} = await this.$http.delete("roles/" + id)
                if (res.meta.status !== 200) {
                    this.$message.error("删除角色失败")
                }
                this.$message.success("删除角色成功")
                this.getRolesList()
            },
            /*根据id删除对应的权限*/
            async removeRightById(role, rightId) {
                /*弹框提示用户是否要删除*/
                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    this.$message.info("取消了删除")
                }

                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    this.$message.error("取消权限失败")
                }
                /*全局刷新会关闭，影响体验*/
                // this.getRolesList()
                role.children = res.data
            },
            /*显示分配权限的对话框*/
            async showSetRightDialog(role) {
                this.setRoleId = role.id
                /*获取所有权限的数据*/
                const {data: res} = await this.$http.get("rights/tree")
                if (res.meta.status !== 200) {
                    this.$message.error("获取权限列表失败")
                }
                /*把获取到的权限数据保存到rightsList中*/
                this.rightsList = res.data
                console.log(this.rightsList)
                /*递归获取三级节点的Id*/
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },
            /*通过递归的形式，获取角色下所有三级权限的id，
            并保存到defKeys数组中*/
            getLeafKeys(node, arr) {
                /*如果当前node节点不包含children属性，
                则是三级节点*/
                if (!node.children) {
                    return arr.push(node.id);
                }
                node.children.forEach(item =>
                    this.getLeafKeys(item, arr))
            },
            /*监听分配权限对话框的关闭事件*/
            setRightDialogClosed() {
                this.defKeys = []
            },
            /*点击为角色分配权限*/
            async allotRights() {
                /*keys获取所有的全选和半选id*/
                const keys = [
                    /*ES6扩展运算符  ...复制数组并合并*/
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                /*请求参数：通过 `请求体` 发送给后端
                | 参数名  | 参数说明               | 备注                                                         |
                | ------- | ---------------------- | ------------------------------------------------------------ |
                | :roleId | 角色 ID                | 不能为空`携带在url中`                                        |
                | rids    | 权限 ID 列表（字符串） | 以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点） |*/
                const idStr = keys.join(',')
                const {data: res} = await this.$http.post(`roles/${this.setRoleId}/rights`, {rids: idStr})
                if (res.meta.status !== 200) {
                    this.$message.error("分配权限失败")
                }
                this.$message.success("分配权限成功")
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bd-top {
        border-top: 1px solid #eeeeee;
    }

    .bd-bottom {
        border-bottom: 1px solid #eeeeee;
    }

    .vCenter {
        display: flex;
        align-items: center;
    }
</style>
