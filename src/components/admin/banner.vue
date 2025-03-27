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
                    <span>上新小说</span>
                    <i class="el-submenu__icon-arrow"></i>
                  </div>
                </li>


                <li class="el-menu-sub el-submenu" @click="gochapter()">
                  <div class="el-submenu__title" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>章节发布</span>
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
                  <div class="el-submenu__title" @click="gobanner()" style="padding-left: 20px;">
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
        <div class="top_box">发布公告</div>
        <div class="news_content">
          <div class="input-container">
            <input v-model="data.newTitle" placeholder="请输入公告标题..." class="input-field" />
            <input v-model="data.newLink" placeholder="可选：请输入公告链接..." class="input-field" />
            <div class="btn">
              <button class="add-btn" @click="addAnnouncement">发布公告</button>
            </div>
          </div>
        </div>
        <div class=news_list>
          <el-table :data="data.announcements" style="width: 100%">
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="title" label="公告标题" width="360"></el-table-column>
            <el-table-column prop="link" label="🔗链接" width="250"></el-table-column>
            <el-table-column prop="createTime" label="📅发布时间" width="160"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" size="small" @click="() => deleteAnnouncement(scope.row.id)">删除</el-button>
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
import axios from "../../hooks/request.js";
import { ElMessage } from "element-plus";

let route = useRoute();
let router = useRouter();

let data = reactive({
  announcements: [],
  newTitle: "",
  newLink: "",
})

let gochapter = () => {
  router.push("/chapter");
}

let gomanage = () => {
  router.push("/manage");
}
let dele = () => {
  router.push("/dele");
}

let discuss = () => {
  router.push("/discuss");
}

let user = () => {
  router.push("/userinfo");
}

let fetchAnnouncements = async () => {
  try {
    let res = await axios.get("/announcement/list");
    if (res.data.code === 200) {  // 确保后端返回成功
      data.announcements = res.data.data;  // 取出 data 部分
    } else {
      ElMessage.warning("获取公告失败");
    }
  } catch (error) {
    console.error("获取公告失败", error);
    ElMessage.error("网络错误，无法获取公告！");
  }
}

let addAnnouncement = async () => {
  if (!data.newTitle.trim()) {
    alert("公告标题不能为空！");
    return;
  }
    const res = await axios.post("/announcement/add", {
      title: data.newTitle,
      link: data.newLink || null,
    });
    if (res.data.code === 200) {
      ElMessage.success('添加成功！');
      fetchAnnouncements();
      data.newTitle = "";
      data.newLink = "";
    }
}

let deleteAnnouncement = async (id) => {
  if (!confirm("确定要删除这条公告吗？")) return;

    const res = await axios.delete(`/announcement/delete/${id}`);
    if (res.data.code === 200) {
      ElMessage.success('删除成功！');
      fetchAnnouncements();
    }
}

onMounted(fetchAnnouncements);


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
  box-shadow: 0 4px 10px rgba(240, 208, 208, 0.5);
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

/* ---- 🌟 内容区域 ---- */
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

.field {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-weight: bold;
  font-size: 16px;
  color: #2d3436;
  display: block;
  margin-bottom: 8px;
}

.news_content {
  display: flex;
  width: 85%;
  margin-top: 20px;
  border: none;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

news_content.h3 {
  color: #444;
  font-size: 18px;
  margin-bottom: 10px;
}

news_content.ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

news_content.li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}

news_content.li:hover {
  background: #eee;
}

news_content.a {
  text-decoration: none;
  color: #007bff;
  font-size: 14px;
}

.delete-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  color: red;
  cursor: pointer;
}

.delete-btn:hover {
  color: darkred;
}

.input-container {
  display: flex;
  gap: 20px;
  /* 两个部分的间距 */
  align-items: flex-start;
  /* 左对齐 */
  height: 35px;

}

.input-field {
  width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}
.btn{
  width: 100px;
}
.add-btn {
  height: 35px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}

.add-btn:hover {
  background: #0056b3;
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
