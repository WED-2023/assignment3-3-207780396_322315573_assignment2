<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar">
      <div class="container">
        <!-- Navbar Toggler for Mobile -->
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Left Side Navigation -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link :to="{ name: 'main' }" class="nav-link">
                <i class="fas fa-home me-1"></i>
                Main Page
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'search' }" class="nav-link">
                <i class="fas fa-search me-1"></i>
                Search Recipes
              </router-link>
            </li>
            
            <!-- Create Recipe Button (Only when logged in) - פותח מודאל -->
            <li class="nav-item" v-if="store.username">
              <a 
                class="nav-link"
                @click="showCreateModal = true"
                href="#"
                role="button"
              >
                <i class="fas fa-plus-circle me-1"></i>
                Create Recipe
              </a>
            </li>
            
            <!-- Personal Area Dropdown (Only when logged in) -->
            <li class="nav-item dropdown" v-if="store.username" @mouseenter="showDropdown" @mouseleave="hideDropdown">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                id="personalDropdown"
                role="button" 
                @click.prevent="toggleDropdown"
              >
                <i class="fas fa-user-circle me-1"></i>
                My Profile
              </a>
              <ul class="dropdown-menu" :class="{ show: isDropdownOpen }" aria-labelledby="personalDropdown">
                <li>
                  <router-link :to="{ name: 'favorites' }" class="dropdown-item">
                    <i class="fas fa-heart me-2 text-danger"></i>
                    My Favorites
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'myRecipes' }" class="dropdown-item">
                    <i class="fas fa-book me-2 text-primary"></i>
                    My Recipes
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'familyRecipes' }" class="dropdown-item">
                    <i class="fas fa-users me-2 text-success"></i>
                    My Family Recipes
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Right Side Navigation -->
          <ul class="navbar-nav">
            <!-- About Page -->
            <li class="nav-item">
              <router-link :to="{ name: 'about' }" class="nav-link">
                <i class="fas fa-info-circle me-1"></i>
                About
              </router-link>
            </li>

            <!-- User Section -->
            <span v-if="!store.username" class="navbar-text me-3">
              <i class="fas fa-user-circle me-1"></i>
              Hello, Guest
            </span>
            
            <!-- Logged in user - just text -->
            <span v-if="store.username" class="navbar-text me-3">
              <i class="fas fa-user me-1"></i>
              Hello {{ store.username }}
            </span>

            <!-- Logout Button -->
            <li class="nav-item" v-if="store.username">
              <a 
                class="nav-link logout-link" 
                @click="logout"
                href="#"
                role="button"
                title="התנתק מהמערכת"
              >
                <i class="fas fa-sign-out-alt me-1"></i>
                Logout
              </a>
            </li>

            <!-- Login/Register (Only when not logged in) -->
            <li class="nav-item" v-if="!store.username">
              <router-link :to="{ name: 'register' }" class="nav-link">
                <i class="fas fa-user-plus me-1"></i>
                Sign Up
              </router-link>
            </li>
            <li class="nav-item" v-if="!store.username">
              <router-link :to="{ name: 'login' }" class="nav-link">
                <i class="fas fa-sign-in-alt me-1"></i>
                Log In
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <router-view />
    </div>

    <!-- Create Recipe Modal -->
    <CreateRecipeModal 
      v-model="showCreateModal"
      @recipe-created="onRecipeCreated"
    />
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import CreateRecipeModal from './components/CreateRecipeModal.vue';

export default {
  name: "App",
  components: {
    CreateRecipeModal
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    
    const isDropdownOpen = ref(false);
    const showCreateModal = ref(false);

    const logout = async () => {
      try {
        // שליחת בקשת logout לשרת
        const axios = internalInstance.appContext.config.globalProperties.axios;
        await axios.post(store.server_domain + '/logout');
      } catch (error) {
        console.error('Logout error:', error);
        // גם אם יש שגיאה, נבצע logout מקומי
      } finally {
        // ניקוי המידע המקומי
        store.logout();
        toast("התנתקות", "התנתקת בהצלחה!", "success");
        
        // הפניה לדף הבית
        router.push("/").catch(() => {});
      }
    };

    const showDropdown = () => {
      isDropdownOpen.value = true;
    };

    const hideDropdown = () => {
      isDropdownOpen.value = false;
    };

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    // טיפול ביצירת מתכון חדש
    const onRecipeCreated = (newRecipe) => {
      console.log('New recipe created:', newRecipe);
      
      // הציג הודעת הצלחה נוספת
      toast('מתכון נוצר', 'המתכון נוצר בהצלחה!', 'success');
      
      // סגור את המודאל
      showCreateModal.value = false;
      
      // דוגמה: הפניה לדף המתכון החדש
      if (newRecipe.id) {
        router.push(`/recipe/${newRecipe.id}`).catch(() => {});
      }
    };

    return { 
      store, 
      logout, 
      isDropdownOpen,
      showDropdown,
      hideDropdown,
      toggleDropdown,
      showCreateModal,
      onRecipeCreated
    };
  }
}
</script>

