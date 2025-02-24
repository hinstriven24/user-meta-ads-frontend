<template>
  <AuthForm
    title="注册"
    submitText="注册"
    switchText="已有账号？登录"
    :showUsername="true"
    :showForgotPassword="false"
    :showSocialLogin="false"
    @submit="onSubmit"
    @switch-form="goToLogin"
  />
</template>

<script>
import AuthForm from '@/components/AuthForm.vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // 引入 Vuex

export default {
  name: 'AppRegister',
  components: {
    AuthForm,
  },
  setup() {
    const router = useRouter();
    const store = useStore(); // 使用 Vuex Store

    const onSubmit = async (form) => {
      try {
        const { username, email, phone, password, loginType } = form;
        let payload;
        if (loginType === 'email') {
          payload = { username, email, password };
        } else if (loginType === 'phone') {
          payload = { username, phone, password };
        }
        await store.dispatch('register', payload); // 调用 Vuex 的注册操作
        ElMessage.success('注册成功！');
        router.push('/login'); // 跳转到登录页面
      } catch (error) {
        ElMessage.error(`注册失败：${error.message}`);
      }
    };

    const goToLogin = () => {
      router.push('/login'); // 跳转到登录页面
    };

    return {
      onSubmit,
      goToLogin,
    };
  },
};
</script>