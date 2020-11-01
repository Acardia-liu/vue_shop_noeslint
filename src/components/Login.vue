<template>
    <div class="login_container">
        <div  class="login_box">
          <!--头像区域-->
          <div class="avater_box">
            <img src="../assets/logo.png" alt="">
          </div>
          <!--登录表单区域-->
          <!--loginFormRef是表单的实例对象，可通过其调用Form的函数来重置表单-->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
            <!--用户名-->
            <el-form-item prop="username">
              <!--使用第三方库添加字体图标（阿里图标）（在main.js中导入字体图标）
              iconfont icon-user 前面的为基类，后面的为名字-->
              <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop="password">
              <!--设置为密码框，加一个type="password"即可-->
              <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!--按钮区域-->
            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
    /* 这是登录表单的数据绑定对象 */
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      /* 这是表单的验证规则对象 */
      loginFormRules: {
        /* 验证用户名是否合法 */
        username: [
          /* required: true代表为必填项； trigger: 'blur':表示触发时机（失去焦点时触发此次行为） */
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        /* 验证密码是否合法 */
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 点击重置按钮，重置登录表单 */
    resetLoginForm () {
      /* this指示登录组件的实例对象 */
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      /* validate对整个表单进行校验的方法，参数为一个回调函数。
      * 即判断校验规则是否合法，实现登录前的预校验 */
      this.$refs.loginFormRef.validate(async (valid) => {
        // 如果valid为false，就不发送请求
        if (!valid) return;
        /* 在main.js中配置axios后，通过this可访问到原型上的$http,来发起登录请求 */
        /*通过{}解构复制出data属性并重命名为res，来获取真实的服务器上的数据*/
        const {data: res} = await this.$http.post("login", this.loginForm);
        /* 返回值为Promise对象 */
        /*为了简化操作，使用async 和await获取data（异步编程）*/
        if(res.meta.status !== 200){
          this.$message.error("登录失败")
        }else {
          this.$message.success("登录成功")
        }
      //  1.将登陆成功后的token，保存到客户端的sessionStorage中
      //  （localStorage是持久化的存储机制，sessionStorage是会话期间的存储机制）
      //    1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
      //    1.2token只应在当前网站打开期间生效，所以将token保存在sessionMessage中
        console.log(res);
        window.sessionStorage.setItem("token",res.data.token);
      //  2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      })
    }
  }
}
</script>

<!--scopde控制组件样式生效的区间
（当文件时单文件组件时使用，防止组件间的样式冲突）-->
<!--若不加scoped样式，style样式会全局生效-->
<!--在可视化界面中，安装less-loader和less运行依赖-->
<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 3px;
    /*绝对定位*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .avater_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow:  0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    /*transform: translate(100%,-50%);*/
    background-color: #ffffff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    /*box-sizing规定两个并排的带边框的框：*/
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
