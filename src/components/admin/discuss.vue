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
      <!-- 页面内容 -->
      <div class="container">
        <div class="top_box">评论审核</div>

        <!-- 输入框用于获取书籍编号 -->
        <div class="field novel">
          <label for="bookId">书籍编号:</label>
          <input v-model="data.bookId" id="bookId" placeholder="请输入书籍编号"
            style="width: 20%; height: 37px; font-size: 14px;border: 1px solid #ccc;border-radius: 5px 0 0 5px;" />
          <!-- 添加按钮 -->
          <el-button type="primary" class = "btn" @click="handleSearch">搜索</el-button>
        </div>

        <div>
          <el-table :data="data.comments" style="width: 100%">
            <el-table-column prop="userName" label="用户名" width="100"></el-table-column>
            <el-table-column prop="bookId" label="书号" width="60"></el-table-column>
            <el-table-column prop="commentText" label="评论内容"></el-table-column>
            <el-table-column prop="createTime" label="评论时间" width="160"></el-table-column>
            <el-table-column prop="status" label="评论状态" width="80"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" size="small" @click="handleDelete(scope.row)">更改状态</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '../../hooks/request.js';
import { ElMessage } from "element-plus";

let route = useRoute();
let router = useRouter();
// 评论
let data = reactive({
  comments: [],
  bookId: '',
})

let handleSearch = () => {
  fetchComments();
}

// 获取评论列表
const fetchComments = async () => {
  let bid = data.bookId;
  if(bid == '') bid = 0;
  const response = await axios.get(`comment/${bid}`);

  if (response.data.code === 200) {
    data.comments = response.data.data || []; // 确保 data.comments 至少是空数组
  } else {
    data.comments = [];
  }
}

// 删除
let handleDelete = async (id) => {
  const res = await axios.delete(`comment/delete/${id.commentId}`);
  if (res.data.code == 200) {
    ElMessage.success('更改成功！');
    fetchComments();
  } else {
    ElMessage.warning('更改失败，请稍后再试！' + num);
  }
};






// 组件挂载时获取评论数据
onMounted(fetchComments);


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
  padding-top: 25px;
  flex-direction: column;
}

.box {
  flex: 1;
  margin: 0 10px;
}

.field {
  display: flex;
  align-items: center;
}

.field label {
  font-size: 17px;
  flex: 0 0 80px;
  margin-right: 10px;
  text-align: right;
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

.buttons {
  display: flex;
  justify-content: space-between;
  margin: 5px 34% 5px;
}

.buttons .submit-btn,
.buttons .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  margin: 0 10px;
}

.buttons .submit-btn {
  background-color: #28a745;
  color: #fff;
}

.buttons .cancel-btn {
  background-color: #dc3545;
  color: #fff;
}



/* 用户头像样式 */
.header-pic img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}


.el-table {
  margin: 20px 0;
}
.btn{
  height:38px;
  border-radius: 0 5px 5px 0;
}

/* 响应式调整 */
@media (max-width: 767px) {

  .main-header,
  .content-wrapper {
    margin-left: 0;
  }

  .sidebar-toggle {
    display: block;
  }
}
</style>
