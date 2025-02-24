<template>
  <AuthForm
    title="登录"
    submitText="登录"
    switchText="注册新账号"
    :showUsername="false"
    @submit="onSubmit"
    @switch-form="goToRegister"
    @forgot-password="goToForgotPassword"
    @social-login="onSocialLogin"
  />
</template>

<script>
import AuthForm from '@/components/AuthForm.vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // 引入 Vuex

export default {
  name: 'AppLogin',
  components: {
    AuthForm,
  },
  setup() {
    const router = useRouter();
    const store = useStore(); // 使用 Vuex Store

    const onSubmit = async (form) => {
      try {
        const { email, phone, password, loginType } = form;
        let payload;
        if (loginType === 'email') {
          payload = { email, password };
        } else if (loginType === 'phone') {
          payload = { phone, password };
        }
        await store.dispatch('login', payload); // 调用 Vuex 的登录操作
        ElMessage.success('登录成功！');
        router.push('/dashboard'); // 跳转到仪表盘页面
      } catch (error) {
        ElMessage.error('登录失败，请检查输入信息！');
      }
    };

    const goToRegister = () => {
      router.push('/register'); // 跳转到注册页面
    };

    const goToForgotPassword = () => {
      ElMessage.info('忘记密码功能暂未实现');
    };

    const onSocialLogin = (provider) => {
      ElMessage.info(`使用 ${provider} 登录功能暂未实现`);
    };

    return {
      onSubmit,
      goToRegister,
      goToForgotPassword,
      onSocialLogin,
    };
  },
};
</script>