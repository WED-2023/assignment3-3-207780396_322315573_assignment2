<template>
  <div class="search-page">
    <div class="container">
      <h1 class="page-title">Search Recipes</h1>
      
      <!-- Search Form -->
      <div class="search-form-container">
        <form @submit.prevent="searchRecipes" class="search-form">
          <div class="row">
            <!-- Recipe Name Search -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="recipeName">Recipe Name</label>
                <input
                  id="recipeName"
                  type="text"
                  v-model="searchForm.query"
                  class="form-control"
                  placeholder="Search for recipes..."
                  @keyup.enter="searchRecipes"
                />
              </div>
            </div>
            
            <!-- Number of Results -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="resultsCount">Number of Results</label>
                <select id="resultsCount" v-model="searchForm.number" class="form-control">
                  <option value="5">5 results</option>
                  <option value="10">10 results</option>
                  <option value="15">15 results</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Cuisine Type -->
            <div class="col-md-4">
              <div class="form-group">
                <label for="cuisine">Cuisine Type</label>
                <select id="cuisine" v-model="searchForm.cuisine" class="form-control">
                  <option value="">All Cuisines</option>
                  <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
                    {{ cuisine }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Diet Type -->
            <div class="col-md-4">
              <div class="form-group">
                <label for="diet">Diet Type</label>
                <select id="diet" v-model="searchForm.diet" class="form-control">
                  <option value="">All Diets</option>
                  <option v-for="diet in diets" :key="diet" :value="diet">
                    {{ diet }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Intolerance -->
            <div class="col-md-4">
              <div class="form-group">
                <label for="intolerance">Food Intolerance</label>
                <select id="intolerance" v-model="searchForm.intolerance" class="form-control">
                  <option value="">No Restrictions</option>
                  <option v-for="intolerance in intolerances" :key="intolerance" :value="intolerance">
                    {{ intolerance }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Search Button -->
          <div class="search-button-container">
            <button 
              type="submit" 
              class="btn btn-primary btn-search"
              :disabled="searching"
            >
              <i class="fas fa-search" :class="{ 'fa-spin': searching }"></i>
              {{ searching ? 'Searching...' : 'Search Recipes' }}
            </button>
            
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-clear ml-3"
              @click="clearSearch"
            >
              <i class="fas fa-times"></i>
              Clear
            </button>
          </div>
        </form>
      </div>

      <!-- Search Results -->
      <div class="search-results" v-if="hasSearched">
        <!-- Results Header -->
        <div class="results-header">
          <h3 v-if="searchResults.length > 0">
            Found {{ totalResults }} recipes
            <span v-if="searchForm.query">(searching for "{{ searchForm.query }}")</span>
          </h3>
          <h3 v-else>No recipes found</h3>
          
          <!-- Results Per Page Info -->
          <div class="results-info" v-if="searchResults.length > 0">
            Showing {{ searchResults.length }} recipes
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="searching" class="loading-container">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p class="mt-3">Searching for recipes...</p>
        </div>

        <!-- Recipe Results Grid -->
        <div v-else-if="searchResults.length > 0" class="results-grid">
          <div class="row">
            <div 
              class="col-md-4 mb-4" 
              v-for="recipe in searchResults" 
              :key="recipe.id"
            >
              <RecipePreview :recipe="recipe" />
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-else class="no-results">
          <div class="no-results-content">
            <i class="fas fa-search fa-3x mb-3"></i>
            <h4>No recipes found</h4>
            <p>Try adjusting your search criteria:</p>
            <ul>
              <li>Check your spelling</li>
              <li>Try broader search terms</li>
              <li>Remove some filters</li>
              <li>Try different cuisine or diet options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreview from '../components/RecipePreview.vue';

export default {
  name: 'SearchPage',
  components: {
    RecipePreview
  },
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
      searchForm: {
        query: '',
        number: '5',
        cuisine: '',
        diet: '',
        intolerance: ''
      },
      searchResults: [],
      totalResults: 0,
      searching: false,
      hasSearched: false,
      
      // Filter options
      cuisines: [
        "African", "Asian", "American", "British", "Cajun", "Caribbean", 
        "Chinese", "Eastern European", "European", "French", "German", 
        "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", 
        "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", 
        "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
      ],
      diets: [
        "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", 
        "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", 
        "Low FODMAP", "Whole30"
      ],
      intolerances: [
        "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", 
        "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
      ]
    };
  },
  computed: {
  },
  async created() {
    // Load search options from server if available
    await this.loadSearchOptions();
    
    // Check if there are URL parameters for search
    this.loadFromQuery();
  },
  methods: {
    async loadSearchOptions() {
      try {
        // Load cuisines, diets, and intolerances from server
        const [cuisinesRes, dietsRes, intolerancesRes] = await Promise.all([
          this.axios.get(this.store.server_domain + '/recipes/cuisines').catch(() => null),
          this.axios.get(this.store.server_domain + '/recipes/diets').catch(() => null),
          this.axios.get(this.store.server_domain + '/recipes/intolerances').catch(() => null)
        ]);
        
        if (cuisinesRes?.data) this.cuisines = cuisinesRes.data;
        if (dietsRes?.data) this.diets = dietsRes.data;
        if (intolerancesRes?.data) this.intolerances = intolerancesRes.data;
        
      } catch (error) {
        console.log('Using default search options');
      }
    },

    loadFromQuery() {
      const query = this.$route.query;
      if (query.q) this.searchForm.query = query.q;
      if (query.cuisine) this.searchForm.cuisine = query.cuisine;
      if (query.diet) this.searchForm.diet = query.diet;
      if (query.intolerance) this.searchForm.intolerance = query.intolerance;
      if (query.number) this.searchForm.number = query.number;
      
      // If there are search parameters, perform search
      if (query.q || query.cuisine || query.diet || query.intolerance) {
        this.searchRecipes();
      }
    },

    async searchRecipes() {
      this.searching = true;
      this.hasSearched = true;
      
      try {
        const params = {
          number: this.searchForm.number
        };
        
        // Add search parameters
        if (this.searchForm.query) params.query = this.searchForm.query;
        if (this.searchForm.cuisine) params.cuisine = this.searchForm.cuisine;
        if (this.searchForm.diet) params.diet = this.searchForm.diet;
        if (this.searchForm.intolerance) params.intolerance = this.searchForm.intolerance;
        
        console.log('Searching with params:', params);
        
        const response = await this.axios.get(
          this.store.server_domain + '/recipes/search',
          { params }
        );
        
        console.log('Search response:', response.data);
        
        if (response.data.results) {
          this.searchResults = response.data.results;
          this.totalResults = response.data.results.length;
        } else {
          this.searchResults = [];
          this.totalResults = 0;
        }
        
        // Update URL with search parameters
        this.updateURL();
        
      } catch (error) {
        console.error('Search error:', error);
        this.searchResults = [];
        this.totalResults = 0;
        
        if (error.response?.status === 402) {
          alert('Search quota exceeded. Please try again later.');
        } else {
          alert('Error searching recipes. Please try again.');
        }
      } finally {
        this.searching = false;
      }
    },

    clearSearch() {
      this.searchForm = {
        query: '',
        number: '5',
        cuisine: '',
        diet: '',
        intolerance: ''
      };
      this.searchResults = [];
      this.hasSearched = false;
      this.totalResults = 0;
      
      // Clear URL
      this.$router.replace({ path: '/search' });
    },

    updateURL() {
      const query = {};
      if (this.searchForm.query) query.q = this.searchForm.query;
      if (this.searchForm.cuisine) query.cuisine = this.searchForm.cuisine;
      if (this.searchForm.diet) query.diet = this.searchForm.diet;
      if (this.searchForm.intolerance) query.intolerance = this.searchForm.intolerance;
      if (this.searchForm.number !== '5') query.number = this.searchForm.number;
      
      this.$router.replace({ path: '/search', query });
    }
  }
};
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 0.25rem 0 2rem 0;
  font-family: 'Manjari', sans-serif;
}

