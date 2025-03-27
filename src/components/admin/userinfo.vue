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
        <div class="top_box">用户管理</div>
        <!--        <div class="field">-->
        <!--          <label for="input8">公告内容：</label>-->
        <!--          <textarea type="text" id="input8" placeholder="小说简介"> </textarea>-->
        <!--        </div>-->

        <div>
          <el-table :data="userinfo" style="width: 100%">
            <el-table-column prop="uid" label="ID" width="80px"></el-table-column>
            <el-table-column prop="account" label="账号" width="120px"></el-table-column>
            <el-table-column prop="username" label="用户名" width="120px"></el-table-column>
            <el-table-column prop="userIntegral" label="积分" width="80px"></el-table-column>
            <el-table-column prop="grade" label="等级" width="80px"></el-table-column>
            <el-table-column prop="email" label="注册邮箱" width="180px"></el-table-column>
            <el-table-column label="VIP状态">
              <template #default="scope">
                <el-switch v-model="scope.row.vip_status" :inactive-value="0" :active-value="1"
                  @change="handleVipChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="enrollTime" label="创建时间" width="180px"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" size="small" @click="() => handleDelete(scope.row.user_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--      <div class="buttons">-->
        <!--        <button class="submit-btn" onclick="handleSubmit()">提交</button>-->
        <!--        <button class="cancel-btn" onclick="handleCancel()">取消</button>-->
        <!--      </div>-->
      </div>


    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from 'vue';
import axios from '../../hooks/request.js';
import { ElMessage } from "element-plus";




let route = useRoute();
let router = useRouter();
// 评论
let userinfo = ref([]);

// 获取评论数据
let userin = async () => {
  try {
    const res = await axios.get("user/token/getUserAll");
    if (res.data.code === 200) {
      userinfo.value = res.data.data
    } else {
      ElMessage.warning('请稍后再试！');
    }
  } catch (error) {
    ElMessage.error('稍后');
  }
};
// 设置VIP状态
const handleVipChange = async (row) => {
  try {
    const newStatus = row.user_status == 1 ? 0 : 1;
    const res = await axios.put("user/updateVIP", {
      uid: row.uid,
      isVip: newStatus
    });
    if (res.data.code == 200) {
      row.user_status = newStatus;
      ElMessage.success('VIP状态更新成功！');
    } else {
      ElMessage.warning('VIP状态更新失败，请稍后再试！');
    }
  } catch (error) {
    ElMessage.error('VIP状态更新失败，请检查网络连接！');
  }
};

// 删除
let handleDelete = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:8080/user/${id}`);
    if (res.data.code === 0) {
      ElMessage.success('删除成功！');
    } else {
      ElMessage.warning('删除失败，请稍后再试！');
    }
  } catch (error) {
    ElMessage.error('删除失败，请检查网络连接！');
  }
};



// 组件挂载时获取评论数据
onMounted(userin);


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
  padding-top: 25px;
}

.box {
  flex: 1;
  margin: 0 10px;
}

.field {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
}

.field label {
  flex: 0 0 100px;
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
