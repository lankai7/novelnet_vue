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
      <!--      页面内容-->
      <div class="container">
        <div class="top_box">管理书库</div>
        <div class="boxes">
          <div class="box">
            <div class="field">
              <label for="input2" class="name">搜索:</label>
              <input v-model="obj.name" id="input2" placeholder="请输入书籍名字" @input="QueryArgs"
                style="width: 24%; height: 37px; font-size: 14px;border: 1px solid #ccc;border-radius: 5px;" />
              <label for="input1" class="type">类别:</label>
              <select id="input1" v-model="obj.type" @change="QueryArgs">
                <option value=''>所有</option>
                <option v-for="(item, index) in obj.types" :key="index" :value="item">{{ item }}</option>
              </select>
              <label for="input3" class="order">顺序:</label>
              <select id="input3" v-model="obj.orderBy" @change="QueryArgs">
                <option value=''>ID</option>
                <option value="recommend_num">热度</option>
              </select>
            </div>
          </div>
          <div>
            <el-table :data="obj.books" style="width: 100%">
              <el-table-column prop="bid" label="ID" width="40px"></el-table-column>
              <el-table-column prop="name" label="书名" width="160px"></el-table-column>
              <el-table-column prop="author" label="作者" width="100px"></el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="180px"></el-table-column>
              <el-table-column prop="state" label="状态" width="100px"></el-table-column>
              <el-table-column prop="type" label="类型" width="80px"></el-table-column>
              <el-table-column prop="recommendNum" label="热度" width="60px"></el-table-column>
              <el-table-column prop="loveNum" label="点赞" width="60px"></el-table-column>
              <el-table-column prop="commentNum" label="评论" width="60px"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
            </el-table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from '../../hooks/request.js';
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

let obj = reactive({
  types: {},
  type: '',
  name: '',
  orderBy: '',
  books: [],
  searchBookArgs: {
  },
});

let route = useRoute();
let router = useRouter();

// 获取路由参数
let QueryArgs = () => {
  obj.searchBookArgs = {}; // 重置参数对象
  if (obj.type) obj.searchBookArgs.type = obj.type;
  if (obj.name) obj.searchBookArgs.name = obj.name;
  if (obj.orderBy) obj.searchBookArgs.orderBy = obj.orderBy;
  obj.searchBookArgs.num = -1;
  console.log(obj.type);
  getBooks();
};


let getBooks = () => {
  axios.get("/book/getType").then((res) => {
    obj.types = res.data.data;
  });
  axios.get("/book/getBooks", { params: obj.searchBookArgs })
    .then((res) => {
      if (res.data.code === 200) {
        obj.books = res.data.data || [];
      }
      else {
        obj.books == [];
      }
    });
}

onMounted(() => {
  QueryArgs();
});

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


.boxes {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.box {
  flex: 1;
  margin: 0 10px;
}

.field {
  display: flex;
  align-items: center;  /* 垂直居中 */

}

.field label {
  flex: 0 0 80px;
  margin-right: 10px;
  text-align: right;
  flex-direction: row;
}

.field input[type="text"],
.field input[type="file"],
.field select,
.field input[type="datetime-local"],
.field textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* ---- 🌟 按钮 ---- */
.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.buttons .submit-btn,
.buttons .cancel-btn {
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: scale(1.05);
}

.cancel-btn {
  background: #e74c3c;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #c0392b;
  transform: scale(1.05);
}

.submit-btn:active,
.cancel-btn:active {
  transform: scale(0.95);
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
}
</style>
