<template>
  <div class="card h-100 recipe-card">
    <!-- תמונה עם overlay לחיצה -->
    <div class="image-container" @click="goToRecipe">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        :alt="recipe.title"
      />
      <div class="image-overlay">
        <i class="fas fa-eye"></i>
        <span>View Recipe</span>
      </div>
      
      <!-- אינדיקטורי דיאטה -->
      <div class="diet-indicators">
        <span v-if="recipe.vegetarian" class="badge badge-success" title="Vegetarian">
          🌱
        </span>
        <span v-if="recipe.vegan" class="badge badge-success" title="Vegan">
          🌿
        </span>
        <span v-if="recipe.glutenFree" class="badge badge-info" title="Gluten Free">
          🚫🍞
        </span>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <!-- כותרת -->
      <h5 class="card-title" @click="goToRecipe" style="cursor: pointer;">
        {{ recipe.title }}
      </h5>
      
      <!-- מידע על המתכון -->
      <div class="recipe-info mb-2">
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <span>{{ recipe.readyInMinutes }} minutes</span>
        </div>
        <div class="info-item">
          <i class="fas fa-heart"></i>
          <span>{{ recipe.popularity || recipe.aggregateLikes || 0 }} likes</span>
        </div>
      </div>

      <!-- אינדיקטורי סטטוס -->
      <div class="status-indicators mb-2">
        <span v-if="recipe.viewed" class="badge badge-secondary" title="Already viewed">
          👁️ Viewed
        </span>
        <span v-if="isFavorite" class="badge badge-danger" title="In favorites">
          ❤️ Favorite
        </span>
      </div>

      <!-- כפתורי פעולה -->
      <div class="mt-auto">
        <div class="action-buttons">
          <button 
            class="btn btn-primary btn-sm"
            @click="goToRecipe"
            title="View full recipe"
          >
            <i class="fas fa-eye"></i> View
          </button>
          
          <button 
            class="btn btn-outline-danger btn-sm"
            @click.stop="toggleFavorite"
            :class="{ 'btn-danger': isFavorite }"
            :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            :disabled="isToggling"
          >
            <i class="fas fa-heart"></i>
            {{ isFavorite ? 'Favorited' : 'Favorite' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFavorite: this.recipe.favorite || false,
      isToggling: false
    };
  },
  watch: {
    'recipe.favorite'(newVal) {
      this.isFavorite = newVal;
    }
  },
  methods: {
    goToRecipe() {
      // ניווט לעמוד המתכון
      this.$router.push(`/recipe/${this.recipe.id}`);
    },
    
    async toggleFavorite() {
      // אם המשתמש לא מחובר, הפנה להתחברות
      if (!this.$root.store.username) {
        alert('Please login to add favorites');
        this.$router.push('/login');
        return;
      }

      this.isToggling = true;

      try {
          // הוספה למועדפים
          const response = await this.axios.post('/users/favorites', {
            recipeId: this.recipe.id
          });
          
          if (response.status === 200) {
            // עדכן את הסטטוס מקומית
            this.isFavorite = true;
            alert('Recipe added to favorites!');
            
            // שלח event להורה שהמתכון נוסף למועדפים
            this.$emit('favorite-updated', this.recipe.id, true);
          }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        
        if (error.response && error.response.status === 409) {
          alert('Recipe already in favorites');
          this.isFavorite = true;
          this.$emit('favorite-updated', this.recipe.id, true);
        } else if (error.response && error.response.status === 401) {
          alert('Please login first');
          this.$router.push('/login');
        } else {
          alert('Failed to add to favorites');
        }
      } finally {
        this.isToggling = false;
      }
    }
  }
}
</script>

<style scoped>
.recipe-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  font-family: 'Manjari', sans-serif;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .recipe-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-family: 'Manjari', sans-serif;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.diet-indicators {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.diet-indicators .badge {
  font-size: 1rem;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Manjari', sans-serif;
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  font-family: 'Manjari', sans-serif;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Manjari', sans-serif;
}

.info-item i {
  color: #7db67d;
}

.status-indicators {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.status-indicators .badge {
  font-size: 0.75rem;
  font-family: 'Manjari', sans-serif;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.action-buttons .btn {
  flex: 1 1 calc(50% - 5px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-family: 'Manjari', sans-serif;
}

.action-buttons .btn-primary {
  background-color: #a3c7a3;
  border-color: #a3c7a3;
  color: white;
}

.action-buttons .btn-primary:hover {
  background-color: #7db67d;
  border-color: #7db67d;
  color: white;
}

.action-buttons .btn-primary:focus,
.action-buttons .btn-primary:active {
  background-color: #7db67d;
  border-color: #7db67d;
  color: white;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25);
}

.action-buttons .btn-outline-danger {
  background-color: transparent;
  border-color: #dc3545;
  color: #dc3545;
  transition: all 0.3s ease;
}

.action-buttons .btn-outline-danger:hover {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.3);
}

.action-buttons .btn-danger {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
  transition: all 0.3s ease;
}

.action-buttons .btn-danger:hover {
  background-color: #ff5252;
  border-color: #ff5252;
  color: white;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.4);
}

.action-buttons .btn-danger:focus,
.action-buttons .btn-danger:active {
  background-color: #e53e3e;
  border-color: #e53e3e;
  color: white;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25);
}

.card-title {
  font-size: 1.1rem;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  font-family: 'Manjari', sans-serif;
}

.card-title:hover {
  color: #7db67d;
  text-decoration: underline;
}

/* Bootstrap badge overrides */
.badge-success {
  background-color: #28a745;
  font-family: 'Manjari', sans-serif;
}

.badge-info {
  background-color: #17a2b8;
  font-family: 'Manjari', sans-serif;
}

.badge-secondary {
  background-color: #6c757d;
  font-family: 'Manjari', sans-serif;
}

.badge-danger {
  color: #ffffff;
  background-color: #dc3545;
  font-family: 'Manjari', sans-serif;
}
</style>