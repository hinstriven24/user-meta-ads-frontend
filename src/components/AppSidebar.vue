<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    background-color="#ffffff"
    text-color="#333"
    active-text-color="#1877f2"
  >
    <el-menu-item index="1">
      <i class="fas fa-tachometer-alt"></i> <!-- 仪表盘图标 -->
      <router-link to="/">仪表盘</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="fas fa-cog"></i> <!-- 设置图标 -->
      <router-link to="/settings">设置</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppSidebar',
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

i {
  margin-right: 10px; /* 图标与文字间距 */
}
</style>