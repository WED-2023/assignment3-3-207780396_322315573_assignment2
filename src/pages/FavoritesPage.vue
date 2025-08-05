<template>
  <div class="container mt-4">
    <h1 class="page-title mb-4">
      <i class="fas fa-heart text-danger me-2"></i>
      המתכונים המועדפים שלי
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">טוען מתכונים מועדפים...</p>
    </div>

    <!-- Favorites List - show when not loading and have favorites -->
    <div v-if="!loading && !showEmptyState">
      <RecipePreviewList 
        title="המתכונים שאהבתי"
        recipeType="favorites"
        :numberOfRecipes="20"
        @favorite-updated="handleFavoriteUpdate"
      />
    </div>

    <!-- Empty State - only show when not loading and no recipes -->
    <div v-if="!loading && showEmptyState" class="empty-state text-center mt-5">
      <i class="fas fa-heart-broken text-muted" style="font-size: 4rem;"></i>
      <h3 class="mt-3 text-muted">אין לך מתכונים מועדפים עדיין</h3>
      <p class="text-muted">חפש מתכונים והוסף אותם למועדפים כדי לראות אותם כאן</p>
      <router-link :to="{ name: 'search' }" class="btn btn-primary">
        <i class="fas fa-search me-2"></i>
        חפש מתכונים
      </router-link>
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
  color: #2c3e50;
  font-weight: 600;
}

.empty-state {
  padding: 3rem 1rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>