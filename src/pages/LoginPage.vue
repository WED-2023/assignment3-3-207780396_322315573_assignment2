<template>
  <div class="container mt-4" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>
    <b-form @submit.prevent="login">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          :state="getValidationState(v$.username)"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          :state="getValidationState(v$.password)"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button 
        type="submit" 
        variant="primary" 
        class="w-100"
        :disabled="v$.$invalid || state.isLoading"
      >
        {{ state.isLoading ? 'Logging in...' : 'Login' }}
      </b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Login failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

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

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const login = async () => {
      const valid = await v$.value.$validate();
      if (!valid) return;

      state.isLoading = true;
      state.submitError = null;

      try {
        console.log('Attempting login with:', { username: state.username });
        
        // תיקון: שימוש נכון ב-axios עם server domain
        const store = internalInstance.appContext.config.globalProperties.store;
        const axios = internalInstance.appContext.config.globalProperties.axios;
        
        const response = await axios.post(store.server_domain + '/Login', {
          username: state.username,
          password: state.password,
        });

        console.log('Login response:', response.data);

        if (response.status === 200) {
          // תיקון: שימוש נכון ב-store
          store.login(state.username);
          
          console.log('Store updated, username:', store.username);
          
          // הודעת הצלחה
          alert('Login successful!');
          
          // תיקון: שימוש נכון ב-router
          const router = internalInstance.appContext.config.globalProperties.$router;
          router.push('/');
        }
      } catch (err) {
        console.error('Login error:', err);
        
        if (err.response) {
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
      v$, 
      login, 
      getValidationState 
    };
  },
};
</script>

<style scoped>
.container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.btn-primary {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(45deg, #0056b3, #004085);
}
</style>
