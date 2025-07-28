<template>
  <div class="about-section">
    <div class="about-header">
      <h2>🚀 About Extensity Ultra</h2>
      <p class="about-subtitle">A powerful browser extension manager for efficient extension management ✨</p>
    </div>

    <div class="about-content">
      <!-- Features Card -->
      <div class="about-card">
        <div class="card-content">
          <h3 class="card-title">✨ Features</h3>
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">🔧</span>
              <span class="feature-text">Extension Management</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <span class="feature-text">Profile System</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📦</span>
              <span class="feature-text">Import/Export Settings</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span class="feature-text">CSV Export</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <span class="feature-text">Modern UI/UX</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span class="feature-text">Advanced Search</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">Bulk Operations</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <span class="feature-text">Responsive Design</span>
            </div>
          </div>
        </div>
      </div>

      <!-- GitHub Links Card -->
      <div class="about-card">
        <div class="card-content">
          <h3 class="card-title">🐙 GitHub & Development</h3>
          <div class="links-list">
            <div class="link-item">
              <span class="link-label">📂 Repository:</span>
              <a href="https://github.com/jeevan-lal/Extensity-Ultra" target="_blank" class="link-value">
                github.com/jeevan-lal/Extensity-Ultra
              </a>
            </div>
            <div class="link-item">
              <span class="link-label">🐛 Issues:</span>
              <a href="https://github.com/jeevan-lal/Extensity-Ultra/issues" target="_blank" class="link-value">
                Report Issues
              </a>
            </div>
            <div class="link-item">
              <span class="link-label">📦 Releases:</span>
              <a href="https://github.com/jeevan-lal/Extensity-Ultra/releases" target="_blank" class="link-value">
                View Releases
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Download & Rate Card -->
      <div class="about-card">
        <div class="card-content">
          <h3 class="card-title">📥 Download & Rate</h3>
          <div class="download-links">
            <div class="download-item">
              <span class="download-label">🛒 Chrome Web Store:</span>
              <a href="https://chromewebstore.google.com/detail/extensity-ultra/mdlkphghcnmhgffokbpngpmjahflaloj" target="_blank" class="download-link">
                Download Extension
              </a>
            </div>
            <div class="download-item">
              <span class="download-label">⭐ Reviews:</span>
              <a href="https://chromewebstore.google.com/detail/extensity-ultra/mdlkphghcnmhgffokbpngpmjahflaloj/reviews" target="_blank" class="download-link">
                Rate & Review
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact & Support Card -->
      <div class="about-card">
        <div class="card-content">
          <h3 class="card-title">📧 Contact & Support</h3>
          <div class="contact-info">
            <p>For support and feedback, please contact:</p>
            <div class="contact-item">
              <span class="contact-label">📧 Email:</span>
              <span class="contact-value">ctechhindi@gmail.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">👨‍💻 Developer:</span>
              <span class="contact-value">C Tech Hindi</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">🌐 Website:</span>
              <a href="https://ctechhindi.in" target="_blank" class="contact-value">ctechhindi.in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const buildDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.about-section {
  margin: 0 auto;
}

.about-header {
  margin-bottom: 40px;
  text-align: center;
}

.about-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--theme-text-primary, #1a202c);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.about-subtitle {
  font-size: 1.1rem;
  color: var(--theme-text-secondary, #4a5568);
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.about-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.about-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-content {
  padding: 30px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--theme-text-primary, #1a202c);
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.15);
  border-color: #48bb78;
}

.feature-icon {
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(72, 187, 120, 0.25);
  border-color: #48bb78;
}

.feature-text {
  color: var(--theme-text-primary, #1a202c);
  font-weight: 500;
  font-size: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-info p {
  margin: 0;
  color: var(--theme-text-secondary, #4a5568);
  font-size: 0.95rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contact-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.contact-label {
  font-weight: 600;
  color: var(--theme-text-primary, #1a202c);
}

.contact-value {
  color: #667eea;
  font-weight: 500;
}

/* GitHub Links Styles */
.links-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.link-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.link-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.link-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.link-label {
  font-weight: 600;
  color: var(--theme-text-primary, #1a202c);
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.link-value {
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.link-value:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* Download Links Styles */
.download-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.download-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.download-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.download-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.15);
  border-color: #48bb78;
}

.download-label {
  font-weight: 600;
  color: var(--theme-text-primary, #1a202c);
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.download-link {
  color: #48bb78;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.download-link:hover {
  color: #38a169;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-header h2 {
    font-size: 2rem;
  }

  .card-content {
    padding: 20px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .tech-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .link-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .download-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>