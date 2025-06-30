<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>
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
        <small class="text-muted" v-if="state.password && state.confirmedPassword">
          Match: {{ state.password === state.confirmedPassword ? '✅' : '❌' }}
        </small>
      </b-form-group>

      <b-button 
        type="submit" 
        variant="success" 
        class="w-100"
        @click="register"
        :disabled="state.isLoading"
      >
        {{ state.isLoading ? 'Creating Account...' : 'Register' }}
      </b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Registration failed: {{ state.submitError }}
      </b-alert>

      <b-alert
        variant="success"
        class="mt-3"
        v-if="state.successMessage"
        show
      >
        {{ state.successMessage }}
      </b-alert>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
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
      
      // Special handling for confirm password
      if (field === v$.value.confirmedPassword) {
        // Check if passwords actually match
        const passwordsMatch = state.password === state.confirmedPassword;
        
        // If field is dirty and passwords match and not empty, return true
        if (field.$dirty && passwordsMatch && state.confirmedPassword.length > 0) {
          return true;
        }
        
        // If field is dirty but passwords don't match or field is empty, return false
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

    const register = async () => {
      console.log('Register clicked!');
      alert('ההרשמה בוצעה בהצלחה! המשך להתחברות');
      
      // Temporarily disable validation to test
      // const valid = await v$.value.$validate();
      // console.log('Validation result:', valid);
      
      // if (!valid) {
      //   console.log('Form validation failed');
      //   return;
      // }

      state.isLoading = true;
      state.submitError = null;
      state.successMessage = null;

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
          state.successMessage = 'Registration successful! Redirecting to login...';
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 500);
        }
      } catch (err) {
        console.error('Registration error:', err);
        
        if (err.response) {
          state.submitError = err.response.data?.message || 'Registration failed';
        } else {
          state.submitError = 'Network error. Please try again.';
        }
      } finally {
        state.isLoading = false;
      }
    };

    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
      getValidationState,
      onPasswordChange,
      onConfirmPasswordChange,
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

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
}

.btn-success:hover {
  background: linear-gradient(45deg, #218838, #1ea080);
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>