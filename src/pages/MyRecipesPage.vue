<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">
        <i class="fas fa-book me-2"></i>
        המתכונים האישיים שלי
      </h1>
    </div>

    <!-- My Recipes List -->
    <RecipePreviewList 
      title="המתכונים שיצרתי"
      recipeType="myRecipes"
      :numberOfRecipes="10"
      @favorite-updated="handleFavoriteUpdate"
    />

    <!-- Create Recipe Modal (placeholder) -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>יצירת מתכון חדש</h3>
          <button @click="showCreateModal = false" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>כאן יהיה הטופס ליצירת מתכון חדש</p>
          <p>(נכין את זה בשלב הבא)</p>
        </div>
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn btn-secondary">ביטול</button>
          <button @click="createRecipe" class="btn btn-primary">שמור מתכון</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: 'MyRecipesPage',
  components: {
    RecipePreviewList
  },
  data() {
    return {
      showCreateModal: false
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

    return { store };
  },
  methods: {
    handleFavoriteUpdate(recipeId, isFavorite) {
      console.log(`Recipe ${recipeId} favorite status: ${isFavorite}`);
      // Handle favorite update if needed
    },
    createRecipe() {
      // Placeholder for recipe creation
      alert('יצירת מתכון - בקרוב!');
      this.showCreateModal = false;
    }
  }
};
</script>

<style scoped>
.page-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>