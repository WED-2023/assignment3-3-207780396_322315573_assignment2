<template>
  <b-modal
    v-model="isVisible"
    title="Create New Recipe"
    size="xl"
    scrollable
    hide-footer
    @hide="resetForm"
    @show="resetForm"
  >
    <!-- Custom Header -->
    <template #modal-header="{ close }">
      <div class="modal-header-custom">
        <h4 class="modal-title">
          <i class="fas fa-plus-circle"></i>
          Create New Recipe
        </h4>
        <button
          type="button"
          class="btn-close"
          @click="close()"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </template>

    <!-- Modal Body -->
    <form @submit.prevent="createRecipe" class="recipe-form">
      <div class="row">
        <!-- Left Column -->
        <div class="col-md-6">
          <!-- Recipe Title -->
          <b-form-group label="Recipe Title" label-for="recipe-title">
            <b-form-input
              id="recipe-title"
              v-model="recipeForm.title"
              type="text"
              placeholder="Enter recipe name..."
              required
            />
          </b-form-group>

          <!-- Recipe Image URL -->
          <b-form-group label="Recipe Image URL" label-for="recipe-image">
            <b-form-input
              id="recipe-image"
              v-model="recipeForm.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
            />
            
            <!-- Image Preview -->
            <div v-if="recipeForm.image" class="image-preview mt-2">
              <img 
                :src="recipeForm.image" 
                alt="Recipe preview" 
                class="preview-img"
                @error="handleImageError"
              />
            </div>
          </b-form-group>

          <!-- Ready in Minutes -->
          <b-form-group label="Ready in (minutes)" label-for="ready-minutes">
            <b-form-input
              id="ready-minutes"
              v-model.number="recipeForm.readyInMinutes"
              type="number"
              min="1"
              max="1440"
              placeholder="30"
              required
            />
          </b-form-group>

          <!-- Number of Servings -->
          <b-form-group label="Number of Servings" label-for="servings">
            <b-form-input
              id="servings"
              v-model.number="recipeForm.servings"
              type="number"
              min="1"
              max="20"
              placeholder="4"
              required
            />
          </b-form-group>

          <!-- Dietary Options -->
          <b-form-group label="Dietary Information">
            <div class="dietary-options">
              <b-form-checkbox v-model="recipeForm.vegetarian">
                Vegetarian
              </b-form-checkbox>
              <b-form-checkbox v-model="recipeForm.vegan">
                Vegan
              </b-form-checkbox>
              <b-form-checkbox v-model="recipeForm.glutenFree">
                Gluten Free
              </b-form-checkbox>
            </div>
          </b-form-group>
        </div>

        <!-- Right Column -->
        <div class="col-md-6">
          <!-- Ingredients Section -->
          <b-form-group label="Ingredients">
            <div class="ingredients-section">
              <div 
                v-for="(ingredient, index) in recipeForm.ingredients" 
                :key="index"
                class="ingredient-item mb-2"
              >
                <b-row>
                  <b-col cols="3">
                    <b-form-input
                      v-model.number="ingredient.amount"
                      type="number"
                      placeholder="Amount"
                      step="0.1"
                      min="0"
                      size="sm"
                      required
                    />
                  </b-col>
                  <b-col cols="3">
                    <b-form-input
                      v-model="ingredient.unit"
                      placeholder="Unit"
                      list="units-list"
                      size="sm"
                    />
                  </b-col>
                  <b-col cols="5">
                    <b-form-input
                      v-model="ingredient.name"
                      placeholder="Ingredient name"
                      size="sm"
                      required
                    />
                  </b-col>
                  <b-col cols="1">
                    <b-button
                      variant="outline-danger"
                      size="sm"
                      @click="removeIngredient(index)"
                      v-if="recipeForm.ingredients.length > 1"
                    >
                      <i class="fas fa-trash"></i>
                    </b-button>
                  </b-col>
                </b-row>
              </div>
              
              <!-- Add Ingredient Button -->
              <b-button
                variant="outline-primary"
                size="sm"
                @click="addIngredient"
                class="mt-2"
              >
                <i class="fas fa-plus"></i>
                Add Ingredient
              </b-button>
            </div>
          </b-form-group>

          <!-- Units Datalist -->
          <datalist id="units-list">
            <option value="cups" />
            <option value="tbsp" />
            <option value="tsp" />
            <option value="oz" />
            <option value="lbs" />
            <option value="g" />
            <option value="kg" />
            <option value="ml" />
            <option value="l" />
            <option value="pieces" />
            <option value="cloves" />
            <option value="slices" />
          </datalist>
        </div>
      </div>

      <!-- Instructions Section (Full Width) -->
      <b-row>
        <b-col cols="12">
          <b-form-group label="Instructions" label-for="instructions">
            <b-form-textarea
              id="instructions"
              v-model="recipeForm.instructions"
              rows="6"
              placeholder="Enter step-by-step cooking instructions..."
              required
            />
            <b-form-text>
              Write clear, step-by-step instructions. You can separate steps with line breaks.
            </b-form-text>
          </b-form-group>
        </b-col>
      </b-row>
    </form>

    <!-- Footer Buttons -->
    <div class="modal-footer-custom mt-3">
      <div class="w-100 d-flex justify-content-end">
        <b-button
          variant="secondary"
          class="me-2"
          @click="isVisible = false"
        >
          <i class="fas fa-times"></i>
          Cancel
        </b-button>
        <b-button
          variant="success"
          @click="createRecipe"
          :disabled="!isFormValid || creating"
        >
          <b-spinner v-if="creating" small class="me-2" />
          <i v-else class="fas fa-save me-2"></i>
          {{ creating ? 'Creating...' : 'Create Recipe' }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'CreateRecipeModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'recipe-created'],
  setup() {
    const internalInstance = getCurrentInstance();
    
    return {
      store: internalInstance.appContext.config.globalProperties.store,
      axios: internalInstance.appContext.config.globalProperties.axios,
      toast: internalInstance.appContext.config.globalProperties.toast
    };
  },
  data() {
    return {
      creating: false,
      recipeForm: {
        title: '',
        image: '',
        readyInMinutes: null,
        servings: null,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        ingredients: [
          { amount: null, unit: '', name: '' }
        ],
        instructions: ''
      }
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    isFormValid() {
      const hasValidIngredients = this.recipeForm.ingredients.some(ing => 
        ing.name && ing.name.trim() !== '' && ing.amount && ing.amount > 0
      );
      
      return (
        this.recipeForm.title && this.recipeForm.title.trim() !== '' &&
        this.recipeForm.image && this.recipeForm.image.trim() !== '' &&
        this.recipeForm.readyInMinutes && this.recipeForm.readyInMinutes > 0 &&
        this.recipeForm.servings && this.recipeForm.servings > 0 &&
        hasValidIngredients &&
        this.recipeForm.instructions && this.recipeForm.instructions.trim() !== ''
      );
    }
  },
  watch: {
    // ניקוי גם כש-modelValue משתנה ל-true (נפתח)
    modelValue(newValue) {
      if (newValue) {
        this.resetForm();
      }
    }
  },
  methods: {
    addIngredient() {
      this.recipeForm.ingredients.push({
        amount: null,
        unit: '',
        name: ''
      });
    },

    removeIngredient(index) {
      if (this.recipeForm.ingredients.length > 1) {
        this.recipeForm.ingredients.splice(index, 1);
      }
    },

    handleImageError(event) {
      event.target.style.display = 'none';
    },

    async createRecipe() {
      if (!this.isFormValid || this.creating) return;

      this.creating = true;

      try {
        // Check if user is logged in
        if (!this.store.username) {
          this.toast('Error', 'You must be logged in to create recipes.', 'danger');
          this.creating = false;
          return;
        }

        console.log('Creating recipe with form data:', this.recipeForm);
        console.log('User logged in as:', this.store.username);

        // Clean up ingredients (remove empty ones)
        const validIngredients = this.recipeForm.ingredients.filter(ing => 
          ing.name && ing.name.trim() !== '' && ing.amount && ing.amount > 0
        );

        if (validIngredients.length === 0) {
          this.toast('Error', 'Please add at least one valid ingredient.', 'danger');
          this.creating = false;
          return;
        }

        // Prepare recipe data exactly as the server expects
        const recipeData = {
          title: this.recipeForm.title.trim(),
          image: this.recipeForm.image.trim(),
          readyInMinutes: parseInt(this.recipeForm.readyInMinutes),
          servings: parseInt(this.recipeForm.servings),
          vegetarian: this.recipeForm.vegetarian,
          vegan: this.recipeForm.vegan,
          glutenFree: this.recipeForm.glutenFree,
          ingredients: validIngredients.map(ing => ({
            name: ing.name.trim(),
            amount: parseFloat(ing.amount),
            unit: ing.unit ? ing.unit.trim() : ''
          })),
          instructions: this.recipeForm.instructions.trim()
        };

        console.log('Sending recipe data to server:', JSON.stringify(recipeData, null, 2));

        // Validate required fields before sending
        const requiredFields = ['title', 'image', 'readyInMinutes', 'servings', 'ingredients', 'instructions'];
        for (const field of requiredFields) {
          if (!recipeData[field] || (Array.isArray(recipeData[field]) && recipeData[field].length === 0)) {
            throw new Error(`${field} is required`);
          }
        }

        // Check image URL length
        if (recipeData.image.length > 255) {
          throw new Error('Image URL is too long. Please use a shorter URL (maximum 255 characters).');
        }

        // Validate ingredients array
        for (const ingredient of recipeData.ingredients) {
          if (!ingredient.name || ingredient.amount === undefined || ingredient.amount <= 0) {
            throw new Error('Each ingredient must have a name and valid amount');
          }
        }

        console.log('Making POST request to:', this.store.server_domain + '/users/myRecipes');

        const response = await this.axios.post(
          this.store.server_domain + '/users/myRecipes',
          recipeData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        console.log('Recipe created successfully:', response.data);

        // Emit event to parent
        this.$emit('recipe-created', {
          ...recipeData,
          id: response.data.recipeId
        });

        // Close modal and reset form
        this.isVisible = false;

      } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        console.error('Error response data:', error.response?.data);
        console.error('Error response status:', error.response?.status);
        
        let errorMessage = 'Error creating recipe. Please try again.';
        
        if (error.message && !error.response) {
          // Client-side validation error
          errorMessage = error.message;
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || 'Please check all required fields and try again.';
        } else if (error.response?.status === 401) {
          errorMessage = 'You must be logged in to create recipes. Please login and try again.';
          // Auto redirect to login
          this.$router.push('/login');
        } else if (error.response?.status === 500) {
          errorMessage = error.response.data?.message || 'Server error. Please check your data and try again.';
        }

        this.toast('Error', errorMessage, 'danger');
      } finally {
        this.creating = false;
      }
    },

    resetForm() {
      this.recipeForm = {
        title: '',
        image: '',
        readyInMinutes: null,
        servings: null,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        ingredients: [
          { amount: null, unit: '', name: '' }
        ],
        instructions: ''
      };
      
      // ניקוי מצב היצירה
      this.creating = false;
    }
  }
};
</script>

<style scoped>
.modal-header-custom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #7db67d, #a3c7a3);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.375rem 0.375rem 0 0;
  margin: -1rem -1.5rem 1rem -1.5rem;
}

