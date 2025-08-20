<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4 page-title">Register</h2>
    <b-form @submit.prevent="register">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          :state="getValidationState(v$.username)"
          @blur="v$.username.$touch()"
          placeholder="3-8 letters only"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          <div v-if="!v$.username.required">Username is required.</div>
          <div v-else-if="!v$.username.minLength || !v$.username.maxLength">
            Username must be 3–8 characters.
          </div>
          <div v-else-if="!v$.username.alpha">Username must contain only letters.</div>
        </b-form-invalid-feedback>
        <!-- Server-side username error -->
        <b-form-invalid-feedback v-if="state.fieldErrors.username" :state="false">
          {{ state.fieldErrors.username }}
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- First Name -->
      <b-form-group label="First Name" label-for="firstname">
        <b-form-input
          id="firstname"
          v-model="state.firstname"
          :state="getValidationState(v$.firstname)"
          @blur="v$.firstname.$touch()"
          placeholder="Your first name"
        />
        <b-form-invalid-feedback v-if="v$.firstname.$error">
          First name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Last Name -->
      <b-form-group label="Last Name" label-for="lastname">
        <b-form-input
          id="lastname"
          v-model="state.lastname"
          :state="getValidationState(v$.lastname)"
          @blur="v$.lastname.$touch()"
          placeholder="Your last name"
        />
        <b-form-invalid-feedback v-if="v$.lastname.$error">
          Last name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email -->
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          type="email"
          v-model="state.email"
          :state="getValidationState(v$.email)"
          @blur="v$.email.$touch()"
          placeholder="your.email@example.com"
        />
        <b-form-invalid-feedback v-if="v$.email.$error">
          <div v-if="!v$.email.required">Email is required.</div>
          <div v-else-if="!v$.email.email">Please enter a valid email address.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Country -->
      <b-form-group label="Country" label-for="country">
        <b-form-select
          id="country"
          v-model="state.country"
          :options="countries"
          :state="getValidationState(v$.country)"
          @change="v$.country.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.country.$error">
          Country is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          :state="getValidationState(v$.password)"
          @blur="v$.password.$touch()"
          @input="onPasswordChange"
          placeholder="5-10 chars, with number & special char"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-else-if="!v$.password.minLength || !v$.password.maxLength">
            Password must be 5–10 characters.
          </div>
          <div v-else-if="!v$.password.hasNumber">
            Password must contain at least one number.
          </div>
          <div v-else-if="!v$.password.hasSpecial">
            Password must contain at least one special character (!@#$%^&*).
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password" label-for="confirmedPassword">
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="state.confirmedPassword"
          :state="getValidationState(v$.confirmedPassword)"
          @input="onConfirmPasswordChange"
          placeholder="Repeat your password"
        />
        <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
          <div v-if="!v$.confirmedPassword.required">Confirmation is required.</div>
          <div v-else-if="!v$.confirmedPassword.sameAsPassword">
            Passwords do not match.
          </div>
        </b-form-invalid-feedback>
        <!-- Debug info -->
        <small class="text-muted debug-text" v-if="state.password && state.confirmedPassword">
          Match: {{ state.password === state.confirmedPassword ? '✅' : '❌' }}
        </small>
      </b-form-group>

      <b-button 
        type="submit" 
        variant="success" 
        class="w-100 register-btn"
        @click="register"
        :disabled="state.isLoading"
      >
        {{ state.isLoading ? 'Creating Account...' : 'Register' }}
      </b-button>

      <!-- General error alert -->
      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
        @dismissed="state.submitError = null"
      >
        {{ state.submitError }}
      </b-alert>

      <!-- Success alert -->
      <b-alert
        variant="success"
        class="mt-3"
        v-if="state.successMessage"
        show
      >
        {{ state.successMessage }}
      </b-alert>

      <div class="mt-2 login-link-text">
        Already have an account?
        <router-link to="/login" class="login-link">Login here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, sameAs, email } from '@vuelidate/validators';
