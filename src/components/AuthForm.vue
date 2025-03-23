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
        <el-form :model="form" label-width="0">
          <el-tabs v-model="activeTab" class="auth-tabs">
            <el-tab-pane label="邮箱" name="email">
              <el-form-item>
                <el-input
                  v-model="form.email"
                  placeholder="邮箱地址"
                  class="auth-input"
                  @blur="validateEmail"
                />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="手机号码" name="phone">
              <el-form-item>
                <el-input
                  v-model="form.phone"
                  placeholder="手机号码"
                  class="auth-input"
                  @blur="validatePhone"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              class="auth-input"
            />
          </el-form-item>
          <el-form-item v-if="isRegister">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              class="auth-input"
              @blur="validatePasswordMatch"
            />
            <div
              v-if="passwordMismatchError"
              style="color: red; font-size: 12px"
            >
              密码和确认密码不一致
            </div>
          </el-form-item>
          <!-- 新增邮箱验证码输入框 -->
          <el-form-item v-if="activeTab === 'email'">
            <el-input
              v-model="form.emailCode"
              placeholder="邮箱验证码"
              class="auth-input"
            >
              <template #append>
                <el-button
                  type="primary"
                  :disabled="isSendEmailCodeDisabled"
                  @click="sendEmailCode"
                >
                  {{ emailCodeButtonText }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeTab === 'phone'">
            <el-input
              v-model="form.code"
              placeholder="短信验证码"
              class="auth-input"
            >
              <template #append>
                <el-button
                  type="primary"
                  :disabled="isSendSmsCodeDisabled"
                  @click="sendCode"
                >
                  {{ codeButtonText }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="auth-button"
              @click="onSubmit"
              :disabled="isRegisterDisabled"
            >
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
              <i
                class="fab fa-facebook social-icon facebook"
                @click="onSocialLogin('facebook')"
              ></i>
            </el-tooltip>
            <el-tooltip content="使用 Instagram 登录" placement="top">
              <i
                class="fab fa-instagram social-icon instagram"
                @click="onSocialLogin('instagram')"
              ></i>
            </el-tooltip>
            <el-tooltip content="使用 Threads 登录" placement="top">
              <i
                class="fab fa-threads social-icon threads"
                @click="onSocialLogin('threads')"
              ></i>
            </el-tooltip>
            <el-tooltip content="使用 Messenger 登录" placement="top">
              <i
                class="fab fa-facebook-messenger social-icon messenger"
                @click="onSocialLogin('messenger')"
              ></i>
            </el-tooltip>
            <el-tooltip content="使用 WhatsApp 登录" placement="top">
              <i
                class="fab fa-whatsapp social-icon whatsapp"
                @click="onSocialLogin('whatsapp')"
              ></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- 滑动验证弹窗 -->
    <SliderCaptchaModal
      v-model:visible="showCaptcha"
      @success="onCaptchaSuccess"
    />
  </div>
</template>

<script>
import { ElTooltip, ElTabs, ElTabPane } from "element-plus";
import SliderCaptchaModal from "./SliderCaptchaModal.vue"; // 引入滑动验证组件

export default {
  name: "AuthForm",
  components: {
    ElTooltip,
    ElTabs,
    ElTabPane,
    SliderCaptchaModal,
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
  emits: ["submit", "switch-form", "forgot-password", "social-login"],
  data() {
    return {
      showCaptcha: false, // 控制滑动验证组件的显示
      activeTab: "phone", // 默认激活的标签页
      passwordMismatchError: false, // 记录密码匹配错误状态
      isEmailValid: false, // 记录邮箱是否有效
      isEmailCodeSending: false,
      emailCodeButtonText: "发送验证码",
      form: {
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        code: "",
      },
      isPhoneValid: false, // 记录手机号是否有效，避免输入时提示
      isCodeSending: false,
      countdown: 0,
      codeButtonText: "发送验证码",
    };
  },
  computed: {
    // 密码是否匹配
    isPasswordMatch() {
      return (
        this.form.password &&
        this.form.confirmPassword &&
        this.form.password === this.form.confirmPassword
      );
    },

    // 发送验证码按钮是否可用（邮箱）
    isSendEmailCodeDisabled() {
      return (
        this.isEmailCodeSending || !this.isEmailValid || !this.isPasswordMatch
      );
    },

    // 发送验证码按钮是否可用（手机）
    isSendSmsCodeDisabled() {
      return this.isCodeSending || !this.isPhoneValid || !this.isPasswordMatch;
    },

    // 注册按钮是否可用
    isRegisterDisabled() {
      if (this.activeTab === "email") {
        return (
          !this.isEmailValid || !this.isPasswordMatch || !this.form.emailCode
        );
      } else if (this.activeTab === "phone") {
        return !this.isPhoneValid || !this.isPasswordMatch || !this.form.code;
      }
      return true;
    },
  },
  methods: {
    // 触发邮箱验证码发送前的校验
    sendEmailCode() {
      if (!this.isEmailValid) {
        this.$message.error("请输入有效的邮箱地址");
        return;
      }
      // 校验密码是否为空
      if (!this.form.password || !this.form.confirmPassword) {
        this.$message.error("请输入密码和确认密码");
        return;
      }
      // 校验密码是否一致
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error("密码和确认密码不一致，请重新输入");
        return;
      }
      // 显示滑块验证码弹窗
      this.showCaptcha = true;
    },
    validatePasswordMatch() {
      this.passwordMismatchError =
        this.form.confirmPassword.length > 0 &&
        this.form.password !== this.form.confirmPassword;
    },
    onSubmit() {
      this.$emit("submit", { ...this.form, loginType: this.activeTab });
    },
    onSwitchForm() {
      this.$emit("switch-form");
    },
    onForgotPassword() {
      this.$emit("forgot-password");
    },
    onSocialLogin(provider) {
      this.$emit("social-login", provider);
    },
    validateEmail() {
      const email = this.form.email.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        this.$message.error("请输入有效的邮箱地址");
        this.isEmailValid = false;
      } else {
        this.isEmailValid = true;
      }
    },
    validatePhone() {
      const phone = this.form.phone.trim(); // 去除空格
      const phoneRegex = /^1[3-9]\d{9}$/;

      if (phone.length === 0) {
        this.isPhoneValid = false;
        return;
      }

      if (!phoneRegex.test(phone)) {
        this.$message.error("请输入有效的手机号码");
        this.isPhoneValid = false;
      } else {
        this.isPhoneValid = true;
      }
    },
    sendCode() {
      // 先校验手机号是否为空
      if (!this.form.phone) {
        this.$message.error("请输入手机号码");
        return;
      }

      // 重新校验手机号
      this.validatePhone();

      // 若手机号无效，则不继续执行
      if (!this.isPhoneValid) {
        return;
      }

      // 校验密码是否为空
      if (!this.form.password || !this.form.confirmPassword) {
        this.$message.error("请输入密码和确认密码");
        return;
      }

      // 校验密码是否一致
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error("密码和确认密码不一致，请重新输入");
        return;
      }

      // 显示滑动验证码弹窗
      this.showCaptcha = true;
    },
    onCaptchaSuccess() {
      if (this.activeTab === "phone") {
        this.sendSmsCode();
      } else {
        this.sendVerifiedEmailCode();
      }
    },
    sendVerifiedEmailCode() {
      this.isEmailCodeSending = true;
      this.emailCodeButtonText = "60秒后重发";
      let countdown = 60;

      const timer = setInterval(() => {
        countdown--;
        this.emailCodeButtonText = `${countdown}秒后重发`;

        if (countdown <= 0) {
          clearInterval(timer);
          this.isEmailCodeSending = false;
          this.emailCodeButtonText = "发送验证码";
        }
      }, 1000);

      // 模拟后端 API 发送验证码
      setTimeout(() => {
        this.$message.success("验证码已发送，请检查邮箱");
      }, 1000);
    },
    sendSmsCode() {
      this.isCodeSending = true;
      this.countdown = 60;

      setTimeout(() => {
        this.$message.success("验证码已发送");
      }, 1000);

      const timer = setInterval(() => {
        this.countdown--;
        this.codeButtonText = `${this.countdown}秒后重发`;

        if (this.countdown <= 0) {
          clearInterval(timer);
          this.isCodeSending = false;
          this.codeButtonText = "发送验证码";
        }
      }, 1000);
    },
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

/* 统一调整 el-form-item 的间距 */
.auth-box :deep(.el-form-item) {
  margin-bottom: 15px; /* 统一设置为 15px */
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
.auth-tabs {
  margin-bottom: 0 !important;
}
</style>