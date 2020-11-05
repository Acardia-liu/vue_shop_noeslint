<template>
  <div id="app">
    <!--路由占位符-->
    <!--通过路由匹配到的组件
    都会被渲染到router-view中进行展示-->
    <!--必须使用此标签-->
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app'
  }
</script>

<style>

</style>
