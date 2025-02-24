<template>
  <div class="auth-container">
    <div class="left-panel">
      <div class="logo">
        <i class="fab fa-meta logo-icon"></i> <!-- 使用 Font Awesome 的 Meta 图标 -->
      </div>
      <div class="description">
        <h2>欢迎使用后台管理系统</h2>
        <p>这里是您的管理中心，您可以：</p>
        <ul>
          <li>管理用户和权限</li>
          <li>查看数据统计和分析</li>
          <li>配置系统设置</li>
          <li>与其他平台集成</li>
        </ul>
      </div>
    </div>
    <div class="right-panel">
      <div class="auth-box">
        <h2 class="auth-title">{{ title }}</h2>
        <el-form :model="form" label-width="0">
          <el-form-item v-if="showUsername">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              class="auth-input"
            />
          </el-form-item>
          <!-- 将单选按钮组放在一个独立的容器中，添加样式 -->
          <div class="login-type-container">
            <el-radio-group v-model="loginType" class="login-type">
              <el-radio label="email">邮箱</el-radio>
              <el-radio label="phone">手机号码</el-radio>
            </el-radio-group>
          </div>
          <el-form-item v-if="loginType === 'email'">
            <el-input
              v-model="form.email"
              placeholder="邮箱地址"
              class="auth-input"
            />
          </el-form-item>
          <el-form-item v-if="loginType === 'phone'">
            <el-input
              v-model="form.phone"
              placeholder="手机号码"
              class="auth-input"
            />
          </el-form-item>
          <el-form-item v-if="loginType === 'email'">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              class="auth-input"
            />
          </el-form-item>
          <el-form-item v-if="loginType === 'phone'">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="短信验证码"
              class="auth-input"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="auth-button" @click="onSubmit">
              {{ submitText }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="auth-options">
          <el-button type="text" class="auth-option" @click="onSwitchForm">
            {{ switchText }}
          </el-button>
          <el-divider direction="vertical" v-if="showForgotPassword" />
          <el-button
            type="text"
            class="auth-option"
            @click="onForgotPassword"
            v-if="showForgotPassword"
          >
            忘记密码？
          </el-button>
        </div>
        <div class="social-login" v-if="showSocialLogin">
          <div class="social-icons">
            <el-tooltip content="使用 Facebook 登录" placement="top">
              <i class="fab fa-facebook social-icon facebook" @click="onSocialLogin('facebook')"></i>
            </el-tooltip>
            <el-tooltip content="使用 Instagram 登录" placement="top">
              <i class="fab fa-instagram social-icon instagram" @click="onSocialLogin('instagram')"></i>
            </el-tooltip>
            <el-tooltip content="使用 Threads 登录" placement="top">
              <i class="fab fa-threads social-icon threads" @click="onSocialLogin('threads')"></i>
            </el-tooltip>
            <el-tooltip content="使用 Messenger 登录" placement="top">
              <i class="fab fa-facebook-messenger social-icon messenger" @click="onSocialLogin('messenger')"></i>
            </el-tooltip>
            <el-tooltip content="使用 WhatsApp 登录" placement="top">
              <i class="fab fa-whatsapp social-icon whatsapp" @click="onSocialLogin('whatsapp')"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElTooltip } from 'element-plus';

export default {
  name: 'AuthForm',
  components: {
    ElTooltip,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    submitText: {
      type: String,
      required: true,
    },
    switchText: {
      type: String,
      required: true,
    },
    showUsername: {
      type: Boolean,
      default: false,
    },
    showForgotPassword: {
      type: Boolean,
      default: true,
    },
    showSocialLogin: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit', 'switch-form', 'forgot-password', 'social-login'],
  data() {
    return {
      loginType: 'email', // 默认使用邮箱登录
      form: {
        username: '',
        email: '',
        phone: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit() {
      this.$emit('submit', { ...this.form, loginType: this.loginType });
    },
    onSwitchForm() {
      this.$emit('switch-form');
    },
    onForgotPassword() {
      this.$emit('forgot-password');
    },
    onSocialLogin(provider) {
      this.$emit('social-login', provider);
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5; /* Facebook 背景灰色 */
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgba(240, 242, 245, 0.95), /* 最浅的蓝色，接近白色 */
    rgba(240, 242, 245, 0.95) /* 最浅的蓝色，接近白色 */
  );
  color: #2c3e50; /* 深灰色文字 */
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.logo {
  z-index: 2;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in-out; /* Logo 动画 */
}

.logo-icon {
  font-size: 80px; /* 调整图标大小 */
  color: #1877f2; /* Facebook 蓝色 */
}

.description {
  z-index: 2;
  max-width: 500px;
  text-align: center;
  animation: slideIn 1s ease-in-out; /* 描述文字动画 */
}

.description h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #2c3e50; /* 深灰色文字 */
}

.description p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #2c3e50; /* 深灰色文字 */
}

.description ul {
  list-style: none;
  padding: 0;
}

.description ul li {
  font-size: 16px;
  margin-bottom: 10px;
  color: #2c3e50; /* 深灰色文字 */
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.auth-box {
  width: 400px;
  padding: 40px;
  text-align: center;
}

.auth-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #1877f2; /* Facebook 蓝色 */
}

.auth-input {
  margin-bottom: 15px;
}

.auth-input :deep(.el-input__inner) {
  height: 40px;
  border-radius: 6px;
  border: 1px solid #dddfe2;
}

.auth-button {
  width: 100%;
  height: 40px;
  background-color: #1877f2; /* Facebook 蓝色 */
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
}

.auth-button:hover {
  background-color: #1659b5; /* 深蓝色 */
}

.auth-options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606770;
}

.auth-option {
  padding: 0;
  font-size: 14px;
  color: #1877f2; /* Facebook 蓝色 */
}

.social-login {
  margin-top: 20px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px; /* 图标间距 */
}

.social-icon {
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.social-icon.facebook {
  color: #1877f2; /* Facebook 蓝色 */
}

.social-icon.facebook:hover {
  color: #1659b5; /* 深蓝色 */
}

.social-icon.instagram {
  color: #e4405f; /* Instagram 粉色 */
}

.social-icon.instagram:hover {
  color: #c13584; /* 深粉色 */
}

.social-icon.threads {
  color: #000000; /* Threads 黑色 */
}

.social-icon.threads:hover {
  color: #333333; /* 深灰色 */
}

.social-icon.messenger {
  color: #0084ff; /* Messenger 蓝色 */
}

.social-icon.messenger:hover {
  color: #0066cc; /* 深蓝色 */
}

.social-icon.whatsapp {
  color: #25d366; /* WhatsApp 绿色 */
}

.social-icon.whatsapp:hover {
  color: #128c7e; /* 深绿色 */
}

.login-type {
  margin-bottom: 15px;
}

/* 新添加的样式，用于美化单选按钮组 */
.login-type-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.login-type .el-radio {
  margin: 0 10px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>