.page-title {
  text-align: center;
  color: #7db67d;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 0rem;
  font-family: 'DynaPuff', cursive;
}

.search-form-container {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  font-family: 'Manjari', sans-serif;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
  font-family: 'Manjari', sans-serif;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Manjari', sans-serif;
}

.form-control:focus {
  border-color: #7db67d;
  box-shadow: 0 0 0 0.2rem rgba(125, 182, 125, 0.25);
  outline: none;
}

.form-control:hover {
  border-color: #a3c7a3;
}

.search-button-container {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-search {
  background: linear-gradient(45deg, #7db67d, #5a9a5a);
  border: none;
  padding: 0;
  font-size: 1.1rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Manjari', sans-serif;
  margin-right: 15px;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 48px;
}

.btn-search:hover:not(:disabled) {
  background: linear-gradient(45deg, #5a9a5a, #4a8a4a);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(125, 182, 125, 0.3);
}

.btn-clear {
  border-radius: 25px;
  padding: 0;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Manjari', sans-serif;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 48px;
}

.search-results {
  margin-top: 2rem;
  font-family: 'Manjari', sans-serif;
}

.results-header {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
}

.results-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-family: 'Manjari', sans-serif;
}

.results-info {
  color: #666;
  font-size: 0.9rem;
  font-family: 'Manjari', sans-serif;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Manjari', sans-serif;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #7db67d;
}

.results-grid {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.no-results {
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Manjari', sans-serif;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-results-content i {
  color: #6c757d;
}

.no-results-content h4 {
  color: #333;
  margin-bottom: 1rem;
  font-family: 'Manjari', sans-serif;
}

.no-results-content ul {
  text-align: left;
  color: #666;
  font-family: 'Manjari', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-page {
    padding: 0.25rem 0 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .search-form-container {
    padding: 1.5rem;
  }
  
  .btn-search, .btn-clear {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .btn-clear.ml-3 {
    margin-left: 0 !important;
  }
  
  .results-grid {
    padding: 1rem;
  }
  
  .col-md-4 {
    padding: 0 15px;
  }
}

@media (max-width: 576px) {
  .search-button-container {
    text-align: stretch;
  }
}
</style>