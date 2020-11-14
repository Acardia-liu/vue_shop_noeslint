import Vue from 'vue'
// {}代表按需导入
//导入Message弹框提示组件,必须进行全局挂载到Vue原型上的一个属性
// 这样所有组件都可通过this.$message来使用弹框提示
/*element-ui按需导入的优化，直接在同一个组件中加，不要另起一行*/
import
{   Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    /*需要进行全局挂载*/
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    cascader
} from 'element-ui'

// 注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(cascader)




//$message为自定义属性，可任意改名，Message为组件名
//$message提供了一系列的弹框方法，使用this.$message.方法名即可
// <el-button :plain="true" @click="open2">成功</el-button>
//   <el-button :plain="true" @click="open3">警告</el-button>
//   <el-button :plain="true" @click="open1">消息</el-button>
//   <el-button :plain="true" @click="open4">错误</el-button>
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
