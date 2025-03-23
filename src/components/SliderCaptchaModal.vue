<template>
  <!-- 遮罩层 -->
  <div v-if="visible" class="slider-captcha-modal">
    <!-- 弹窗内容 -->
    <div class="slider-captcha-content">
      <div class="slider-captcha-header">
        <span>请完成滑动验证</span>
        <i class="el-icon-close close-icon" @click="onClose"></i>
      </div>
      <div class="slider-captcha-body">
        <div class="slider-track" ref="sliderTrack">
          <div class="slider-progress" :style="{ width: (thumbPosition + 30) + 'px' }"></div>
          <div
    class="slider-thumb"
    :style="{ left: thumbPosition + 'px' }"
    @mousedown="startDrag"
  ></div>
      </div>
        <div v-if="showSuccess" class="success-message">验证成功！</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDragging: false,
      thumbPosition: 0,
      maxPosition: 200, // 滑块最大可拖动距离
      showSuccess: false,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 每次打开弹窗时重置滑动状态
        this.thumbPosition = 0;
        this.showSuccess = false;
      }
    }
  },
  methods: {
    startDrag() {
      this.isDragging = true;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(event) {
        if (!this.isDragging) return;
        
        const sliderTrack = this.$refs.sliderTrack;
        if (!sliderTrack) return;

        const rect = sliderTrack.getBoundingClientRect();
        const trackWidth = sliderTrack.clientWidth; // 获取滑动条宽度
        this.maxPosition = trackWidth - 30; // 计算滑动的最大位置（30 是滑块宽度）

        let newPosition = event.clientX - rect.left;
        
        // 限制滑块范围，避免超出
        newPosition = Math.max(0, Math.min(newPosition, this.maxPosition));

        this.thumbPosition = newPosition;
    },
    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);

        // 判断是否滑动到了最右端（误差 5px 以内）
        if (this.thumbPosition >= this.maxPosition - 5) {
            this.showSuccess = true;
            this.$emit('success');

            setTimeout(() => {
            this.onClose();
            }, 1000);
        } else {
            this.thumbPosition = 0; // 滑动失败，重置滑块
        }
    },
    onClose() {
      this.$emit('update:visible', false);
      this.thumbPosition = 0;
      this.showSuccess = false;
    },
  },
};
</script>

<style scoped>
/* 遮罩层 */
.slider-captcha-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗内容 */
.slider-captcha-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  overflow: visible; /* 确保内容不会被截断 */
}

/* 弹窗头部 */
.slider-captcha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.slider-captcha-header span {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

/* 关闭按钮 */
.close-icon {
  cursor: pointer;
  font-size: 18px;
  color: #606266;
}

.close-icon:hover {
  color: #1877f2;
}

/* 滑动轨道 */
.slider-track {
  position: relative;
  width: 100%;
  height: 30px;
  background-color: #e3f2fd; /* 浅蓝色背景 */
  border-radius: 15px;
  overflow: hidden;
}

/* 滑动按钮 */
.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: #1877f2; /* 和进度条颜色匹配 */
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.3s ease;
}

.slider-thumb:hover {
  background-color: #1659b5;
}

/* 验证成功提示 */
.success-message {
  margin-top: 15px;
  font-size: 14px;
  color: #4caf50;
  font-weight: bold;
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

.slider-captcha-content {
  animation: fadeIn 0.3s ease-in-out;
}
.slider-progress {
  position: absolute;
  height: 100%;
  background-color: #1877f2; /* 深蓝色进度 */
  border-radius: 15px;
  transition: width 0.2s ease;
}

</style>