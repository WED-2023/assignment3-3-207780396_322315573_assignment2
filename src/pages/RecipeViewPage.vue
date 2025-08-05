<template>
  <div class="recipe-view-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-3">Loading recipe...</p>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="recipe-content">
      <!-- Recipe Header -->
      <div class="recipe-header">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="recipe-title">
                {{ recipe.title }}
                <!-- Favorite indicator -->
                <i v-if="isAuthenticated && isFavorite" 
                   class="fas fa-heart favorite-indicator" 
                   title="This recipe is in your favorites"></i>
              </h1>
              <div class="recipe-meta">
                <div class="meta-item" v-if="recipe.readyInMinutes">
                  <i class="fas fa-clock"></i>
                  <span>{{ recipe.readyInMinutes }} minutes</span>
                </div>
                <div class="meta-item" v-if="recipe.servings">
                  <i class="fas fa-users"></i>
                  <span>{{ recipe.servings }} servings</span>
                </div>
                <div class="meta-item" v-if="recipe.aggregateLikes || recipe.popularity">
                  <i class="fas fa-heart"></i>
                  <span>{{ recipe.aggregateLikes || recipe.popularity || 0 }} likes</span>
                </div>
              </div>
              
              <!-- Diet Tags -->
              <div class="diet-tags" v-if="hasDietaryInfo">
                <span v-if="recipe.vegetarian" class="badge badge-success">Vegetarian</span>
                <span v-if="recipe.vegan" class="badge badge-success">Vegan</span>
                <span v-if="recipe.glutenFree" class="badge badge-info">Gluten Free</span>
              </div>

              <!-- Family Recipe Specific Info -->
              <div v-if="isRecipeType('family')" class="family-info mt-3">
                <div class="meta-item">
                  <i class="fas fa-user"></i>
                  <span><strong>Author:</strong> {{ recipe.author }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-calendar"></i>
                  <span><strong>When to make:</strong> {{ recipe.whenToMake }}</span>
                </div>
              </div>

              <!-- Favorite Action Button -->
              <div v-if="isAuthenticated" class="favorite-action mt-3">
                <button 
                  class="btn btn-favorite"
                  :class="isFavorite ? 'btn-favorite-status' : 'btn-add-favorite'"
                  @click="addToFavorites"
                  :disabled="isFavorite || favoritingInProgress"
                >
                  <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                  {{ isFavorite ? 'Recipe in Favorites' : 'Add to Favorites' }}
                </button>
              </div>
            </div>
            <div class="col-md-4">
              <div class="recipe-image-container">
                <img 
                  :src="recipe.image || defaultImage" 
                  :alt="recipe.title"
                  class="recipe-image"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Recipe Gallery -->
      <div v-if="isRecipeType('family') && familyImages.length > 0" class="family-images-section">
        <div class="container">
          <h3 class="section-title">
            <i class="fas fa-images"></i>
            Family Photos
          </h3>
          <div class="row">
            <div 
              v-for="(image, index) in familyImages" 
              :key="`family_img_${index}`"
              class="col-md-4 col-sm-6 mb-3"
            >
              <div class="family-image-container" @click="openImageModal(image, index)">
                <img 
                  :src="image.url" 
                  :alt="image.caption || `Family photo ${index + 1}`"
                  class="family-image"
                  @error="handleImageError"
                />
                <div class="image-overlay">
                  <i class="fas fa-search-plus"></i>
                </div>
                <div v-if="image.caption" class="image-caption">
                  {{ image.caption }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Body -->
      <div class="recipe-body">
        <div class="container">
          <div class="row">
            <!-- Ingredients Column -->
            <div class="col-md-6">
              <div class="ingredients-section">
                <h3 class="section-title">
                  <i class="fas fa-list-ul"></i>
                  Ingredients
                </h3>
                
                <!-- Spoonacular Recipe Ingredients -->
                <ul v-if="recipe.extendedIngredients && recipe.extendedIngredients.length > 0" class="ingredients-list">
                  <li 
                    v-for="(ingredient, index) in recipe.extendedIngredients" 
                    :key="`ext_${index}`"
                    class="ingredient-item"
                  >
                    {{ ingredient.original || `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim() }}
                  </li>
                </ul>
                
                <!-- User/Family Recipe Ingredients - Spoonacular Style -->
                <ul v-else-if="recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0" class="ingredients-list">
                  <li 
                    v-for="(ingredient, index) in recipe.ingredients" 
                    :key="`ing_${index}`"
                    class="ingredient-item"
                  >
                    {{ formatIngredientText(ingredient) }}
                  </li>
                </ul>
                
                <!-- Fallback for simple ingredients -->
                <div v-else-if="recipe.ingredients && typeof recipe.ingredients === 'string'" class="ingredients-text">
                  {{ recipe.ingredients }}
                </div>
                
                <div v-else class="no-ingredients">
                  <p class="text-muted">
                    No ingredients information available
                  </p>
                </div>
              </div>
            </div>

            <!-- Instructions Column -->
            <div class="col-md-6">
              <div class="instructions-section">
                <h3 class="section-title">
                  <i class="fas fa-tasks"></i>
                  Instructions
                </h3>
                
                <!-- Analyzed Instructions (Spoonacular) -->
                <ol v-if="recipe._instructions && recipe._instructions.length > 0" class="instructions-list">
                  <li 
                    v-for="(step, index) in recipe._instructions" 
                    :key="`step_${index}`"
                    class="instruction-step"
                  >
                    {{ step.step }}
                  </li>
                </ol>
                
                <!-- Simple Instructions - Fixed Display -->
                <div v-else-if="recipe.instructions" class="instructions-content">
                  <!-- If we have processed steps -->
                  <ol v-if="processedInstructionSteps.length > 1" class="instructions-list">
                    <li 
                      v-for="(step, index) in processedInstructionSteps" 
                      :key="`inst_${index}`"
                      class="instruction-step"
                    >
                      {{ step.step }}
                    </li>
                  </ol>
                  
                  <!-- If we have only one step or raw text -->
                  <div v-else class="instructions-text">
                    <div v-if="typeof recipe.instructions === 'string'" class="single-instruction">
                      {{ recipe.instructions }}
                    </div>
                    <div v-else-if="processedInstructionSteps.length === 1" class="single-instruction">
                      {{ processedInstructionSteps[0].step }}
                    </div>
                  </div>
                </div>
                
                <div v-else class="no-instructions">
                  <p class="text-muted">
                    No instructions available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" v-if="isAuthenticated">
        <div class="container">
          <div class="text-center">

          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h3>Recipe Not Found</h3>
        <p>The recipe you're looking for doesn't exist or has been removed.</p>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>

    <!-- Image Modal for larger view -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <span class="close-button" @click="closeImageModal">&times;</span>
        <img :src="currentModalImage.url" :alt="currentModalImage.caption" class="modal-image">
        <div v-if="currentModalImage.caption" class="modal-caption">
          {{ currentModalImage.caption }}
        </div>
        <!-- Navigation arrows if multiple images -->
        <div v-if="familyImages.length > 1" class="modal-navigation">
          <button @click="previousImage" class="nav-button prev-button">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="nextImage" class="nav-button next-button">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'RecipeViewPage',
  setup() {
    const internalInstance = getCurrentInstance();
    
    return {
      store: internalInstance.appContext.config.globalProperties.store,
      axios: internalInstance.appContext.config.globalProperties.axios,
      $router: internalInstance.appContext.config.globalProperties.$router,
      $route: internalInstance.appContext.config.globalProperties.$route
    };
  },
  data() {
    return {
      recipe: null,
      loading: true,
      recipeType: null,
      isFavorite: false,
      favoritingInProgress: false,
      defaultImage: 'https://via.placeholder.com/400x300?text=No+Image',
      // Gallery data
      familyImages: [],
      showImageModal: false,
      currentModalImage: null,
      currentImageIndex: 0
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.store.username;
    },
    hasDietaryInfo() {
      return this.recipe && (this.recipe.vegetarian || this.recipe.vegan || this.recipe.glutenFree);
    },
    processedInstructionSteps() {
      if (!this.recipe || !this.recipe.instructions) return [];
      
      // אם יש לנו _instructions מעובדות, השתמש בהן
      if (this.recipe._instructions && this.recipe._instructions.length > 0) {
        return this.recipe._instructions;
      }
      
      // אחרת עבד את ההוראות הרגילות
      return this.processSimpleInstructions(this.recipe.instructions);
    }
  },
  async created() {
    await this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      this.loading = true;
      try {
        const recipeId = this.$route.params.recipeId;
        console.log('Loading recipe with ID:', recipeId);

        // Determine recipe type based on ID format
        if (typeof recipeId === 'string') {
          if (recipeId.startsWith('u')) {
            this.recipeType = 'user';
          } else if (recipeId.startsWith('f')) {
            this.recipeType = 'family';
          } else {
            this.recipeType = 'spoonacular';
          }
        } else {
          this.recipeType = 'spoonacular';
        }

        // Fetch recipe data
        const response = await this.axios.get(
          this.store.server_domain + "/recipes/" + recipeId
        );

        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }

        const recipeData = response.data;
        this.processRecipeData(recipeData);

        // Mark recipe as viewed if user is authenticated (optional)
        if (this.isAuthenticated) {
          await this.markAsViewed(recipeId);
          await this.checkIfFavorite(recipeId);
        }

      } catch (error) {
        console.error("Error loading recipe:", error);
        if (error.response && error.response.status === 404) {
          this.$router.replace("/NotFound");
        } else {
          this.recipe = null;
        }
      } finally {
        this.loading = false;
      }
    },

    processRecipeData(data) {
      console.log('Processing recipe data:', data);
      console.log('Recipe type:', this.recipeType);

      if (this.recipeType === 'spoonacular') {
        // Process Spoonacular recipe with full data
        this.recipe = {
          ...data,
          _instructions: this.processInstructions(data.analyzedInstructions || [])
        };
      } else {
        // Process user or family recipe
        this.recipe = {
          ...data,
          _instructions: data.instructions ? this.processSimpleInstructions(data.instructions) : []
        };
        
        // אם זה מתכון משפחתי ויש לו גלריה, השתמש בה
        if (this.recipeType === 'family' && data.gallery && Array.isArray(data.gallery)) {
          this.familyImages = data.gallery;
          console.log('Family images loaded:', this.familyImages.length);
        } else {
          this.familyImages = [];
        }
      }

      console.log('Final processed recipe:', this.recipe);
    },

    processInstructions(analyzedInstructions) {
      if (!analyzedInstructions || analyzedInstructions.length === 0) {
        return [];
      }
      
      return analyzedInstructions
        .map((fstep) => {
          if (fstep.steps && fstep.steps.length > 0) {
            if (fstep.name) {
              fstep.steps[0].step = fstep.name + ': ' + fstep.steps[0].step;
            }
            return fstep.steps;
          }
          return [];
        })
        .reduce((a, b) => [...a, ...b], []);
    },

    processSimpleInstructions(instructions) {
      if (typeof instructions === 'string') {
        // Split by newlines, periods, or numbers
        return instructions
          .split(/\n|\d+\.\s*/)
          .filter(step => step.trim().length > 0)
          .map((step, index) => ({
            number: index + 1,
            step: step.trim()
          }));
      } else if (Array.isArray(instructions)) {
        return instructions.map((step, index) => ({
          number: index + 1,
          step: typeof step === 'string' ? step : step.step || step
        }));
      }
      return [];
    },

    formatIngredientText(ingredient) {
      let text = '';
      
      // אם יש כמות (amount) תקינה
      if (ingredient.amount !== null && ingredient.amount !== undefined && ingredient.amount !== '') {
        text += ingredient.amount;
        
        // אם יש יחידה ושהיא לא "as needed"
        if (ingredient.unit && ingredient.unit !== 'as needed') {
          text += ' ' + ingredient.unit;
        }
        
        // הוסף את השם
        text += ' ' + ingredient.name;
        
        // אם היחידה היא "as needed", הוסף אותה בסוף
        if (ingredient.unit === 'as needed') {
          text += ', ' + ingredient.unit;
        }
      } 
      // אם אין כמות אבל יש יחידה (כמו "as needed")
      else if (ingredient.unit) {
        text = ingredient.unit + ' ' + ingredient.name;
      }
      // אם יש רק שם
      else {
        text = ingredient.name;
      }
      
      return text;
    },

    // Gallery Methods
    openImageModal(image, index) {
      this.currentModalImage = image;
      this.currentImageIndex = index;
      this.showImageModal = true;
      // מנע גלילה של הגוף כשהמודל פתוח
      document.body.style.overflow = 'hidden';
    },

    closeImageModal() {
      this.showImageModal = false;
      this.currentModalImage = null;
      // החזר גלילה
      document.body.style.overflow = 'auto';
    },

    nextImage() {
      if (this.currentImageIndex < this.familyImages.length - 1) {
        this.currentImageIndex++;
      } else {
        this.currentImageIndex = 0; // חזור להתחלה
      }
      this.currentModalImage = this.familyImages[this.currentImageIndex];
    },

    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else {
        this.currentImageIndex = this.familyImages.length - 1; // לך לסוף
      }
      this.currentModalImage = this.familyImages[this.currentImageIndex];
    },

    async markAsViewed(recipeId) {
      try {
        await this.axios.post(
          this.store.server_domain + "/users/markViewed",
          { recipeId }
        );
        console.log('Recipe marked as viewed successfully');
      } catch (error) {
        console.log("Viewed endpoint not available or error:", error.response?.status);
      }
    },

    async checkIfFavorite(recipeId) {
      try {
        const response = await this.axios.get(
          this.store.server_domain + "/users/favorites"
        );
        
        if (response.data && Array.isArray(response.data)) {
          this.isFavorite = response.data.some(fav => {
            const favId = fav.id || fav.recipe_id;
            return favId && favId.toString() === recipeId.toString();
          });
        }
        console.log('Favorite status checked:', this.isFavorite);
      } catch (error) {
        console.log("Error checking favorites or endpoint not available:", error.response?.status);
        this.isFavorite = false;
      }
    },

    async addToFavorites() {
      if (!this.isAuthenticated || this.isFavorite) return;

      this.favoritingInProgress = true;
      try {
        const recipeId = this.$route.params.recipeId;
        
        await this.axios.post(
          this.store.server_domain + "/users/favorites",
          { recipeId }
        );
        
        this.isFavorite = true;
        console.log('Recipe added to favorites');
        
      } catch (error) {
        console.error("Error adding to favorites:", error);
        
        if (error.response?.status === 404) {
          alert("Favorites feature is not available at the moment.");
        } else if (error.response?.status === 401) {
          alert("Please log in to add favorites.");
        } else if (error.response?.status === 409) {
          this.isFavorite = true;
        } else {
          alert("Error adding to favorites. Please try again.");
        }
      } finally {
        this.favoritingInProgress = false;
      }
    },

    isRecipeType(type) {
      return this.recipeType === type;
    },

    formatInstructions(instructions) {
      if (!instructions) return '';
      return instructions.replace(/\n/g, '<br>');
    },

    handleImageError(event) {
      event.target.src = this.defaultImage;
    }
  }
};
</script>

<style scoped>
.recipe-view-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #59c29a;
}

/* Recipe Header */
.recipe-header {
  background: linear-gradient(135deg, #baebde 0%, #3ea189 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 0;
}

.recipe-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.favorite-indicator {
  color: #ff6b6b;
  font-size: 2rem;
  animation: heartbeat 1.5s ease-in-out infinite;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.favorite-action {
  margin-top: 1rem;
}

.btn-favorite {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid;
  backdrop-filter: blur(10px);
}

.btn-add-favorite {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-add-favorite:hover:not(:disabled) {
  background: rgba(255, 107, 107, 0.9);
  border-color: #ff6b6b;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.btn-favorite-status {
  background: rgba(255, 107, 107, 0.9);
  color: white;
  border-color: #ff6b6b;
  cursor: default;
}

.btn-favorite-status:hover {
  background: rgba(255, 107, 107, 0.9);
  border-color: #ff6b6b;
  color: white;
  transform: none;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.btn-favorite:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-favorite i {
  margin-right: 8px;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.meta-item i {
  color: #ffd700;
}

.diet-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 20px;
}

.family-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.family-info .meta-item {
  margin-bottom: 0.5rem;
}

.recipe-image-container {
  text-align: center;
}

.recipe-image {
  max-width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 3px solid rgba(255,255,255,0.2);
}

/* Family Images Section */
.family-images-section {
  background: #f8f9fa;
  padding: 3rem 0;
  margin-top: 2rem;
}

.family-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.family-image-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.family-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.family-image-container:hover .family-image {
  transform: scale(1.05);
}

.family-image-container .image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.family-image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  font-size: 2rem;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  z-index: 1001;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(0,0,0,0.8);
}

.modal-caption {
  padding: 1rem;
  text-align: center;
  background: white;
  font-size: 1.1rem;
  color: #333;
}

.modal-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.nav-button {
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;
  pointer-events: all;
}

.nav-button:hover {
  background: rgba(0,0,0,0.8);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Recipe Body */
.recipe-body {
  background: white;
  padding: 3rem 0;
}

.section-title {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #007bff;
}

.ingredients-section, .instructions-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  height: 100%;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.ingredients-list, .instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.ingredient-item:hover {
  transform: translateX(5px);
}

.ingredient-name {
  font-weight: 600;
}

.instruction-step {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border-left: 4px solid #6abd8f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  line-height: 1.6;
  counter-increment: step-counter;
  position: relative;
}

.instructions-list {
  counter-reset: step-counter;
}

.instruction-step::before {
  content: counter(step-counter);
  background: #60af8e;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: absolute;
  left: -15px;
  top: 1.5rem;
  font-size: 0.9rem;
}

.instructions-text, .ingredients-text {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  line-height: 1.8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.single-instruction {
  white-space: pre-wrap;
  line-height: 1.6;
}

.no-ingredients, .no-instructions {
  text-align: center;
  padding: 2rem;
}

/* Action Buttons */
.action-buttons {
  background: #f8f9fa;
  padding: 2rem 0;
  border-top: 1px solid #dee2e6;
}

.btn-lg {
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-title {
    font-size: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .favorite-indicator {
    font-size: 1.5rem;
  }
  
  .recipe-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .recipe-image {
    height: 200px;
    margin-bottom: 2rem;
  }
  
  .family-image {
    height: 150px;
  }
  
  .ingredients-section, .instructions-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
  }
  
  .instruction-step::before {
    position: relative;
    left: auto;
    top: auto;
    margin-bottom: 1rem;
  }
  
  .instruction-step {
    border-left: none;
    border-top: 4px solid #94e6ca;
  }
  
  .ingredient-item {
    border-left: none;
    border-top: 4px solid #28a745;
  }

  .btn-favorite {
    width: 100%;
    font-size: 0.9rem;
    padding: 10px 20px;
  }
  
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .family-images-section {
    padding: 2rem 0;
  }
}

</style>