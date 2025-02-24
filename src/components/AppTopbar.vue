<template>
  <div class="topbar">
    <div class="left">
      <i class="fab fa-facebook"></i> <!-- Facebook 图标 -->
      <h1>grow your sales</h1>
    </div>
    <div class="right">
      <i class="fab fa-whatsapp"></i> <!-- WhatsApp 图标 -->
      <i class="fab fa-instagram"></i> <!-- Instagram 图标 -->
      <i class="fab fa-facebook-messenger"></i> <!-- Messenger 图标 -->
      <i class="fab fa-threads"></i> <!-- Threads 图标 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTopbar',
};
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #1877f2; /* Facebook 蓝色 */
  color: white;
  line-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: white; /* 白色文字 */
}

i {
  font-size: 24px;
  margin-right: 15px; /* 图标与文字间距 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: color 0.3s ease; /* 添加颜色过渡效果 */
}

i:hover {
  color: #f0f2f5; /* 鼠标悬停时图标颜色变浅 */
}

/* 调整最后一个图标的右边距 */
i:last-child {
  margin-right: 0;
}
</style>