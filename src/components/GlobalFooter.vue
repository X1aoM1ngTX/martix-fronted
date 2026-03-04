<template>
  <div class="global-footer">
    <p class="copyright">
      Code by
      <a href="https://game9hq.xyz/" target="_blank" rel="noopener noreferrer">
        X1aoM1ngTX
      </a>
      <a href="https://github.com/X1aoM1ngTX" target="_blank" rel="noopener noreferrer" class="github-link">
        <GithubOutlined />
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
.global-footer {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.copyright {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.copyright a {
  color: #000;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.copyright a:hover {
  color: #333;
  text-decoration: underline;
}

.github-link {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  transition: color 0.3s;
}

.github-link:hover {
  color: #24292e;
}

@media (max-width: 768px) {
  .global-footer {
    padding: 16px;
  }
}
</style>
