<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Profile Header -->
      <div class="col-12 mb-4">
        <div class="profile-header card">
          <div class="card-body text-center">
            <div class="profile-avatar mb-3">
              <i class="fas fa-user-circle text-primary"></i>
            </div>
            <h2 class="mb-2">{{ store.username }}</h2>
            <p class="text-muted">חבר מאז {{ joinDate }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="col-12 mb-4">
        <div class="row">
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card card text-center">
              <div class="card-body">
                <i class="fas fa-book text-primary mb-2"></i>
                <h4>{{ stats.myRecipes }}</h4>
                <small class="text-muted">המתכונים שלי</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card card text-center">
              <div class="card-body">
                <i class="fas fa-users text-success mb-2"></i>
                <h4>{{ stats.familyRecipes }}</h4>
                <small class="text-muted">מתכונים משפחתיים</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card card text-center">
              <div class="card-body">
                <i class="fas fa-heart text-danger mb-2"></i>
                <h4>{{ stats.favorites }}</h4>
                <small class="text-muted">מועדפים</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-3">
            <div class="stat-card card text-center">
              <div class="card-body">
                <i class="fas fa-eye text-info mb-2"></i>
                <h4>{{ stats.viewed }}</h4>
                <small class="text-muted">נצפו לאחרונה</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-bolt me-2"></i>
              פעולות מהירות
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link :to="{ name: 'myRecipes' }" class="btn btn-outline-primary">
                <i class="fas fa-plus me-2"></i>
                הוסף מתכון חדש
              </router-link>
              <router-link :to="{ name: 'familyRecipes' }" class="btn btn-outline-success">
                <i class="fas fa-users me-2"></i>
                הוסף מתכון משפחתי
              </router-link>
              <router-link :to="{ name: 'search' }" class="btn btn-outline-info">
                <i class="fas fa-search me-2"></i>
                חפש מתכונים
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-clock me-2"></i>
              פעילות אחרונה
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentActivity.length === 0" class="text-center text-muted">
              <i class="fas fa-inbox mb-2" style="font-size: 2rem;"></i>
              <p>אין פעילות אחרונה</p>
            </div>
            <div v-else>
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="d-flex align-items-center">
                  <i :class="activity.icon" class="me-3"></i>
                  <div>
                    <div class="fw-bold">{{ activity.title }}</div>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-cog me-2"></i>
              הגדרות חשבון
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>מידע אישי</h6>
                <p class="text-muted">עדכן את המידע האישי שלך</p>
                <button class="btn btn-outline-secondary" @click="showEditModal = true">
                  <i class="fas fa-edit me-2"></i>
                  ערוך פרופיל
                </button>
              </div>
              <div class="col-md-6">
                <h6>אבטחה</h6>
                <p class="text-muted">שנה סיסמה וניהול אבטחה</p>
                <button class="btn btn-outline-warning" @click="changePassword">
                  <i class="fas fa-key me-2"></i>
                  שנה סיסמה
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>ערוך פרופיל</h3>
          <button @click="showEditModal = false" class="btn-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>כאן יהיה טופס לעריכת הפרופיל</p>
          <p>(נכין את זה בשלב הבא)</p>
        </div>
        <div class="modal-footer">
          <button @click="showEditModal = false" class="btn btn-secondary">ביטול</button>
          <button @click="saveProfile" class="btn btn-primary">שמור שינויים</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'ProfilePage',
  data() {
    return {
      showEditModal: false,
      stats: {
        myRecipes: 0,
        familyRecipes: 0,
        favorites: 0,
        viewed: 0
      },
      recentActivity: [
        // Example data - will be replaced with real data
        // {
        //   id: 1,
        //   title: 'הוספת מתכון חדש: עוגת שוקולד',
        //   icon: 'fas fa-plus-circle text-success',
        //   time: 'לפני יומיים'
        // }
      ],
      joinDate: 'ינואר 2024' // This should come from backend
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

    return { store, internalInstance };
  },
  async mounted() {
    await this.loadUserStats();
  },
  methods: {
    async loadUserStats() {
      try {
        const axios = this.internalInstance.appContext.config.globalProperties.axios;
        const store = this.internalInstance.appContext.config.globalProperties.store;

        // Load stats from different endpoints
        const promises = [
          axios.get(store.server_domain + '/users/myRecipes').catch(() => ({ data: [] })),
          axios.get(store.server_domain + '/users/familyRecipes').catch(() => ({ data: [] })),
          axios.get(store.server_domain + '/users/favorites').catch(() => ({ data: [] })),
          // Add viewed recipes endpoint when available
        ];

        const [myRecipes, familyRecipes, favorites] = await Promise.all(promises);

        this.stats = {
          myRecipes: myRecipes.data.length,
          familyRecipes: familyRecipes.data.length,
          favorites: favorites.data.length,
          viewed: 0 // Will be updated when endpoint is available
        };

      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    },

    changePassword() {
      alert('שינוי סיסמה - בקרוב!');
    },

    saveProfile() {
      alert('שמירת פרופיל - בקרוב!');
      this.showEditModal = false;
    }
  }
};
</script>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.profile-avatar i {
  font-size: 5rem;
}

.stat-card {
  transition: transform 0.2s ease-in-out;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card i {
  font-size: 2rem;
}

.stat-card h4 {
  font-weight: bold;
  margin: 0.5rem 0;
}

.activity-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.card-header {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  border-radius: 10px 10px 0 0 !important;
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .profile-avatar i {
    font-size: 3rem;
  }
  
  .stat-card i {
    font-size: 1.5rem;
  }
}
</style>