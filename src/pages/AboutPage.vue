<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightOutlined, GithubOutlined, BookOutlined, RocketOutlined, CodeOutlined, ThunderboltOutlined, CloudOutlined, TeamOutlined, SafetyOutlined, ApiOutlined, DatabaseOutlined } from '@ant-design/icons-vue'

const timeline = ref([
  {
    phase: 'Phase 1',
    title: '骨架搭建',
    description: '在网页上成功加载 Univer 表格编辑器',
    status: 'completed',
    tasks: ['初始化 Vite 项目', '集成 Univer 基础包', '搭建 Spring Boot 后端', '实现最小化接口']
  },
  {
    phase: 'Phase 2',
    title: '翻译官集成',
    description: '实现 Excel 文件的"秒开"功能',
    status: 'completed',
    tasks: ['引入 Apache Fesod', '编写转换算法', '实现上传接口', '支持多种格式']
  },
  {
    phase: 'Phase 3',
    title: '云端持久化',
    description: '集成腾讯云 COS 实现文件存储',
    status: 'completed',
    tasks: ['集成 COS SDK', '异步存储文件', '实现文件列表', '支持文件下载']
  },
  {
    phase: 'Phase 4',
    title: '数据回流',
    description: '实现 Univer 数据导出为 Excel',
    status: 'completed',
    tasks: ['编写导出接口', '逆向解析 JSON', '生成 Excel 文件', '更新 COS 存储']
  },
  {
    phase: 'Phase 5',
    title: '实时协同',
    description: 'Redis 缓存协同机制',
    status: 'in-progress',
    tasks: ['集成 Redis', '建立 WebSocket', '实时数据同步', '编辑锁机制']
  }
])

const techStack = ref([
  {
    category: '前端核心',
    icon: CodeOutlined,
    items: [
      { name: 'Vue 3', description: '渐进式 JavaScript 框架', version: '3.5+' },
      { name: 'Vite', description: '下一代前端构建工具', version: '7.x' },
      { name: 'Univer', description: '现代化表格引擎', version: '0.16+' },
      { name: 'Ant Design Vue', description: '企业级 UI 组件库', version: '4.2+' }
    ]
  },
  {
    category: '后端核心',
    icon: RocketOutlined,
    items: [
      { name: 'Spring Boot', description: 'Java 应用框架', version: '3.5.8' },
      { name: 'Apache Fesod', description: 'Excel 流式转换引擎', version: 'Latest' },
      { name: 'MyBatis-Plus', description: 'MyBatis 增强工具', version: '3.x' },
      { name: 'Redis', description: '内存数据库', version: '7.x' }
    ]
  },
  {
    category: '云服务',
    icon: CloudOutlined,
    items: [
      { name: '腾讯云 COS', description: '对象存储服务', version: 'v5' },
      { name: 'WebSocket', description: '实时通信协议', version: 'RFC 6455' }
    ]
  }
])

const architecture = ref([
  {
    icon: ThunderboltOutlined,
    title: '前端渲染',
    description: 'Univer 基于 Canvas 的高性能编辑器，负责展示和用户交互',
    color: '#667eea'
  },
  {
    icon: ApiOutlined,
    title: '后端解析',
    description: 'Apache Fesod 负责 .xlsx 与 JSON 之间的高性能流式转换',
    color: '#f093fb'
  },
  {
    icon: DatabaseOutlined,
    title: '云端存储',
    description: '腾讯云 COS 负责 Excel 文件的持久化存储（底片库）',
    color: '#4facfe'
  },
  {
    icon: TeamOutlined,
    title: '缓存协同',
    description: 'Redis 负责实时协作数据的缓存与同步推送',
    color: '#43e97b'
  }
])