.modal-title i {
  margin-right: 10px;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 0.8;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 1;
}

.dietary-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.dietary-options input[type="checkbox"] {
  accent-color: #a3c7a3 !important;
  width: 18px;
  height: 18px;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  background-color: white;
  border: 2px solid #a3c7a3;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.dietary-options input[type="checkbox"]:checked {
  background-color: #a3c7a3 !important;
  border-color: #a3c7a3 !important;
}

.dietary-options input[type="checkbox"]:checked::after {
  content: "✓";
  color: white;
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  left: 2px;
  top: -2px;
}

.dietary-options label {
  font-family: 'Manjari', sans-serif !important;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.ingredients-section {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.ingredient-item {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.ingredient-item .btn-remove,
.ingredient-item .btn-outline-danger,
.ingredient-item .btn-danger.btn-sm,
.ingredient-item button[class*="remove"],
.ingredient-item button[class*="delete"],
.ingredient-item .btn-sm {
  background-color: white !important;
  border: 2px solid #e74c3c !important;
  color: #e74c3c !important;
  font-size: 16px !important;
  font-weight: bold !important;
  width: 24px !important;
  height: 24px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin-left: 10px !important;
  margin-right: 5px !important;
  flex-shrink: 0 !important;
  transition: all 0.3s ease !important;
  font-family: 'Arial', sans-serif !important;
  line-height: 1 !important;
  cursor: pointer !important;
}

.ingredient-item .btn-remove,
.ingredient-item .btn-outline-danger,
.ingredient-item .btn-danger.btn-sm,
.ingredient-item button[class*="remove"],
.ingredient-item button[class*="delete"],
.ingredient-item .btn-sm {
  text-align: center !important;
  vertical-align: middle !important;
}

.ingredient-item .btn-remove:empty::before,
.ingredient-item .btn-outline-danger:empty::before,
.ingredient-item .btn-danger.btn-sm:empty::before,
.ingredient-item button[class*="remove"]:empty::before,
.ingredient-item button[class*="delete"]:empty::before,
.ingredient-item .btn-sm:empty::before {
  content: "×" !important;
  font-size: 16px !important;
  line-height: 1 !important;
  color: inherit !important;
}

.ingredient-item .btn-remove:not(:empty),
.ingredient-item .btn-outline-danger:not(:empty),
.ingredient-item .btn-danger.btn-sm:not(:empty),
.ingredient-item button[class*="remove"]:not(:empty),
.ingredient-item button[class*="delete"]:not(:empty),
.ingredient-item .btn-sm:not(:empty) {
  font-size: 0 !important;
}

.ingredient-item .btn-remove:not(:empty)::before,
.ingredient-item .btn-outline-danger:not(:empty)::before,
.ingredient-item .btn-danger.btn-sm:not(:empty)::before,
.ingredient-item button[class*="remove"]:not(:empty)::before,
.ingredient-item button[class*="delete"]:not(:empty)::before,
.ingredient-item .btn-sm:not(:empty)::before {
  content: "×" !important;
  font-size: 16px !important;
  line-height: 1 !important;
  color: inherit !important;
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.ingredient-item .btn-remove:hover,
.ingredient-item .btn-outline-danger:hover,
.ingredient-item .btn-danger.btn-sm:hover,
.ingredient-item button[class*="remove"]:hover,
.ingredient-item button[class*="delete"]:hover,
.ingredient-item .btn-sm:hover {
  background-color: #e74c3c !important;
  border-color: #e74c3c !important;
  color: white !important;
  transform: scale(1.05) !important;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3) !important;
}

.ingredient-item .btn-remove:hover::before,
.ingredient-item .btn-outline-danger:hover::before,
.ingredient-item .btn-danger.btn-sm:hover::before,
.ingredient-item button[class*="remove"]:hover::before,
.ingredient-item button[class*="delete"]:hover::before,
.ingredient-item .btn-sm:hover::before {
  color: white !important;
}

.ingredient-item {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  padding-right: 35px !important;
}


.btn-outline-primary,
.btn[class*="outline"]:not(.btn-outline-danger) {
  color: #a3c7a3 !important;
  border-color: #a3c7a3 !important;
  background-color: transparent !important;
  font-family: 'Manjari', sans-serif !important;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover,
.btn[class*="outline"]:not(.btn-outline-danger):hover {
  background-color: #a3c7a3 !important;
  border-color: #a3c7a3 !important;
  color: white !important;
}

.btn-outline-primary:focus,
.btn-outline-primary:active {
  background-color: #7db67d !important;
  border-color: #7db67d !important;
  color: white !important;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25) !important;
}

.modal-footer .btn-success,
.btn-success,
button[type="submit"],
.btn-primary {
  background-color: #a3c7a3 !important;
  border-color: #a3c7a3 !important;
  color: white !important;
  font-family: 'Manjari', sans-serif !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-footer .btn-success:hover,
.btn-success:hover,
button[type="submit"]:hover,
.btn-primary:hover {
  background-color: #7db67d !important;
  border-color: #7db67d !important;
  color: white !important;
}

.modal-footer .btn-success:focus,
.modal-footer .btn-success:active,
.btn-success:focus,
.btn-success:active {
  background-color: #7db67d !important;
  border-color: #7db67d !important;
  color: white !important;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25) !important;
}

.btn-secondary {
  font-family: 'Manjari', sans-serif !important;
}

.recipe-form,
.recipe-form label,
.recipe-form input,
.recipe-form textarea,
.recipe-form select,
.recipe-form .form-text,
label,
input,
textarea,
select {
  font-family: 'Manjari', sans-serif !important;
}

.recipe-form input:focus,
.recipe-form textarea:focus,
.recipe-form select:focus,
input:focus,
textarea:focus,
select:focus {
  border-color: rgba(163, 199, 163, 0.5) !important;
  box-shadow: 0 0 0 0.2rem rgba(163, 199, 163, 0.25) !important;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.image-preview {
  text-align: center;
}

.preview-img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Animation for ingredient addition */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-footer-custom {
  border-top: 1px solid #dee2e6;
  padding: 1rem 0;
  margin-top: 1rem;
}

h4, h5, h6 {
  font-family: 'Manjari', sans-serif !important;
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dietary-options {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>