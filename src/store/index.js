import { createStore } from 'vuex';
import api from '@/services/api'; // 引入 API 服务

const store = createStore({
  state: {
    isLoggedIn: false, // 用户是否登录
    user: null, // 用户信息
    token: null, // 登录令牌
    isLoading: false, // 加载状态
  },
  mutations: {
    // 设置登录状态
    SET_LOGIN_STATUS(state, status) {
      state.isLoggedIn = status;
    },
    // 设置用户信息
    SET_USER(state, user) {
      state.user = user;
    },
    // 设置登录令牌
    SET_TOKEN(state, token) {
      state.token = token;
    },
    // 设置加载状态
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    // 登录操作
    async login({ commit }, payload) {
      commit('SET_LOADING', true); // 设置加载状态
      try {
        const response = await api.login(payload);
        if (response.data.success) {
          commit('SET_LOGIN_STATUS', true);
          commit('SET_USER', response.data.user);
          commit('SET_TOKEN', response.data.token);
          localStorage.setItem('token', response.data.token); // 将 token 存储到 localStorage
          commit('SET_LOADING', false); // 关闭加载状态
          return true;
        } else {
          throw new Error('登录失败');
        }
      } catch (error) {
        commit('SET_LOADING', false); // 关闭加载状态
        console.error('登录失败:', error);
        throw error;
      }
    },
    // 注册操作
    async register({ commit }, payload) {
      commit('SET_LOADING', true); // 设置加载状态
      try {
        const response = await api.register(payload);
        if (response.data.success) {
          commit('SET_LOADING', false); // 关闭加载状态
          return true;
        } else {
          throw new Error(response.data.message || '注册失败');
        }
      } catch (error) {
        commit('SET_LOADING', false); // 关闭加载状态
        console.error('注册失败:', error);
        throw error;
      }
    },
    // 发送验证码
    async sendCode({ commit }, phone) {
      commit('SET_LOADING', true); // 设置加载状态
      try {
        const response = await api.sendCode(phone);
        if (response.data.success) {
          commit('SET_LOADING', false); // 关闭加载状态
          return true;
        } else {
          throw new Error('发送验证码失败');
        }
      } catch (error) {
        commit('SET_LOADING', false); // 关闭加载状态
        console.error('发送验证码失败:', error);
        throw error;
      }
    },
    // 登出操作
    logout({ commit }) {
      commit('SET_LOGIN_STATUS', false);
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      localStorage.removeItem('token'); // 清除 localStorage 中的 token
    },
  },
  getters: {
    // 获取登录状态
    isLoggedIn: (state) => state.isLoggedIn,
    // 获取用户信息
    user: (state) => state.user,
    // 获取登录令牌
    token: (state) => state.token,
    // 获取加载状态
    isLoading: (state) => state.isLoading,
  },
});

export default store;