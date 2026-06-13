<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'
import { ArrowRightOutlined, CloudOutlined, ThunderboltOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const features = ref([
  {
    icon: CloudOutlined,
    title: '云端存储',
    description: '基于腾讯云 COS，数据持久化存储，随时随地访问您的文件',
    delay: 0
  },
  {
    icon: ThunderboltOutlined,
    title: '极速解析',
    description: 'Apache Fesod 高性能流式转换，支持 .xlsx、.xls、csv 格式秒开',
    delay: 100
  },
  {
    icon: SafetyOutlined,
    title: '实时协作',
    description: 'Redis 缓存协同机制，多人同时编辑不冲突，数据实时同步',
    delay: 200
  },
  {
    icon: TeamOutlined,
    title: '团队协作',
    description: '支持文件分享、权限管理，让团队协作更高效',
    delay: 300
  }
])

const techStack = ref([
  { name: 'Vue 3', category: '前端框架' },
  { name: 'Univer', category: '表格引擎' },
  { name: 'Spring Boot', category: '后端框架' },
  { name: 'Apache Fesod', category: 'Excel 解析' },
  { name: '腾讯云 COS', category: '云存储' },
  { name: 'Redis', category: '缓存协同' }
])

const goToWorkbench = () => {
  router.push('/workbench')
}

const goToAbout = () => {
  router.push('/about')
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span>AI 原生表格系统</span>
        </div>
        <h1 class="hero-title">
          <img class="title-logo" src="@/assets/MATRIX-4.png" alt="MATRIX" />
          <span class="title-sub">云端协作表格系统</span>
        </h1>
        <p class="hero-description">
          基于 Univer + Apache Fesod + 腾讯云 COS + Redis 构建的现代化在线表格编辑器
          <br />
          支持极速解析、实时协作、云端存储，让数据处理更高效
        </p>
        <div class="hero-actions">
          <Button type="primary" size="large" class="cta-button" @click="goToWorkbench">
            开始使用
            <template #icon>
              <ArrowRightOutlined />
            </template>
          </Button>
          <Button size="large" class="secondary-button" @click="goToAbout">
            了解更多
          </Button>
        </div>
      </div>

      <!-- Hero Visual -->
      <div class="hero-visual">
        <div class="spreadsheet-preview">
          <div class="preview-header">
            <div class="preview-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="preview-title">MATRIX - Spreadsheet</div>
          </div>
          <div class="preview-content">
            <div class="preview-toolbar">
              <div class="toolbar-group">
                <div class="toolbar-item"></div>
                <div class="toolbar-item"></div>
                <div class="toolbar-item"></div>
              </div>
            </div>
            <div class="preview-grid">
              <div class="grid-row" v-for="i in 6" :key="i">
                <div class="grid-header">{{ String.fromCharCode(64 + i) }}</div>
                <div class="grid-cell" v-for="j in 8" :key="j"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">核心特性</h2>
          <p class="section-subtitle">强大的功能，简洁的操作体验</p>
        </div>

        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card"
            :style="{ animationDelay: `${feature.delay}ms` }"
          >
            <div class="feature-icon-wrapper">
              <component :is="feature.icon" class="feature-icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">技术栈</h2>
          <p class="section-subtitle">采用现代化技术方案，确保系统稳定高效</p>
        </div>

        <div class="tech-grid">
          <div v-for="tech in techStack" :key="tech.name" class="tech-item">
            <div class="tech-name">{{ tech.name }}</div>
            <div class="tech-category">{{ tech.category }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">准备好开始了吗？</h2>
        <p class="cta-description">
          立即注册，体验现代化云端协作表格系统
        </p>
        <Button type="primary" size="large" class="cta-button-large" @click="goToWorkbench">
          免费开始使用
          <template #icon>
            <ArrowRightOutlined />
          </template>
        </Button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 隐藏滚动条但保持滚动功能 */
.home-page::-webkit-scrollbar {
  display: none;
}

.home-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.02);
  }
}

.hero-content {
  position: relative;
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.title-logo {
  max-width: 100px;
  object-fit: contain;
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

.title-sub {
  font-size: 28px;
  font-weight: 600;
  color: #495057;
  letter-spacing: -0.5px;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.hero-description {
  font-size: 18px;
  line-height: 1.8;
  color: #6c757d;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.hero-actions {
  display: flex;
  gap: 16px;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;
}

.cta-button {
  height: 50px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(26, 26, 46, 0.3);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 26, 46, 0.4);
}

.secondary-button {
  height: 50px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: 2px solid #1a1a2e;
  color: #1a1a2e;
  background: transparent;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background: #1a1a2e;
  color: #fff;
}

/* Hero Visual */
.hero-visual {
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.spreadsheet-preview {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.spreadsheet-preview:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.preview-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red {
  background: #ff5f57;
}

.dot.yellow {
  background: #ffbd2e;
}

.dot.green {
  background: #28c840;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.preview-content {
  padding: 20px;
}

.preview-toolbar {
  margin-bottom: 16px;
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.toolbar-item {
  width: 40px;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.preview-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grid-row {
  display: flex;
  gap: 4px;
}

.grid-header {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.grid-cell {
  flex: 1;
  height: 32px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.grid-cell:hover {
  background: rgba(102, 126, 234, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Features Section */
.features-section {
  padding: 100px 24px;
  background: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.section-subtitle {
  font-size: 18px;
  color: #6c757d;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.feature-card {
  padding: 40px 32px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out backwards;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

.feature-icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  margin-bottom: 24px;
}

.feature-icon {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 15px;
  line-height: 1.7;
  color: #6c757d;
}

/* Tech Stack Section */
.tech-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.tech-item {
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.tech-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.tech-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.tech-category {
  font-size: 13px;
  color: #6c757d;
}

/* CTA Section */
.cta-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.cta-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-button-large {
  height: 56px;
  padding: 0 48px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 14px;
  background: #fff;
  color: #1a1a2e;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  background: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }

  .title-logo {
    max-height: 100px;
  }

  .title-sub {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px;
  }

  .title-logo {
    max-height: 80px;
  }

  .title-sub {
    font-size: 18px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .section-title {
    font-size: 32px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-title {
    font-size: 32px;
  }
}
</style>
