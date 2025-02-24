<template>
  <el-card class="box-card">
    <h2>仪表盘</h2>
    <p v-if="isLoggedIn">欢迎回来，{{ user.name }}！</p>
    <p v-else>您尚未登录。</p>
    <el-button type="primary" @click="logout" v-if="isLoggedIn">
      退出登录
    </el-button>
  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex'; // 引入 Vuex

export default {
  name: 'AppDashboard',
  setup() {
    const router = useRouter();
    const store = useStore(); // 使用 Vuex Store

    // 获取登录状态和用户信息
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const user = computed(() => store.getters.user);

    // 退出登录
    const logout = () => {
      store.dispatch('logout');
      ElMessage.success('已退出登录！');
      router.push('/login'); // 跳转到登录页面
    };

    return {
      isLoggedIn,
      user,
      logout,
    };
  },
};
</script>

<style scoped>
.box-card {
  margin: 20px;
  background-color: white; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
}
</style>