import rawCountries from '../assets/countries';

// Custom validators for password
const hasNumber = (value) => /\d/.test(value);
const hasSpecial = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

export default {
  name: 'RegisterPage',
  setup() {
    const internalInstance = getCurrentInstance();
    
    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      country: '',
      password: '',
      confirmedPassword: '',
      submitError: null,
      successMessage: null,
      isLoading: false,
      fieldErrors: {
        username: null
      }
    });

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      firstname: { required },
      lastname: { required },
      email: { required, email },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        hasNumber,
        hasSpecial,
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs(() => state.password),
      },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      if (!field.$dirty) return null;
      
      // Check for server-side errors on username field
      if (field === v$.value.username && state.fieldErrors.username) {
        return false;
      }
      
      // Special handling for confirm password
      if (field === v$.value.confirmedPassword) {
        const passwordsMatch = state.password === state.confirmedPassword;
        
        if (field.$dirty && passwordsMatch && state.confirmedPassword.length > 0) {
          return true;
        }
        
        if (field.$dirty && (!passwordsMatch || state.confirmedPassword.length === 0)) {
          return false;
        }
        
        return null;
      }
      
      return field.$dirty ? !field.$invalid : null;
    };

    const onPasswordChange = () => {
      // Re-validate confirm password when password changes
      if (state.confirmedPassword && v$.value.confirmedPassword.$dirty) {
        v$.value.confirmedPassword.$touch();
      }
    };

    const onConfirmPasswordChange = () => {
      v$.value.confirmedPassword.$touch();
    };

    const clearErrors = () => {
      state.submitError = null;
      state.fieldErrors.username = null;
    };

    const handleServerError = (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      
      // Handle specific server-side validation errors
      switch (message) {
        case "Username taken":
          state.fieldErrors.username = "This username is already taken. Please choose another.";
          break;
        case "Username must be 3-8 characters long":
        case "Username must contain letters only":
          state.fieldErrors.username = message;
          break;
        case "Password must be 5-10 characters long":
        case "Password must contain at least one number":
        case "Password must contain at least one special character":
          state.submitError = message;
          break;
        case "All fields are required":
          state.submitError = "Please fill in all required fields.";
          break;
        default:
          state.submitError = message;
      }
    };

    const register = async () => {
      console.log('Register clicked!');
      
      // Clear previous errors
      clearErrors();
      
      // Simple validation - bypass Vuelidate for now
      if (!state.username || state.username.length < 3 || state.username.length > 8) {
        state.submitError = "Username must be 3-8 characters long.";
        return;
      }
      
      if (!/^[a-zA-Z]+$/.test(state.username)) {
        state.submitError = "Username must contain only letters.";
        return;
      }
      
      if (!state.firstname) {
        state.submitError = "First name is required.";
        return;
      }
      
      if (!state.lastname) {
        state.submitError = "Last name is required.";
        return;
      }
      
      if (!state.email || !/\S+@\S+\.\S+/.test(state.email)) {
        state.submitError = "Please enter a valid email address.";
        return;
      }
      
      if (!state.country || state.country === 'Select a country') {
        state.submitError = "Please select a country.";
        return;
      }
      
      if (!state.password || state.password.length < 5 || state.password.length > 10) {
        state.submitError = "Password must be 5-10 characters long.";
        return;
      }
      
      if (!/\d/.test(state.password)) {
        state.submitError = "Password must contain at least one number.";
        return;
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(state.password)) {
        state.submitError = "Password must contain at least one special character.";
        return;
      }
      
      if (state.password !== state.confirmedPassword) {
        state.submitError = "Passwords do not match.";
        return;
      }

      state.isLoading = true;

      try {
        console.log('Attempting registration with:', {
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          country: state.country
        });

        const store = internalInstance.appContext.config.globalProperties.store;
        const axios = internalInstance.appContext.config.globalProperties.axios;
        const router = internalInstance.appContext.config.globalProperties.$router;

        const response = await axios.post(store.server_domain + '/Register', {
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          country: state.country,
          email: state.email,
          password: state.password,
        });

        console.log('Registration response:', response.data);

        if (response.status === 201) {
          state.successMessage = 'ההרשמה בוצעה בהצלחה! מעביר אותך להתחברות...';
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (err) {
        console.error('Registration error:', err);
        handleServerError(err);
      } finally {
        state.isLoading = false;
      }
    };

    // Clear field errors when user starts typing
    const clearFieldError = (fieldName) => {
      if (state.fieldErrors[fieldName]) {
        state.fieldErrors[fieldName] = null;
      }
    };

    // Watch for changes in username to clear server errors
    const watchUsername = () => {
      clearFieldError('username');
    };

    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
      getValidationState,
      onPasswordChange,
      onConfirmPasswordChange,
      watchUsername,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;500;600;700&family=Manjari:wght@100;400;700&display=swap');

.page-title {
  font-family: 'DynaPuff', cursive !important;
  color: #7db67d !important;
  text-align: center;
}

body,
label,
.form-label,
input,
select,
option,
textarea,
.form-control,
.form-select,
.invalid-feedback,
.debug-text,
.login-link-text,
.alert,
small {
  font-family: 'Manjari', sans-serif !important;
  color: #666 !important;
}

.register-btn:hover {
  background-color: #7db67d !important;
  border-color: #7db67d !important;
  color: white !important;
}

.register-btn:focus,
.register-btn:active {
  background-color: #7db67d !important;
  border-color: #7db67d !important;
  color: white !important;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25) !important;
}

.login-link {
  color: #a3c7a3 !important;
  text-decoration: none;
  font-family: 'Manjari', sans-serif !important;
}

.login-link:hover {
  color: #7db67d !important;
  text-decoration: underline;
}

.form-control:focus,
.form-select:focus {
  border-color: #a3c7a3 !important;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25) !important;
  background-color: rgba(163, 199, 163, 0.05) !important;
}

.form-control,
.form-select {
  font-family: 'Manjari', sans-serif !important;
  color: #666 !important;
}

.container {
  background: #f8f9fa;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  min-height: 750px;
}

.form-group,
.mb-3,
.mb-4,
b-form-group:last-of-type {
  margin-bottom: 2rem !important;
  position: relative;
  height: auto;
  padding-bottom: 0;
}

b-form-group:last-of-type {
  margin-bottom: 2rem !important;
}

.register-btn {
  margin-top: 0 !important;
  margin-bottom: 0.25rem !important;
  background-color: #a3c7a3 !important;
  border-color: #a3c7a3 !important;
  color: white !important;
  font-family: 'Manjari', sans-serif !important;
  font-weight: 600;
}

.invalid-feedback {
  font-family: 'Manjari', sans-serif !important;
  color: #dc3545 !important;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  z-index: 1;
}

.debug-text {
  font-family: 'Manjari', sans-serif !important;
  color: #666 !important;
  position: absolute !important;
  top: 100% !important;
  left: 0;
  right: 0;
  margin-top: 0.5rem !important; 
  z-index: 1;
}

.form-group {
  position: relative;
}

/* Style for server-side error feedback */
.invalid-feedback[state="false"] {
  display: block;
  font-family: 'Manjari', sans-serif !important;
  color: #dc3545 !important;
}

.alert {
  font-family: 'Manjari', sans-serif !important;
}

.invalid-feedback {
  font-family: 'Manjari', sans-serif !important;
  color: #dc3545 !important;
}

.debug-text {
  font-family: 'Manjari', sans-serif !important;
  color: #666 !important;
}

.login-link-text {
  font-family: 'Manjari', sans-serif !important;
  color: #666 !important;
  text-align: center;
}
</style>