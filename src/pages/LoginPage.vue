<template>
  <div class="container mt-4" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>
    <b-form @submit.prevent="login">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          placeholder="Enter your username"
        />
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          placeholder="Enter your password"
        />
      </b-form-group>

      <!-- Error message above button -->
      <div v-if="state.submitError" class="alert alert-danger mb-3" role="alert">
        {{ state.submitError }}
      </div>

      <b-button 
        type="submit" 
        variant="primary" 
        class="w-100"
        :disabled="state.isLoading"
      >
        {{ state.isLoading ? 'Logging in...' : 'Login' }}
      </b-button>

      <div class="mt-2">
        Don't have an account?
        <router-link to="/register" class="register-link">Register here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';

export default {
  name: 'LoginPage',
  setup() {
    const internalInstance = getCurrentInstance();
    
    const state = reactive({
      username: '',
      password: '',
      submitError: null,
      isLoading: false,
    });

    const login = async () => {
      console.log('Login clicked!');
      
      // Clear previous errors
      state.submitError = null;
      
      // Simple validation
      if (!state.username || !state.password) {
        state.submitError = "Please enter both username and password.";
        return;
      }

      state.isLoading = true;

      try {
        console.log('Attempting login with:', { username: state.username });
        
        const store = internalInstance.appContext.config.globalProperties.store;
        const axios = internalInstance.appContext.config.globalProperties.axios;
        
        const response = await axios.post(store.server_domain + '/Login', {
          username: state.username,
          password: state.password,
        });

        console.log('Login response:', response.data);

        if (response.status === 200) {
          // Login successful
          store.login(state.username);
          
          console.log('Store updated, username:', store.username);
          
          // Redirect to home page
          const router = internalInstance.appContext.config.globalProperties.$router;
          router.push('/');
        }
      } catch (err) {
        console.error('Login error:', err);
        
        if (err.response && err.response.status === 401) {
          // Handle specific "Username or Password incorrect" error
          state.submitError = "Username or Password incorrect. Please try again.";
        } else if (err.response) {
          state.submitError = err.response.data?.message || 'Login failed';
        } else {
          state.submitError = 'Network error. Please try again.';
        }
      } finally {
        state.isLoading = false;
      }
    };

    return { 
      state, 
      login
    };
  },
};
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;500;600&family=Manjari:wght@100;400;700&display=swap');

.container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  font-family: 'Manjari', sans-serif;
}

h2 {
  font-family: 'DynaPuff', cursive;
  color: #7db67d;
}

.btn-primary {
  background-color: #a3c7a3;
  border-color: #a3c7a3;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #8fb98f;
  border-color: #8fb98f;
  color: white;
}

.btn-primary:focus,
.btn-primary:active {
  background-color: #7aa87a;
  border-color: #7aa87a;
  color: white;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.5);
}

.btn-primary:disabled {
  background-color: #a3c7a3;
  border-color: #a3c7a3;
  opacity: 0.65;
}

.form-control:focus {
  border-color: #7db67d;
  box-shadow: 0 0 0 0.2rem rgba(125, 182, 125, 0.25);
}

.register-link {
  color: #a3c7a3;
  text-decoration: none;
}

.register-link:hover {
  color: #8fb98f;
  text-decoration: underline;
}

/* Custom alert styling */
.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.container * {
  font-family: 'Manjari', sans-serif;
}

.container h2 {
  font-family: 'DynaPuff', cursive;
}
</style>