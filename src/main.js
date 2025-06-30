import { createApp, reactive } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { BContainer, BRow, BCol } from 'bootstrap-vue-3';
import Vuelidate from '@vuelidate/core';

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Shared store - תיקון וחיבור לסטור החיצוני
const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: 'http://localhost:3000',
  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log('login', this.username);
  },
  logout() {
    console.log('logout');
    localStorage.removeItem('username');
    this.username = undefined;
  },
});

// Axios configuration - עם credentials
axios.defaults.baseURL = store.server_domain;
axios.defaults.withCredentials = true; // מאפשר cookies

// Axios interceptors
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
}, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));

// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);
app.use(Vuelidate); 

// Register global BootstrapVue3 components
app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);

// Global store and utilities
app.config.globalProperties.store = store;

// Toast function for notifications
app.config.globalProperties.toast = (title, message, variant = 'success') => {
  // Simple console log for now - יכול להיות משופר עם toast library
  console.log(`${variant.toUpperCase()}: ${title} - ${message}`);
  
  // אפשר להוסיף כאן Bootstrap toast או library אחר
  // לעת עתה נשתמש ב-alert פשוט
  if (variant === 'success') {
    alert(`✅ ${title}: ${message}`);
  } else if (variant === 'danger' || variant === 'error') {
    alert(`❌ ${title}: ${message}`);
  } else {
    alert(`ℹ️ ${title}: ${message}`);
  }
};

// Mount app
app.mount('#app');