const stats = ref([
  { value: '5', label: '开发阶段' },
  { value: '6+', label: '核心技术' },
  { value: '100%', label: '开源' },
  { value: '∞', label: '可扩展性' }
])
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <BookOutlined />
          <span>关于项目</span>
        </div>
        <h1 class="hero-title">
          <img class="title-logo" src="@/assets/MATRIX-1.png" alt="MATRIX" />
          <span class="title-sub">云端协作表格系统</span>
        </h1>
        <p class="hero-description">
          基于 "前端渲染 + 后端解析 + 云端存储 + 缓存协同" 的现代化架构
          <br />
          打造 AI 原生的在线表格编辑体验
        </p>

        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="architecture-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">系统架构</h2>
          <p class="section-subtitle">四大核心模块协同工作</p>
        </div>

        <div class="architecture-grid">
          <div
            v-for="(item, index) in architecture"
            :key="item.title"
            class="architecture-card"
            :style="{ '--card-color': item.color, '--animation-delay': `${index * 100}ms` }"
          >
            <div class="architecture-icon-wrapper" :style="{ background: `${item.color}15` }">
              <component :is="item.icon" class="architecture-icon" :style="{ color: item.color }" />
            </div>
            <h3 class="architecture-title">{{ item.title }}</h3>
            <p class="architecture-description">{{ item.description }}</p>
            <div class="architecture-number">{{ String(index + 1).padStart(2, '0') }}</div>
          </div>
        </div>

        <!-- Flow Diagram -->
        <div class="flow-diagram">
          <div class="flow-item">
            <div class="flow-icon">
              <CloudOutlined />
            </div>
            <div class="flow-text">用户上传</div>
          </div>
          <div class="flow-arrow">
            <ArrowRightOutlined />
          </div>
          <div class="flow-item">
            <div class="flow-icon">
              <ApiOutlined />
            </div>
            <div class="flow-text">Fesod 解析</div>
          </div>
          <div class="flow-arrow">
            <ArrowRightOutlined />
          </div>
          <div class="flow-item">
            <div class="flow-icon">
              <DatabaseOutlined />
            </div>
            <div class="flow-text">COS 存储</div>
          </div>
          <div class="flow-arrow">
            <ArrowRightOutlined />
          </div>
          <div class="flow-item">
            <div class="flow-icon">
              <ThunderboltOutlined />
            </div>
            <div class="flow-text">前端渲染</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="techstack-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">技术栈</h2>
          <p class="section-subtitle">采用现代化技术方案，确保系统稳定高效</p>
        </div>

        <div class="techstack-grid">
          <div
            v-for="stack in techStack"
            :key="stack.category"
            class="techstack-category"
          >
            <div class="category-header">
              <component :is="stack.icon" class="category-icon" />
              <h3 class="category-title">{{ stack.category }}</h3>
            </div>
            <div class="tech-items">
              <div v-for="item in stack.items" :key="item.name" class="tech-item">
                <div class="tech-info">
                  <div class="tech-name">{{ item.name }}</div>
                  <div class="tech-desc">{{ item.description }}</div>
                </div>
                <div class="tech-version">{{ item.version }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Development Timeline -->
    <section class="timeline-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">开发路线</h2>
          <p class="section-subtitle">五大阶段逐步完善系统功能</p>
        </div>

        <div class="timeline-container">
          <div class="timeline-line"></div>
          <div
            v-for="(phase, index) in timeline"
            :key="phase.phase"
            class="timeline-item"
            :class="{ 'timeline-item-reverse': index % 2 === 1 }"
          >
            <div class="timeline-dot" :class="`status-${phase.status}`"></div>
            <div class="timeline-content">
              <div class="timeline-phase">{{ phase.phase }}</div>
              <h3 class="timeline-title">{{ phase.title }}</h3>
              <p class="timeline-description">{{ phase.description }}</p>
              <div class="timeline-status" :class="`status-${phase.status}`">
                <span v-if="phase.status === 'completed'">已完成</span>
                <span v-else-if="phase.status === 'in-progress'">进行中</span>
                <span v-else>计划中</span>
              </div>
              <ul class="timeline-tasks">
                <li v-for="task in phase.tasks" :key="task">
                  <SafetyOutlined />
                  <span>{{ task }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Source Section -->
    <section class="opensource-section">
      <div class="opensource-content">
        <div class="opensource-icon">
          <GithubOutlined />
        </div>
        <h2 class="opensource-title">开源项目</h2>
        <p class="opensource-description">
          MATRIX 坚信开源的力量，所有代码完全开源
          <br />
          欢迎贡献代码、提出建议或报告问题
        </p>
        <div class="opensource-links">
          <a href="https://github.com/X1aoM1ngTX/matrix-backend" target="_blank" rel="noopener" class="opensource-link">
            <GithubOutlined />
            <span>GitHub 仓库</span>
            <ArrowRightOutlined />
          </a>
          <a href="#" class="opensource-link secondary">
            <BookOutlined />
            <span>开发文档</span>
            <ArrowRightOutlined />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 70vh;
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
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -150px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -100px;
  left: -100px;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.05);
  }
}

