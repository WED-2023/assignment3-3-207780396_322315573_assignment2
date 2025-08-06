<template>
  <div class="container mt-4">
    <h1 class="page-title mb-4">
      <i class="fas fa-heart text-danger me-2"></i>
      My Favorites Recipes
    </h1>

    <!-- תמיד הצג את RecipePreviewList - בלי תנאים -->
    <div v-if="!loading">
      <h2 class="mb-4">Here are all the recipes you saved in your heart (and on the site) ❤️</h2>
      <RecipePreviewList 
        recipeType="favorites"
        :numberOfRecipes="20"
        @favorite-updated="handleFavoriteUpdate"
      />
    </div>

  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: 'FavoritesPage',
  components: {
    RecipePreviewList
  },
  data() {
    return {
      loading: true,
      showEmptyState: false
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    // Check if user is logged in
    if (!store.username) {
      router.push('/login');
    }

    return { store, axios };
  },
  async mounted() {
    await this.checkFavorites();
  },
  methods: {
    async checkFavorites() {
      try {
        console.log('Checking favorites...');
        const response = await this.axios.get(this.store.server_domain + '/users/favorites');
        
        console.log('Favorites response:', response.data);
        console.log('Favorites length:', response.data ? response.data.length : 0);
        
        // בדוק אם יש מתכונים מועדפים
        const favorites = Array.isArray(response.data) ? response.data : [];
        
        if (favorites.length === 0) {
          console.log('No favorites found - showing empty state');
          this.showEmptyState = true;
        } else {
          console.log(`Found ${favorites.length} favorites - showing recipe list`);
          this.showEmptyState = false;
        }
        
        console.log('Final state - loading:', this.loading, 'showEmptyState:', this.showEmptyState);
        
      } catch (error) {
        console.error('Error checking favorites:', error);
        this.showEmptyState = true;
      } finally {
        this.loading = false;
        console.log('Loading finished - loading:', this.loading, 'showEmptyState:', this.showEmptyState);
      }
    },

    handleFavoriteUpdate(recipeId, isFavorite) {
      console.log(`Recipe ${recipeId} favorite status: ${isFavorite}`);
      // אם מתכון הוסר מהמועדפים, בדוק שוב אם יש מועדפים
      if (!isFavorite) {
        this.checkFavorites();
      }
    }
  }
};
</script>

<style scoped>
.page-title {
  color: #7db67d;
  font-weight: 600;
  font-family: 'DynaPuff', cursive;
  text-align: center;
  margin-top: 0rem;
  margin-bottom: 0rem;
}

h2.mb-4 {
  font-family: 'Manjari', sans-serif !important;
  color: #5a9a5a !important;
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
  margin-bottom: 2rem !important;
}

.empty-state {
  padding: 3rem 1rem;
}


h3.mt-3 {
  font-family: 'Manjari', sans-serif !important;
  text-align: center;
  font-size: 32px !important;
  font-weight: 500;
  font-size: 1.5rem;
  margin-bottom: 0.5rem !important;
}

p.text-muted {
  font-family: 'Manjari', sans-serif !important;
  text-align: center;
  font-size: 22px !important;
  color: #666;
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #a3c7a3;
  border-color: #a3c7a3;
  font-family: 'Manjari', sans-serif
}
</style>