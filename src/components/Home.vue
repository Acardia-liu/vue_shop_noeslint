<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
  export default {
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login")
        }
    }
  }
</script>

<!--scoped防止样式之间的冲突问题-->
<style lang="less" scoped>

</style>
