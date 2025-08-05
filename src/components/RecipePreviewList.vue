<template>
  <div class="container">
    <h3>{{ title }}</h3>
    
    <div class="row">
      <div class="col-md-4 mb-3" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" :disabled="disabled" />
      </div>
    </div>
    
    <!-- הודעה אם אין מתכונים -->
    <div v-if="recipes.length === 0 && !loading" class="text-center">
      <p class="no-recipes-message">{{ getNoRecipesMessage() }}</p>
    </div>
    
    <!-- אינדיקטור טעינה -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading recipes...</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  emits: ['recipes-loaded', 'loading-changed'], // הוספת emits
  props: {
    title: {
      type: String,
      required: true,
    },
    // הוספת prop אופציונלי לסוג המתכונים
    recipeType: {
      type: String,
      default: 'random', // 'random', 'favorites', 'lastViewed', 'myRecipes', 'familyRecipes'
    },
    // הוספת prop לכמות מתכונים
    numberOfRecipes: {
      type: Number,
      default: 3
    },
    // האם הקומפוננט מושבת (לאורחים)
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const internalInstance = getCurrentInstance();
    
    return {
      store: internalInstance.appContext.config.globalProperties.store,
      axios: internalInstance.appContext.config.globalProperties.axios
    };
  },
  data() {
    return {
      recipes: [],
      loading: false,
    };
  },
  mounted() {
    console.log('RecipePreviewList mounted, recipeType:', this.recipeType);
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      console.log('updateRecipes called for:', this.recipeType);
      
      // אם הקומפוננט מושבת ומדובר במתכונים שצריכים התחברות, לא נטען כלום
      if (this.disabled && this.requiresLogin()) {
        console.log('Component disabled for', this.recipeType);
        return;
      }

      this.loading = true;
      this.$emit('loading-changed', true); // הודע לparent שהטעינה התחילה
      console.log('Started loading for:', this.recipeType);
      
      try {
        let endpoint = '';
        let params = {};
        
        // בחירת endpoint לפי סוג המתכונים
        switch (this.recipeType) {
          case 'favorites':
            endpoint = '/users/favorites';
            break;
          case 'lastViewed':
            endpoint = '/users/last-viewed';
            break;
          case 'myRecipes':
            endpoint = '/users/myRecipes';
            break;
          case 'familyRecipes':
            endpoint = '/users/familyRecipes';
            break;
          case 'random':
          default:
            endpoint = '/recipes';
            params.number = this.numberOfRecipes;
            // Add timestamp to prevent caching for random recipes
            params.timestamp = new Date().getTime();
            break;
        }
        
        console.log(`Fetching ${this.recipeType} recipes from ${endpoint}`);
        
        const response = await this.axios.get(this.store.server_domain + endpoint, { params });
        
        console.log('Recipe response:', response.data);
        
        // התאמת המבנה לפי סוג התגובה
        if (Array.isArray(response.data)) {
          this.recipes = response.data;
        } else if (response.data.recipes && Array.isArray(response.data.recipes)) {
          this.recipes = response.data.recipes;
        } else {
          this.recipes = [];
        }
        
        // הגבלת מספר המתכונים לפי הפרופ
        if (this.recipes.length > this.numberOfRecipes) {
          this.recipes = this.recipes.slice(0, this.numberOfRecipes);
        }
        
        console.log(`Loaded ${this.recipes.length} recipes`);
        
        // הודע לparent על המתכונים שנטענו
        this.$emit('recipes-loaded', this.recipes);
        
      } catch (error) {
        console.log('Error fetching recipes:', error);
        
        // אם זה שגיאת אימות למתכונים שדורשים התחברות, לא נציג שגיאה
        if (error.response && error.response.status === 401 && this.requiresLogin()) {
          this.recipes = [];
        } else {
          this.recipes = [];
          console.error('Failed to load recipes:', error);
        }
        
        // הודע לparent על המתכונים שנטענו (ריק במקרה של שגיאה)
        this.$emit('recipes-loaded', this.recipes);
        
      } finally {
        this.loading = false;
        this.$emit('loading-changed', false); // הודע לparent שהטעינה הסתיימה
      }
    },
    
    requiresLogin() {
      return ['favorites', 'lastViewed', 'myRecipes', 'familyRecipes'].includes(this.recipeType);
    },
    
    getNoRecipesMessage() {
      switch (this.recipeType) {
        case 'favorites':
          return 'No favorite recipes found. Start adding some!';
        case 'lastViewed':
          return 'No recently viewed recipes.';
        case 'myRecipes':
          return 'No personal recipes created yet.';
        case 'familyRecipes':
          return 'No family recipes added yet.';
        case 'random':
        default:
          return 'No recipes found.';
      }
    }
  },
};
</script>

<style scoped>
.container {
  min-height: 300px;
}

.no-recipes-message {
  color: #666;
  font-style: italic;
  margin: 2rem 0;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #7db67d;
}

.recipePreview {
  height: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-md-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding: 0 15px;
}

@media (max-width: 768px) {
  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 991px) {
  .col-md-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* אפקטים חזותיים */
h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.recipePreview {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipePreview:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>