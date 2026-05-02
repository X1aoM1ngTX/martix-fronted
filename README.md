# Matrix Frontend

<div align="center">

**Matrix 前端应用**

基于 Vue 3 + Univer 构建的在线表格协作平台，支持文件管理、在线编辑、实时协作等功能

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4.2-4FC08D?style=flat-square)
![Univer](https://img.shields.io/badge/Univer-0.16-0094F5?style=flat-square)

</div>

## 项目简介

Matrix Frontend 是在线表格协作平台的前端应用，集成了 [Univer](https://univer.ai/) 表格引擎，提供类似 Excel 的在线编辑体验，支持文件上传、在线编辑、下载导出等完整工作流。

## 核心功能

| 功能 | 说明 |
|------|------|
| 文件管理 | 创建空白表格、上传 Excel（xlsx/xls/csv）、下载、重命名、删除 |
| 在线编辑 | 基于 Univer 的全功能表格编辑器 |
| 用户系统 | 注册、登录、权限管理（用户/管理员） |
| 搜索过滤 | 按文件名搜索、分页浏览 |
| 响应式设计 | 适配桌面端与移动端 |

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | 前端框架（Composition API） |
| TypeScript | 5.9 | 类型安全 |
| Vite | 7.3 | 构建工具 |
| Ant Design Vue | 4.2 | UI 组件库 |
| Pinia | 3.0 | 状态管理 |
| Vue Router | 5.0 | 路由管理 |
| Univer | 0.16 | 在线表格引擎 |
| Axios | 1.13 | HTTP 客户端 |
| dayjs | 1.11 | 日期处理 |
| VueUse | 14.2 | 组合式工具集 |

## 快速开始

### 环境要求

- Node.js ^20.19.0 || >=22.12.0

### 安装依赖

```sh
npm install
```

### 开发模式（热重载）

```sh
npm run dev
```

访问：http://localhost:5173

### 生产构建

```sh
npm run build
```

### 代码检查与格式化

```sh
npm run lint        # ESLint + OXLint 检查并修复
npm run format      # Prettier 格式化
```

## 项目结构

```
src/
├── access/                   # 权限控制
│   ├── accessEnum.ts             # 权限枚举（NOT_LOGIN / USER / ADMIN）
│   └── index.ts                  # 路由守卫
├── api/                      # API 接口层
│   ├── userController.ts         # 用户相关接口
│   ├── fileController.ts         # 文件相关接口
│   ├── sheetController.ts        # 表格数据接口
│   └── typings.d.ts             # TypeScript 类型定义
├── assets/                   # 静态资源
├── components/               # 公共组件
│   ├── GlobalHeader.vue          # 全局顶部导航
│   ├── GlobalFooter.vue          # 全局底部栏
│   └── XlsxIcon.vue              # Excel 文件图标
├── layouts/                  # 布局组件
│   └── BasicLayout.vue           # 主布局（Header + Content + Footer）
├── pages/                    # 页面
│   ├── HomePage.vue              # 首页（功能介绍）
│   ├── WorkbenchPage.vue         # 工作台（文件管理主界面）
│   ├── file/
│   │   └── SpreadsheetPage.vue   # 在线表格编辑页
│   ├── user/
│   │   ├── UserLoginPage.vue     # 登录
│   │   └── UserRegisterPage.vue  # 注册
│   ├── admin/
│   │   └── UserManagePage.vue    # 用户管理（管理员）
│   └── error/
│       └── NoAuthPage.vue        # 无权限提示
├── router/                   # 路由配置
│   └── index.ts
├── stores/                   # 状态管理
│   └── useLoginUserStore.ts      # 登录用户状态
├── univer-plugins/           # Univer 自定义插件
│   └── save-button/              # 保存按钮插件
└── utils/                    # 工具函数
```

## 页面路由

| 路径 | 页面 | 权限 |
|------|------|------|
| `/` | 首页 | 公开 |
| `/workbench` | 工作台 | 登录用户 |
| `/spreadsheet/:fileId` | 表格编辑 | 登录用户 |
| `/admin/user` | 用户管理 | 管理员 |
| `/user/login` | 登录 | 公开 |
| `/user/register` | 注册 | 公开 |
| `/noAuth` | 无权限 | 公开 |

## IDE 推荐

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（禁用 Vetur）

### 浏览器开发工具

- Chromium 系浏览器（Chrome、Edge、Brave 等）：
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox：
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
