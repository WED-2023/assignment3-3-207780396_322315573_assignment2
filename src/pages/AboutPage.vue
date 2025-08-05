<template>
  <div class="container mt-4">
    <!-- Hero Section -->
    <div class="hero-section text-center mb-5">
      <div class="hero-content">
        <i class="fas fa-utensils hero-icon mb-3"></i>
        <h1 class="display-4 mb-3">Vue Recipes</h1>
        <p class="lead">האתר המושלם לאוהבי הבישול והמטבח</p>
      </div>
    </div>

    <div class="row">
      <!-- About Content -->
      <div class="col-lg-8 mx-auto">
        <!-- Main Description -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h2 class="card-title text-primary mb-3">
              <i class="fas fa-info-circle me-2"></i>
              אודות האתר
            </h2>
            <p class="card-text">
              ברוכים הבאים לאתר Vue Recipes - הבית הדיגיטלי שלכם לכל מה שקשור לבישול ומתכונים!
              האתר שלנו נועד לעזור לכם לגלות, לשתף ולנהל את המתכונים הטובים ביותר.
            </p>
            <p class="card-text">
              כאן תוכלו לחפש בין אלפי מתכונים, לשמור את המועדפים עליכם, 
              לשתף את המתכונים המשפחתיים שלכם ולגלות מתכונים חדשים מכל העולם.
            </p>
          </div>
        </div>

        <!-- Features -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h3 class="card-title text-success mb-3">
              <i class="fas fa-star me-2"></i>
              מה האתר מציע?
            </h3>
            <div class="row">
              <div class="col-md-6">
                <div class="feature-item mb-3">
                  <i class="fas fa-search text-primary me-2"></i>
                  <strong>חיפוש מתכונים</strong>
                  <p class="mb-0 text-muted">חפש מבין אלפי מתכונים לפי רכיבים, סוג מזון ועוד</p>
                </div>
                <div class="feature-item mb-3">
                  <i class="fas fa-heart text-danger me-2"></i>
                  <strong>מתכונים מועדפים</strong>
                  <p class="mb-0 text-muted">שמור את המתכונים שאהבת לגישה מהירה</p>
                </div>
                <div class="feature-item mb-3">
                  <i class="fas fa-plus-circle text-success me-2"></i>
                  <strong>יצירת מתכונים</strong>
                  <p class="mb-0 text-muted">הוסף את המתכונים הייחודיים שלך</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-item mb-3">
                  <i class="fas fa-users text-info me-2"></i>
                  <strong>מתכונים משפחתיים</strong>
                  <p class="mb-0 text-muted">שמור את המתכונים המסורתיים של המשפחה</p>
                </div>
                <div class="feature-item mb-3">
                  <i class="fas fa-leaf text-success me-2"></i>
                  <strong>מתכונים מותאמים</strong>
                  <p class="mb-0 text-muted">מתכונים צמחוניים, טבעוניים וללא גלוטן</p>
                </div>
                <div class="feature-item mb-3">
                  <i class="fas fa-mobile-alt text-warning me-2"></i>
                  <strong>גישה ממכשירים ניידים</strong>
                  <p class="mb-0 text-muted">האתר מותאם לכל המכשירים והמסכים</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Development Team -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h3 class="card-title text-info mb-3">
              <i class="fas fa-users me-2"></i>
              צוות הפיתוח
            </h3>
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="team-member text-center">
                  <div class="member-avatar mb-3">
                    <i class="fas fa-user-circle text-primary"></i>
                  </div>
                  <h5 class="text-primary">יובל ורד</h5>
                  <p class="text-muted mb-2">Full Stack Developer</p>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="team-member text-center">
                  <div class="member-avatar mb-3">
                    <i class="fas fa-user-circle text-success"></i>
                  </div>
                  <h5 class="text-success">נעם וקנין</h5>
                  <p class="text-muted mb-2">Full Stack Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Previous Work -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h3 class="card-title text-warning mb-3">
              <i class="fas fa-code-branch me-2"></i>
              עבודות קודמות
            </h3>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="project-card">
                  <div class="project-header">
                    <h5 class="text-primary">
                      <i class="fas fa-utensils me-2"></i>
                      האתר המשפחתי של יובל
                    </h5>
                  </div>
                  <div class="project-links">
                    <a href="#" class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-eye me-1"></i>
                      צפה בפרויקט
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="project-card">
                  <div class="project-header">
                    <h5 class="text-success">
                      <i class="fas fa-server me-2"></i>
                      האתר המשפחתי של נעם
                    </h5>
                  </div>
                  <div class="project-links">
                    <a href="#" class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-eye me-1"></i>
                      צפה בפרויקט
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="project-card">
                  <div class="project-header">
                    <h5 class="text-info">
                      <i class="fab fa-vuejs me-2"></i>
                      משחק חלליות
                    </h5>
                  </div>
                  <div class="project-links">
                    <a href="#" class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-eye me-1"></i>
                      צפה בפרויקט
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="project-card current-project">
                  <div class="project-header">
                    <h5 class="text-danger">
                      <i class="fas fa-rocket me-2"></i>
                      Assignment 3.2 - backend
                    </h5>
                  </div>
                  <div class="project-links">
                    <a href="#" class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-eye me-1"></i>
                      צפה בפרויקט
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h3 class="card-title text-danger mb-3">
              <i class="fas fa-envelope me-2"></i>
              צור קשר
            </h3>
            <div class="row">
              <div class="col-md-6">
                <p><i class="fas fa-envelope text-primary me-2"></i> 
                   <strong>yuvalve@post.bgu.ac.il</strong></p>
              </div>
              <div class="col-md-6">
                <p><i class="fab fa-facebook text-primary me-2"></i> 
                   <strong>vakninc@post.bgu.ac.il</strong></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mb-5">
          <div class="cta-section">
            <h3 class="mb-3">מוכנים להתחיל?</h3>
            <p class="mb-4">הצטרפו אלינו והתחילו לגלות מתכונים חדשים עוד היום!</p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
              <router-link v-if="!store.username" :to="{ name: 'register' }" class="btn btn-primary btn-lg">
                <i class="fas fa-user-plus me-2"></i>
                הירשם עכשיו
              </router-link>
              <router-link :to="{ name: 'search' }" class="btn btn-outline-primary btn-lg">
                <i class="fas fa-search me-2"></i>
                חפש מתכונים
              </router-link>
              <router-link v-if="store.username" :to="{ name: 'createRecipe' }" class="btn btn-success btn-lg">
                <i class="fas fa-plus-circle me-2"></i>
                הוסף מתכון
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'AboutPage',
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 20px;
  margin-bottom: 3rem;
}

.hero-icon {
  font-size: 4rem;
  opacity: 0.9;
}

.hero-content h1 {
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.card {
  border: none;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.feature-item {
  padding: 0.5rem 0;
}

.feature-item i {
  font-size: 1.2rem;
}

.team-member {
  padding: 1.5rem;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar i {
  font-size: 4rem;
}

.member-links .btn {
  margin: 0.25rem;
}

.project-card {
  padding: 1.5rem;
  border-radius: 15px;
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  transition: all 0.3s ease;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.current-project {
  background: #f8f9fa;
  border-left: 4px solid #007bff;}

.project-header h5 {
  margin-bottom: 1rem;
}

.project-links {
  margin-top: 1rem;
}

.project-links .btn {
  margin: 0.25rem;
}

.cta-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-weight: 600;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-icon {
    font-size: 3rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .d-flex.gap-3 {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-lg {
    width: 100%;
    max-width: 300px;
  }
}

/* RTL Support */
.card-body {
  direction: rtl;
  text-align: right;
}

.text-center {
  direction: ltr;
}

.list-unstyled {
  text-align: right;
}
</style>