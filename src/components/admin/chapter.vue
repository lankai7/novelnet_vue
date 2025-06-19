<template>
  <div class="wrapper fixed">
    <!-- 顶部导航栏 -->
    <header class="main-header animated">

      <nav class="navbar">
        <a href="#" class="sidebar-toggle">
          <span class="sr-only">小说后台管理系统</span>
        </a>
        <div class="navbar-custom-menu">

          <div class="navbar-dropdown el-dropdown">
            <div class="el-dropdown-link">
              <span>欢迎：admin</span>
              <!--              <img alt="U" src="/image/icon/love.jpg" style="width: 25px; height: 25px; border-radius: 50%; vertical-align: middle;">-->

            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- 侧边栏 -->
    <aside class="main-sidebar animated showSlide expandSide">
      <div class="el-scrollbar">
        <div class="vue-scrollbar el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <div class="sidebar">
              <ul class="el-menu el-menu-style">

                <li class="el-menu-sub el-submenu">
                  <div class="el-submenu__title" @click="gomanage()" style="padding-left: 20px;">
                    <i class="fa fa-upload"></i>
                    <span>管理书库</span>
                    <i class="el-submenu__icon-arrow"></i>
                  </div>
                </li>


                <li class="el-menu-sub el-submenu" @click="gochapter()">
                  <div class="el-submenu__title" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>上传新书</span>
                    <i class="el-submenu__icon-arrow"></i>
                  </div>

                </li>
                <li class="el-menu-sub el-submenu" @click="dele()">
                  <div class="el-submenu__title" @click="" style="padding-left: 20px;">
                    <i class="fa fa-cog"></i>
                    <span>删除小说</span>
                    <i class="el-submenu__icon-arrow"></i>
                  </div>

                </li>

                <li class="el-menu-sub el-submenu">
                  <div class="el-submenu__title" @click="banner()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>发布公告</span>
                  </div>
                </li>

                <li class="el-menu-sub el-submenu">
                  <div class="el-submenu__title" @click="discuss()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>评论审核</span>
                  </div>
                </li>

                <li class="el-menu-sub el-submenu">
                  <div class="el-submenu__title" @click="user" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>用户管理</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <div class="container">
        <div class="top_box">上传新书</div>
        <div class="boxes">
          <div class="box">
            <div class="id_box">  
            <label for="bookId">书籍编码：</label>
            <input v-model="obj.bookId" class="input" id="bookId" placeholder="请输入书籍编号" />
            </div>
            <div class="type_box"> 
            <label for="bookType">书籍类别：</label>
            <select id="input" v-model="obj.bookType" class="input">
              <option v-for="(item, index) in obj.types" :key="index" :value="item">{{ item }}</option>
            </select>
            </div>
            <button class="btn_start" @click="scrapeBook">爬取书籍</button>
            <p v-if="message">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import axios from '../../hooks/request.js';

let route = useRoute();
let router = useRouter();

let obj = reactive({
  bookId: '',
  bookType: '',
  message: '',
  types: ''
});

let scrapeBook = async () => {
  try {
    ElMessage.success("开始爬取")
    const response = await axios.post('/books/scrape', null, {
      params: { bookId: obj.bookId, bookType: obj.bookType }
    });
    obj.message = response.data.message;
  } catch (error) {
    obj.message = "爬取失败: " + (error.response?.data?.error || error.message);
    ElMessage.error("爬取失败")
  }
}
let getBook = async () => {
  await axios.get("/book/getType").then((res) => {
    obj.types = res.data.data;
  })
}
onMounted(getBook)


let gochapter = () => {
  router.push("/chapter");
}

let gomanage = () => {
  router.push("/manage");
}
let dele = () => {
  router.push("/dele");
}
let banner = () => {
  router.push("/banner");
}


let discuss = () => {
  router.push("/discuss");
}


let user = () => {
  router.push("/userinfo");
}
</script>

<style scoped>
/* 顶部导航栏样式 */
/* ---- 🌟 顶部导航栏 ---- */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #fefeff);
  z-index: 1030;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: white;
}

.navbar {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
}

.sidebar-toggle {
  font-size: 18px;
  cursor: pointer;
  margin-right: 15px;
  text-decoration: none;
}

.sr-only {
  color: white;
}

.navbar-custom-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

/* 侧边栏样式 */
.main-sidebar {
  position: fixed;
  top: 50px;
  left: 0;
  width: 230px;
  height: calc(100% - 50px);
  overflow: hidden;
  transition: width 0.3s ease;
  background: #2d3436;
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.main-sidebar.collapsed {
  width: 60px;
}

.sidebar {
  height: 100%;
  overflow-y: auto;
  text-decoration: none;
}

.el-menu {
  padding: 0;
  list-style: none;
}

.el-submenu__title {
  display: flex;
  align-items: center;
  height: 50px;
  color: rgb(255, 172, 17);
  background: #2d3436;
  cursor: pointer;
  padding-left: 20px;
  transition: background 0.3s ease-in-out;
}

.el-submenu__title:hover {
  background-color: #f7eff0;
}


.el-submenu__icon-arrow {
  margin-left: auto;
  transition: transform 0.3s;
}

.el-submenu__icon-arrow.el-icon-arrow-down {
  transform: rotate(0);
}

.el-submenu__icon-arrow.el-icon-arrow-up {
  transform: rotate(180deg);
}

/* 内容区域样式 */


.content-wrapper {
  margin-top: 25px;
  margin-left: 230px;
  padding: 20px;
  transition: margin-left 0.3s ease;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
}

.main-sidebar.collapsed+.content-wrapper {
  margin-left: 60px;
}


.container {
  display: flex;
  flex-direction: column;
  width: 85%;
  margin-top: 20px;
  min-width: 772px;
  min-height: 500px;
  border: none;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.top_box {
  width: 100%;
  height: 50px;
  font-size: 25px;

}

.box {
  display: flex;
  flex-direction: column;
  /* 垂直排列子元素 */
  gap: 20px;
}

.input {
  width: 30%;
  height: 37px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn_start {
  width: 38%;
  height: 38px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(158, 177, 242);
}

.btn_start:hover {
  color: #ffffff;
  background-color: #667eea;
}

/* ---- 🌟 响应式优化 ---- */
@media (max-width: 767px) {

  .main-header,
  .content-wrapper {
    margin-left: 0;
  }

  .sidebar-toggle {
    display: block;
  }

  .main-sidebar {
    width: 200px;
  }

  .container {
    width: 90%;
    padding: 15px;
  }

  .sidebar .el-submenu__title {
    font-size: 14px;
  }

}</style>
