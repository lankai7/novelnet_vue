# NovelNet - 小说阅读平台

![GitHub](https://img.shields.io/github/license/lankai7/novelnet)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.x-brightgreen)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)

## 📖 项目简介

NovelNet 是一个前后端分离的小说阅读平台，采用SpringBoot后端+Vue.js前端的架构设计。

## 🏗️ 项目结构

本项目由两个独立仓库组成：

1. **后端服务**：[novelnet-backend](https://github.com/lankai7/novelnet)
   - 基于SpringBoot的RESTful API服务
   - 提供数据接口和业务逻辑处理

2. **前端应用**：[novelnet-frontend](https://github.com/lankai7/novelnet_vue)
   - 基于Vue.js的单页应用
   - 提供用户交互界面

## 🛠️ 技术栈

### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 2.7.x | 后端框架 |
| MySQL | 8.0 | 主数据库 |
| Redis | 6.x | 缓存管理 |
| JWT | 0.11.x | 认证授权 |
| MyBatis-Plus | 3.5.x | ORM框架 |

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.x | 前端框架 |
| Element Plus | 2.x | UI组件库 |
| Pinia | 2.x | 状态管理 |
| Axios | 1.x | HTTP客户端 |
| Vite | 4.x | 构建工具 |

## 🚀 快速开始

### 后端服务启动

```bash
# 克隆后端仓库
git clone https://github.com/lankai7/novelnet.git

# 进入项目目录
cd novelnet

# 配置数据库
# 修改src/main/resources/application-dev.yml中的数据库配置

# 构建并启动

