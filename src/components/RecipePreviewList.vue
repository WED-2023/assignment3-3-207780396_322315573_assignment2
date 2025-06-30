<!-- <template>
  <div class="container">
    <h3>{{ title }}</h3>
    
    <div class="row">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          this.$root.store.server_domain + "/recipes/random"
        );
        const recipes = response.data.recipes;
        this.recipes = [];
        this.recipes.push(...recipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>

 -->


 <template>
  <div class="container">
    <h3>{{ title }}</h3>
    
    <div class="row">
      <div class="col-md-4 mb-3" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
    
    <!-- הודעה אם אין מתכונים -->
    <div v-if="recipes.length === 0 && !loading" class="text-center">
      <p>No recipes found.</p>
    </div>
    
    <!-- אינדיקטור טעינה -->
    <div v-if="loading" class="text-center">
      <p>Loading recipes...</p>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
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
    }
  },
  data() {
    return {
      recipes: [],
      loading: false,
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      this.loading = true;
      try {
        let endpoint = '';
        
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
            endpoint = `/recipes?number=${this.numberOfRecipes}`;
            break;
        }

        // קריאה לAPI עם ה-endpoint הנכון
        const response = await this.axios.get(
          this.$root.store.server_domain + endpoint
        );
        
        // תיקון: ה-API מחזיר array ישירות, לא אובייקט עם recipes
        const recipes = response.data;
        
        // בדיקה שזה באמת array
        if (Array.isArray(recipes)) {
          this.recipes = recipes;
        } else {
          console.error('Expected array but got:', recipes);
          this.recipes = [];
        }
        
      } catch (error) {
        console.error('Error fetching recipes:', error);
        
        // הצגת הודעת שגיאה ידידותית למשתמש
        if (error.response && error.response.status === 401) {
          console.log('User not authenticated - some features may be limited');
        }
        
        this.recipes = [];
      } finally {
        this.loading = false;
      }
    },
    
    // מתודה לרענון המתכונים (לכפתור "רענון" למשל)
    refreshRecipes() {
      this.updateRecipes();
    }
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}

.recipePreview {
  height: 100%;
}

/* וידוא שכל הכרטיסים באותו גובה */
.col-md-4 {
  display: flex;
  align-items: stretch;
}
</style>