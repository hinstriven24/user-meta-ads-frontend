<template>
  <el-card class="box-card">
    <h2>设置</h2>
    <p>这里是系统设置页面。</p>
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus'; // 引入 ElMessage 组件

export default {
  name: 'AppSettings',
  data() {
    return {
      form: {
        username: '',
        email: '',
      },
    };
  },
  methods: {
    onSubmit() {
      // 显示成功消息
      ElMessage({
        message: '保存成功！',
        type: 'success', // 成功样式
        duration: 2000, // 显示时长（毫秒）
        showClose: true, // 显示关闭按钮
      });
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: 20px;
  background-color: white; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 更强的阴影 */
}
</style>