<style lang="scss">
@use "@/scss/form-style.scss" as *;

:root {
  --primary-color: #7db67d;
  --primary-dark: #5a9a5a;
  --primary-light: #a3c7a3;
}

#app {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  font-family: 'Arial Rounded MT Bold', 'Arial Black', 'Arial', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.custom-navbar {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;
  font-family: 'DynaPuff', cursive;


  .navbar-brand {
    font-weight: bold;
    font-size: 1.5rem;
    color: #333;

    &:hover {
      color: var(--primary-color);
      text-decoration: none;
    }
  }

  .nav-link {
    color: var(--primary-color);
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(125, 182, 125, 0.15);
      color: var(--primary-dark);
      border-radius: 5px;
      text-decoration: none;
    }
  }

  .navbar-text {
    color: var(--primary-color);
    font-weight: 600;
    cursor: default;
    
    &:hover {
      color: var(--primary-color); // שומר על אותו צבע
      background-color: transparent; // בלי רקע
    }
  }

  .nav-link.router-link-active {
    color: var(--primary-dark);
    background-color: rgba(125, 182, 125, 0.1);
    font-weight: 700;
    border-radius: 5px;

    &:hover {
      background-color: rgba(125, 182, 125, 0.2);
      color: var(--primary-dark);
    }
  }
}

// עיצוב מיוחד לקישור logout
.logout-link {
  color: var(--primary-color) !important;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(125, 182, 125, 0.15);
    color: var(--primary-dark) !important;
    border-radius: 5px;
    text-decoration: none;
  }
}

.btn-outline-dark {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: transparent;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(125, 182, 125, 0.25);
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &:active {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
    color: white;
  }
}

.dropdown-menu {
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  border: none;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  background-color: white;
  text-align: right;
  direction: rtl;
  z-index: 9999 !important; /* רק הוסיפי את השורה הזו */


  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    z-index: 10000 !important;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
    color: var(--primary-color);
    font-weight: 600;
    font-family: 'DynaPuff', cursive;

    &:hover {
      background-color: rgba(182, 143, 125, 0.1);
      color: var(--primary-dark);
    }

    i {
      width: 20px;
    }
  }
}

.logout-btn {
  color: #dc3545;

  &:hover {
    background-color: #f8d7da;
    color: #721c24;
  }
}

.main-content {
  min-height: calc(100vh - 76px);
  padding-top: 0px;
  padding-bottom: 10px;

  .page-title,
  .section-title {
    color: var(--primary-color);
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
}

.spinner-border {
  color: var(--primary-color);
}

a {
  color: var(--primary-color);

  &:hover {
    color: var(--primary-dark);
  }
}

.btn-danger {
  color: white;

  &:hover,
  &:focus,
  &:active {
    color: white;
  }
}

.bg-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
}

.text-primary {
  color: var(--primary-color);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;

  &:hover,
  &:focus,
  &:active {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(125, 182, 125, 0.25);
  }
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);

  &:hover,
  &:focus,
  &:active {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(125, 182, 125, 0.25);
  }
}

h1, h2, h3, h4, h5, h6 {
  color: var(--primary-color);
  font-weight: 600;
}

@media (max-width: 768px) {
  .navbar-nav {
    text-align: center;

    .nav-item {
      margin: 0.25rem 0;
    }
  }

  .navbar-brand {
    font-size: 1.25rem;
  }

  .btn-navbar-logout {
    margin-top: 0.5rem;
    width: 100%;
  }
}

.navbar-toggler {
  border-color: #333;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
</style>