.hero-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 100px;
  font-size: 15px;
  font-weight: 500;
  color: #667eea;
  margin-bottom: 32px;
}

.hero-badge :deep(.anticon) {
  font-size: 16px;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
}

.title-logo {
  max-width: 500px;
  object-fit: contain;
}

.title-sub {
  font-size: 24px;
  font-weight: 600;
  color: #495057;
  letter-spacing: -0.5px;
}

.hero-description {
  font-size: 18px;
  line-height: 1.8;
  color: #6c757d;
  margin-bottom: 48px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

/* Architecture Section */
.architecture-section {
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

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 60px;
}

.architecture-card {
  position: relative;
  padding: 40px;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out backwards;
  animation-delay: var(--animation-delay);
}

.architecture-card:hover {
  transform: translateY(-8px);
  border-color: var(--card-color);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.architecture-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  margin-bottom: 24px;
}

.architecture-icon {
  width: 32px;
  height: 32px;
}

.architecture-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.architecture-description {
  font-size: 15px;
  line-height: 1.7;
  color: #6c757d;
}

.architecture-number {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 48px;
  font-weight: 800;
  color: var(--card-color);
  opacity: 0.1;
  line-height: 1;
}

/* Flow Diagram */
.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 40px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 24px;
}

.flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  min-width: 100px;
}

.flow-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 14px;
  font-size: 20px;
}

.flow-text {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.flow-arrow {
  color: #667eea;
  font-size: 18px;
}

/* Tech Stack Section */
.techstack-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.techstack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.techstack-category {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 32px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.category-icon {
  width: 28px;
  height: 28px;
  color: #667eea;
}

.category-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
}

.tech-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tech-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.tech-desc {
  font-size: 13px;
  color: #6c757d;
}

.tech-version {
  font-size: 12px;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 6px;
  font-weight: 500;
}

/* Timeline Section */
.timeline-section {
  padding: 100px 24px;
  background: #fff;
}

.timeline-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-right: calc(50% + 40px);
  margin-bottom: 60px;
}

.timeline-item-reverse {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: calc(50% + 40px);
}

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 24px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #667eea;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-dot.status-completed {
  background: #667eea;
  border-color: #667eea;
}

.timeline-dot.status-in-progress {
  background: #fff;
  border-color: #f093fb;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(240, 147, 251, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(240, 147, 251, 0);
  }
}

.timeline-content {
  max-width: 380px;
  padding: 32px;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
}

.timeline-phase {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.timeline-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.timeline-description {
  font-size: 15px;
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.6;
}

.timeline-status {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.timeline-status.status-completed {
  background: rgba(67, 233, 123, 0.1);
  color: #43e97b;
}

.timeline-status.status-in-progress {
  background: rgba(240, 147, 251, 0.1);
  color: #f093fb;
}

.timeline-tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-tasks li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #495057;
  border-bottom: 1px solid #f1f3f5;
}

.timeline-tasks li:last-child {
  border-bottom: none;
}

.timeline-tasks li :deep(.anticon) {
  color: #43e97b;
  font-size: 14px;
}

/* Open Source Section */
.opensource-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  text-align: center;
}

.opensource-content {
  max-width: 600px;
  margin: 0 auto;
}

.opensource-icon {
  width: 80px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  color: #fff;
  font-size: 36px;
  margin-bottom: 32px;
}

.opensource-title {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.opensource-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  line-height: 1.8;
}

.opensource-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.opensource-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  background: #fff;
  color: #1a1a2e;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.opensource-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.opensource-link.secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.opensource-link.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
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

/* Responsive Design */
@media (max-width: 1024px) {
  .architecture-grid {
    grid-template-columns: 1fr;
  }

  .techstack-grid {
    grid-template-columns: 1fr;
  }

  .timeline-line {
    left: 24px;
  }

  .timeline-item,
  .timeline-item-reverse {
    padding-left: 60px;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-dot {
    left: 24px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px;
    min-height: 60vh;
  }

  .title-logo {
    max-height: 70px;
  }

  .title-sub {
    font-size: 18px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 32px;
  }

  .flow-diagram {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .opensource-links {
    flex-direction: column;
  }

  .opensource-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
