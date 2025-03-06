<template>
  <div class="auth-container">
    <div class="left-panel">
      <div class="logo">
        <i class="fab fa-meta logo-icon"></i>
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
        <!-- 使用 el-tabs 实现标签页切换 -->
        <el-tabs v-model="activeTab" class="auth-tabs">
          <el-tab-pane label="邮箱" name="email">
            <el-form :model="form" label-width="0">
              <el-form-item v-if="showUsername">
                <el-input
                  v-model="form.username"
                  placeholder="用户名"
                  class="auth-input"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.email"
                  placeholder="邮箱地址"
                  class="auth-input"
                  @blur="validateEmail"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="密码"
                  class="auth-input"
                />
              </el-form-item>
              <el-form-item v-if="activeTab === 'email' && isRegister">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  class="auth-input"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="auth-button" @click="onSubmit">
                  {{ submitText }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号码" name="phone">
            <el-form :model="form" label-width="0">
              <el-form-item>
                <el-input
                  v-model="form.phone"
                  placeholder="手机号码"
                  class="auth-input"
                  @blur="validatePhone"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.code"
                  placeholder="短信验证码"
                  class="auth-input"
                >
                <template #append>
                    <el-button
                      type="primary"
                      :disabled="isCodeSending"
                      @click="sendCode"
                    >
                      {{ codeButtonText }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="auth-button" @click="onSubmit">
                  {{ submitText }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
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
import { ElTooltip, ElTabs, ElTabPane } from 'element-plus';

export default {
  name: 'AuthForm',
  components: {
    ElTooltip,
    ElTabs,
    ElTabPane,
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
    isRegister: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'switch-form', 'forgot-password', 'social-login'],
  data() {
    return {
      activeTab: 'phone', // 默认激活的标签页
      form: {
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        code: '',
      },
      isCodeSending: false,
      countdown: 0,
      codeButtonText: '发送验证码',
    };
  },
  methods: {
    onSubmit() {
      this.$emit('submit', { ...this.form, loginType: this.activeTab });
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
    validateEmail() {
      const email = this.form.email;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        this.$message.error('请输入有效的邮箱地址');
      } else {
        console.log('邮箱格式正确');
      }
    },
    validatePhone() {
      const phone = this.form.phone;
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        this.$message.error('请输入有效的手机号码');
        return false;
      }
      return true;
    },
    sendCode() {
      if (this.isCodeSending) return;

      if (!this.form.phone || !this.validatePhone()) {
        this.$message.error('请输入有效的手机号码');
        return;
      }

      this.isCodeSending = true;
      this.countdown = 60;

      setTimeout(() => {
        this.$message.success('验证码已发送');
      }, 1000);

      const timer = setInterval(() => {
        this.countdown--;
        this.codeButtonText = `${this.countdown}秒后重发`;

        if (this.countdown <= 0) {
          clearInterval(timer);
          this.isCodeSending = false;
          this.codeButtonText = '发送验证码';
        }
      }, 1000);
    }
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgba(240, 242, 245, 0.95),
    rgba(240, 242, 245, 0.95)
  );
  color: #2c3e50;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.logo {
  z-index: 2;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in-out;
}

.logo-icon {
  font-size: 80px;
  color: #1877f2;
}

.description {
  z-index: 2;
  max-width: 500px;
  text-align: center;
  animation: slideIn 1s ease-in-out;
}

.description h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.description p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.description ul {
  list-style: none;
  padding: 0;
}

.description ul li {
  font-size: 16px;
  margin-bottom: 10px;
  color: #2c3e50;
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
  color: #1877f2;
}

/* 调整 el-tabs 样式 */
.auth-tabs {
  margin-bottom: 20px;
}

.auth-tabs :deep(.el-tabs__nav) {
  display: flex;
  justify-content: center;
  width: 100%;
}

.auth-tabs :deep(.el-tabs__item) {
  flex: 1; /* 让两个标签平分宽度 */
  text-align: center;
  padding: 0 20px; /* 增加内边距 */
}

.auth-tabs :deep(.el-tabs__active-bar) {
  width: 50% !important; /* 激活条宽度为 50% */
  margin-left: 0; /* 对齐激活条 */
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
  background-color: #1877f2;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
}

.auth-button:hover {
  background-color: #1659b5;
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
  color: #1877f2;
}

.social-login {
  margin-top: 20px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.social-icon.facebook {
  color: #1877f2;
}

.social-icon.facebook:hover {
  color: #1659b5;
}

.social-icon.instagram {
  color: #e4405f;
}

.social-icon.instagram:hover {
  color: #c13584;
}

.social-icon.threads {
  color: #000000;
}

.social-icon.threads:hover {
  color: #333333;
}

.social-icon.messenger {
  color: #0084ff;
}

.social-icon.messenger:hover {
  color: #0066cc;
}

.social-icon.whatsapp {
  color: #25d366;
}

.social-icon.whatsapp:hover {
  color: #128c7e;
}

.auth-input :deep(.el-button) {
  background-color: var(--el-color-primary); /* 使用 Element Plus 的主题色 */
  color: white; /* 文字颜色 */
  border: none; /* 移除边框 */
  width: 100px;
  height: 40px;
  border-radius: 0 6px 6px 0;
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