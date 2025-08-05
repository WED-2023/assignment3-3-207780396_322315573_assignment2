<template>
  <div class="container-fluid">
    <h1 class="title">Main Page</h1>

    <div class="row main-content">
      <!-- Left Column - Explore This Recipes -->
      <div class="col-md-6 left-column">
        <div class="recipes-section">
          <RecipePreviewList 
            ref="exploreRecipesList"
            title="Explore This Recipes" 
            class="explore-recipes" 
            recipeType="random"
            :numberOfRecipes="3"
          />
          
          <!-- Refresh Button -->
          <div class="text-center mt-3">
            <button 
              class="btn btn-outline-primary refresh-btn"
              @click="refreshExploreRecipes"
              :disabled="refreshing"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': refreshing }"></i>
              {{ refreshing ? 'Loading...' : 'Explore New Recipes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-md-6 right-column">
        <!-- For Logged-in Users - Additional Random Recipes -->
        <div v-if="store.username" class="recipes-section">
          <RecipePreviewList 
            title="More Recipes For You" 
            class="more-recipes" 
            recipeType="random"
            :numberOfRecipes="3"
          />
        </div>

        <!-- For Guests - Login/Register Options -->
        <div v-else class="auth-section">
          <div class="auth-container">
            <h3 class="auth-title">Join Our Recipe Community!</h3>
            <p class="auth-subtitle">
              Sign up to save your favorite recipes, view your recipe history, and get personalized recommendations.
            </p>
            
            <div class="auth-buttons">
              <router-link :to="{ name: 'login' }" class="btn btn-primary auth-btn">
                <i class="fas fa-sign-in-alt"></i>
                Login
              </router-link>
              
              <router-link :to="{ name: 'register' }" class="btn btn-success auth-btn">
                <i class="fas fa-user-plus"></i>
                Register
              </router-link>
            </div>
            
            <div class="features-list mt-4">
              <h5>What you'll get:</h5>
              <ul>
                <li><i class="fas fa-heart text-danger"></i> Save favorite recipes</li>
                <li><i class="fas fa-history text-info"></i> Track your recipe history</li>
                <li><i class="fas fa-star text-warning"></i> Get personalized recommendations</li>
                <li><i class="fas fa-share-alt text-success"></i> Share your own recipes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: 'MainPage',
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    
    const exploreRecipesList = ref(null);
    const refreshing = ref(false);

    const refreshExploreRecipes = async () => {
      if (exploreRecipesList.value) {
        refreshing.value = true;
        try {
          // Force refresh the recipes in the left column
          await exploreRecipesList.value.updateRecipes();
        } catch (error) {
          console.error('Error refreshing recipes:', error);
        } finally {
          refreshing.value = false;
        }
      }
    };

    return { 
      store,
      exploreRecipesList,
      refreshing,
      refreshExploreRecipes
    };
  }
};
</script>

<style lang="scss" scoped>
/* Base Container */
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.25rem;
  font-family: 'Manjari', sans-serif;
}

/* Main Title */
.title {
  text-align: center;
  color: #7db67d;
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'DynaPuff', cursive;
}

/* Layout */
.main-content {
  min-height: 80vh;
}

.left-column, 
.right-column {
  padding: 0 1rem;
}

/* Recipe Sections */
.recipes-section {
  background: #ffffff8a;
  border-radius: 15px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

/* Refresh Button */
.refresh-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid #4e9292;
  transition: all 0.3s ease;
  font-weight: 600;
  font-family: 'Manjari', sans-serif;
}

.refresh-btn:hover:not(:disabled) {
  background: #7db67d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 146, 146, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.fa-sync-alt {
  margin-right: 8px;
}

/* Auth Section */
.auth-section {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  background: linear-gradient(135deg, #98d3c877 0%, #98d3c8 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  font-family: 'DynaPuff', cursive;
}

.auth-subtitle {
  color: rgb(68, 65, 65);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  font-family: 'Manjari', sans-serif;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.auth-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  min-width: 120px;
  font-family: 'Manjari', sans-serif;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.btn-primary.auth-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-primary.auth-btn:hover {
  background: white;
  color: #a3c7a3;
}

.btn-success.auth-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;

}

.btn-success.auth-btn:hover {
    background: white;
    color: #a3c7a3;
}

/* Features List */
.features-list {
  text-align: left;
  color: rgb(68, 65, 65);
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  font-family: 'Manjari', sans-serif;
}

.features-list h5 {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-family: 'Manjari', sans-serif;
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: 0.5rem 0;
  font-size: 1rem;
  font-family: 'Manjari', sans-serif;
}

.features-list i {
  margin-right: 10px;
  width: 20px;
}

/* Deep Selectors for Recipe Components */
::v-deep .explore-recipes h3,
::v-deep .more-recipes h3 {
  color: #7db67d;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  font-family: 'DynaPuff', cursive;
}

::v-deep .recipe-preview {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

::v-deep .recipe-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .left-column, 
  .right-column {
    padding: 0;
    margin-bottom: 2rem;
  }
  
  .recipes-section {
    padding: 1.5rem;
  }
  
  .auth-container {
    padding: 2rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
  
  .auth-buttons {
    flex-direction: column;
  }
  
  .auth-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media (min-width: 769px) and (max-width: 991px) {
  .auth-buttons {
    flex-direction: column;
  }
}
</style>