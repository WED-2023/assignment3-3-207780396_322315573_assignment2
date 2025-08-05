<template>
  <div class="container mt-4">
    <div class="page-header mb-4">
      <h1 class="page-title">
        <i class="fas fa-users me-2"></i>
        My Family Recipes
      </h1>
    </div>

    <!-- Family Recipes Preview List -->
    <RecipePreviewList 
      recipeType="familyRecipes"
      :numberOfRecipes="3"
      @favorite-updated="handleFavoriteUpdate"
    />

    <!-- Empty State -->
    <div v-if="!loading && !hasRecipes" class="empty-state text-center mt-5">
      <i class="fas fa-family text-muted" style="font-size: 4rem;"></i>
      <h3 class="mt-3 text-muted">No family recipes</h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">טוען...</span>
      </div>
      <p class="mt-2">Loading</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: 'FamilyRecipesPage',
  components: {
    RecipePreviewList
  },
  data() {
    return {
      loading: false,
      hasRecipes: true
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = internalInstance.appContext.config.globalProperties.$router;

    // Check if user is logged in
    if (!store.username) {
      router.push('/login');
    }

    return { store, internalInstance };
  },
  async mounted() {
    await this.checkIfHasRecipes();
  },
  methods: {
    handleFavoriteUpdate(recipeId, isFavorite) {
      console.log(`Recipe ${recipeId} favorite status: ${isFavorite}`);
    },

    async checkIfHasRecipes() {
      this.loading = true;
      try {
        const axios = this.internalInstance.appContext.config.globalProperties.axios;
        const store = this.internalInstance.appContext.config.globalProperties.store;
        
        const response = await axios.get(store.server_domain + '/users/familyRecipes');
        this.hasRecipes = response.data && response.data.length > 0;
      } catch (error) {
        console.error('Error checking family recipes:', error);
        this.hasRecipes = false;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 10px;
}

.info-card .card {
  border: none;
  background: transparent;
}

.empty-state {
  padding: 3rem 1rem;
  background: #f8f9fa;
  border-radius: 15px;
  margin-top: 2rem;
}

.empty-state i {
  margin-bottom: 1rem;
}

.text-center {
  direction: rtl;
}

/* RTL Support */
.container {
  direction: ltr;
  text-align: left;
}

/* Loading animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
}
</style>