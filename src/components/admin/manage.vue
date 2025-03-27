<template>
  <div class="wrapper fixed">
    <!-- 顶部导航栏 -->
    <header class="main-header animated">

      <nav class="navbar">
        <a href="#" class="sidebar-toggle" >
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
    <aside class="main-sidebar animated showSlide expandSide" >
      <div class="el-scrollbar">
        <div class="vue-scrollbar el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <div class="sidebar">
              <ul class="el-menu el-menu-style">

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="gomanage()" style="padding-left: 20px;">
                    <i class="fa fa-upload"></i>
                    <span>上新小说</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>
                </li>


                <li class="el-menu-sub el-submenu" @click="gochapter()" >
                  <div class="el-submenu__title"  style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>章节发布</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>

                </li>
                <li class="el-menu-sub el-submenu" @click="dele()">
                  <div class="el-submenu__title" @click="" style="padding-left: 20px;">
                    <i class="fa fa-cog"></i>
                    <span>删除小说</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>

                </li>

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="banner()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>发布公告</span>
                  </div>
                </li>

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="discuss()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>评论审核</span>
                  </div>
                </li>

                <li class="el-menu-sub el-submenu" >
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
        <div class="top_box">发布小说</div>
        <div class="boxes">
          <div class="box">
<!--            <div class="field">-->
<!--              <label for="input1">是否需要会员</label>-->
<!--              <input type="text" id="input1" placeholder="小说编号" >-->
<!--            </div>-->
            <div class="field">
              <label for="input2">*小说分类</label>
              <select id="input2" v-model="novelData.tags">
                <option value="都市">都市</option>
                <option value="科幻">科幻</option>
                <option value="修仙">修仙</option>
                <option value="悬疑">悬疑</option>
                <option value="武侠">武侠</option>
                <option value="玄幻">玄幻</option>
                <option value="言情">言情</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="field">
              <label for="input3">*章节</label>
              <select id="input2"  >
                <option value="第一章">第一章</option>
                <option value="第二章">第二章</option>
                <option value="第三章">第三章</option>
                <option value="第四章">第四章</option>
                <option value="第五章">第五章</option>
                <option value="第六章">第六章</option>
                <option value="第七章">第七章</option>
                <option value="第八章">第八章</option>
                <option value="第九章">第九章</option>
              </select>
            </div>
            <div class="field">
              <label for="input4">更新时间</label>
              <input type="datetime-local" id="input4"  v-model="novelData.publish_time">
            </div>
            <div class="field">
              <label for="input5">出版社</label>
              <input type="text" id="input5" placeholder="出版社名称"  >
            </div>
          </div>
          <div class="box">
            <div class="field">
              <label for="input6">*小说名</label>
              <input type="text" id="input6" placeholder="请输入小说名" v-model="novelData.novel_title">
            </div>
            <div class="field">
              <label for="fileInput">封面</label>
              <input type="text" id="fileInput" placeholder="图片地址"  v-model="novelData.cover_image_url">
            </div>
            <div class="field">
              <label for="input7">作者</label>
              <input type="text" id="input7" placeholder="请输入作者名"  v-model="novelData.author">
            </div>

            <div class="field">
              <label for="input8">小说简介</label>
              <textarea type="text" id="input8" placeholder="小说简介" v-model="novelData.introduction"> </textarea>
            </div>

          </div>
        </div>
        <div class="buttons">
          <button class="submit-btn" @click="handleSubmit">提交</button>
          <button class="cancel-btn" @click="handleCancel">取消</button>
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


let route = useRoute();
let router = useRouter();
// 章节

// 提交小说
const novelData = ref({
  tags: [],
  publish_time: '',
  novel_title: '',
  cover_image_url: '',
  author: '',
  introduction: ''
});
//时间戳
function convertToTimestamp(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.getTime();
}

// 提交表单
const handleSubmit = async () => {



  try {
    const response =  await axios.post('http://localhost:8080/novel/publish', {
      tags: [novelData.value.tags],
      publish_time: convertToTimestamp(novelData.value.publish_time),
      novel_title: novelData.value.novel_title,
      cover_image_url: novelData.value.cover_image_url,
      author: novelData.value.author,
      introduction: novelData.value.introduction,
      is_vip: 0,
      is_finished: 1,
    });

    if (response.data.code === 0) {
      ElMessage.success('发布成功！');
      setTimeout(() => {
        alert('您发布的小说编号为：' + response.data.data);
      }, 1000);
      // 清空表单
      for (const key in novelData.value) {
        if (key === 'cover') {
          // novelData.value[key] = null;
        } else {
          // novelData.value[key] = '';
        }
      }
    } else {
      ElMessage.warning('发布失败，请稍后再试！');
    }
  } catch (error) {
    ElMessage.error('发布失败，请检查网络连接！');
    console.log("novelData:" + novelData.id)
  }
};

// 取消操作
const handleCancel = () => {
  // 清空表单
  for (const key in novelData.value) {
    if (key === 'cover') {
      novelData.value[key] = null;
    } else {
      novelData.value[key] = '';
    }
  }
};



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
  margin-top: 50px;
  margin-left: 230px;
  padding: 20px;
  transition: margin-left 0.3s ease;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.main-sidebar.collapsed + .content-wrapper {
  margin-left: 60px;
}


.container {
  display: flex;
  flex-direction: column;
  width: 85%;
  height: 85%;
  min-width: 772px;
  min-height: 500px;
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.top_box {
  width: 100%;
  height: 50px;
  font-size:25px;

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
.field input[type="text"], .field input[type="file"] ,.field select,.field input[type="datetime-local"]
,.field textarea{
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

.buttons .submit-btn, .buttons .cancel-btn {
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

.submit-btn:active, .cancel-btn:active {
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
