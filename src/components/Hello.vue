<template>
    <div class="hello_box">
        <div class="top_nav_box">
            <div class="top_nav">
                <h1 class="title_ds">
                    <router-link to="/hello/home" :class="obj.top_nav_index == -1 ? 'link_class_h1' : 'no_link_class_h1'"
                        @click="chageTopNavIndex(-1)">
                        华理轻小说
                    </router-link>
                </h1>
                <ul class="type_ul">
                    <li v-for="(item, index) in obj.types" :key="index">
                        <router-link :to="`/hello/typeBook?type=${item}&orderBy=recommend_num`" :class="obj.top_nav_index == index ? 'link_class' : 'no_link_class'
                            " @click="chageTopNavIndex(index)">
                            {{ item }}
                        </router-link>
                    </li>
                </ul>
                <div class="search_box">
                    <input type="text" class="search_input" placeholder="书名搜索" @keyup.enter="searchBook()"
                        v-model="obj.searchStr" />
                    <button class="search_button" @click="searchBook()">🔍️</button>
                </div>
                <div class="manage">
                    <span v-if="obj.user.isAdmin == 1 " @click="goadminlogin()" class="manage"> 后台管理 </span>
                    <span v-if="obj.user.isAdmin != 1 " class="game_play"> 🕹️放松一下
                        <ul class="game_list">
                            <li class="game" @click="playGame('0')">环球飞机</li>
                            <li class="game" @click="playGame('1')">限时魔方</li>
                            <li class="game" @click="playGame('2')">拉杆子</li>
                            <li class="game" @click="playGame('3')">碾碎沙鸡</li>
                            <li class="game" @click="playGame('4')">文字生存</li>
                            <li class="game" @click="playGame('5')">勇者岛</li>
                        </ul>
                    </span>
                </div>
                <div class="top_nav_right">
                    <span @click="goBookshelf()" class="top_nav_right_bookshelf"> 书架 </span>
                    <span class="top_nav_right_theme">
                        主题
                        <ul class="theme_type">
                            <li class="theme_option" @click="themeChange('0')">落叶飘零</li>
                            <li class="theme_option" @click="themeChange('1')">蓝天白云</li>
                            <li class="theme_option" @click="themeChange('2')">樱花飞舞</li>
                        </ul>
                    </span>
                    <span v-if="!obj.isLogin" @click="goLogin()" class="top_nav_right_personal_center">
                        登录&nbsp;&nbsp;|&nbsp;&nbsp;注册
                    </span>
                    <span v-if="obj.isLogin" class="top_nav_right_personal_center">
                        欢迎用户：{{ obj.user.username }}
                        <ul class="top_nav_right_none_ul">
                            <li class="top_nav_right_none_ul_1" @click="goUserInformation()">个人信息</li>
                            <li class="top_nav_right_none_ul_2" @click="logout()">退出登录</li>
                        </ul>
                    </span>
                </div>
            </div>
        </div>
        <!-- 用于加载背景页面的 iframe -->
        <div class="hello_box_placeholder">
            <iframe id="background-iframe"></iframe>
        </div>
        <div class="content_box_max">
            <div class="content_box">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "../hooks/request";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from 'element-plus';

let route = useRoute();
let router = useRouter();
let themeUrl = '/image/background/sky-theme.html';//初始主题

// 响应式状态
let obj = reactive({
    types: [],
    top_nav_index: -1,
    isLogin: false,
    user: {},
    searchStr: "",
});

// 导航相关方法
let chageTopNavIndex = (index) => {
    obj.top_nav_index = index;
};

let clearTopNavIndex = () => {
    obj.top_nav_index = -2;
};

let goadminlogin = () => {
    clearTopNavIndex();
    router.push({ path: "/adminlogin" });
};

let goBookshelf = () => {
    if (obj.isLogin) {
        clearTopNavIndex();
        router.push({ path: "/hello/bookshelf" });
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            goLogin();
        }
    }
};

let goLogin = () => {
    clearTopNavIndex();
    router.push({ path: "/login" });
};

let logout = () => {
    obj.isLogin = false;
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push('/hello');
};

let goUserInformation = () => {
    router.push({ path: '/hello/userInformation' });
};

let searchBook = () => {
    if (obj.searchStr != null && obj.searchStr.trim() !== "") {
        clearTopNavIndex();
        router.push({
            path: "/hello/bookList",
            query: {
                name: obj.searchStr.trim(),
                t: Date.now()  // 避免缓存问题
            }
        });
    } else {
        ElMessage.warning("搜索内容为空");
    }
};

// 在 mounted 时重新加载用户和类型信息
let reload = () => {
    let user = sessionStorage.getItem("user");
    if (user) {
        obj.user = JSON.parse(user);
        obj.isLogin = true;
    } else {
        obj.user = {};
        obj.isLogin = false;
    }
    axios.get("/book/getType").then((res) => {
        obj.types = res.data.data;
    });
};

onMounted(() => {
    loadTheme();
    reload();
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        loadTheme(savedTheme);
    }
});

// 主题切换函数
function themeChange(type) {
    switch (type) {
        case '0':
            themeUrl = '/image/background/leaves-theme.html'; // 落叶主题
            break;
        case '1':
            themeUrl = '/image/background/sky-theme.html'; // 蓝天白云主题
            break;
        case '2':
            themeUrl = '/image/background/sakura-theme.html'; // 樱花飘散主题
            break;
        default:
            themeUrl = '/image/background/sky-theme.html'; //默认主题
    }

    if (themeUrl) {
        loadTheme(themeUrl);
        localStorage.setItem('selectedTheme', themeUrl); // 将主题 URL 保存在 localStorage 中
    }
}

// 加载主题
function loadTheme(url) {
    const iframe = document.getElementById('background-iframe');
    iframe.src = url || "/image/background/sky-theme.html"; // 如果 url 为空，则加载默认主题
}

//加载游戏
let playGame = (index) => {
    switch (index) {
        case '0':
            window.open("/image/game/环球飞行/环球飞机.html", "_blank");
            break;
        case '1':
            window.open("/image/game/魔方/魔方.html", "_blank");
            break;
        case '2':
            window.open("/image/game/搭杆子/拉杆子.html", "_blank");
            break;
        case '3':
            window.open("/image/game/碾碎沙鸡/碾碎沙鸡.html", "_blank");
            break;
        case '4':
            window.open("/image/game/文字生存/index.html", "_blank");
            break;
        case '5':
            window.open("/image/game/勇者岛/勇者岛.html", "_blank");
            break;
        default:
    }
}
</script>


<style scoped>
.top_nav_box {
    min-width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(45deg,
            rgba(207, 172, 244, 0.6) 0%,
            /* 添加透明度：0.8 */
            rgba(208, 189, 247, 0.6) 20%,
            rgba(172, 218, 244, 0.6) 40%,
            rgba(209, 201, 233, 0.6) 60%,
            rgba(237, 172, 197, 0.6) 80%,
            rgba(255, 153, 153, 0.6) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    /* 添加模糊效果 */
    z-index: 10;
}


.hello_box_placeholder {
    display: flex;
    min-width: 100%;
    height: 72px;
    background-color: transparent;
    /* 透明背景 */
    transition: height 0.3s ease;
    /* 添加高度过渡效果 */
}

/* 整体导航栏样式 */
.top_nav {
    margin: 0 auto;
    padding: 15px 0;
    /* 内边距 */
    border-radius: 20px;
    align-items: center;
    display: flex;
    justify-content: space-between; /* 关键属性 */
    white-space: nowrap;
    /* 防止文本换行 */
    width: 90%;
    min-width: 1000px;
    /* 设置最小宽度 */
}


/* 类型列表样式 */
.type_ul {
    width: 500px;
    background: none;
    list-style-type: none;
    /* 移除默认的列表样式 */
    padding: 0;
    /* 内边距为0 */
    margin: 0;
    /* 外边距为0 */
    display: flex;
    /* 使用Flexbox布局 */
    justify-content: center;
    /*子元素水平居中*/
}

/* 类型列表项样式 */
.type_ul li {
    font-size: 18px;
    /*字体大小*/
    margin: 0 5px;
    /* 左右外边距 */
    padding: 5px;
    /* 内边距 */
    background: none;
    /* 背景颜色 */
    border-radius: 8px;
    /* 边框圆角 */
    cursor: pointer;
    /* 鼠标悬停时变为手型 */
    transition: background-color 0.3s ease;
    /* 背景颜色过渡效果 */

}

.no_link_class {
    color: #2A2A5A;
    text-decoration: none;
    border-bottom: none;
}

.link_class {
    color: #bc2224;
    text-decoration: none;
    border-bottom: 3px solid #bc2224;
}

.link_class_h1,
.no_link_class_h1 {
    display: inline-block;
    font-family: "华文行楷", "STXingkai", cursive;
    font-weight: 500;
    font-size: 2.5rem;
    color: #D98DD9;
    /* 明亮的紫粉色 */
    letter-spacing: 0.1em;
    margin: 0;
    padding: 1.5rem;
    text-decoration: none;
    text-shadow:
        1px 1px 0px #B46FB4,
        /* 第一层阴影（深紫色） */
        2px 2px 0px #8F578F,
        /* 第二层阴影 */
        3px 3px 0px #6A406A,
        /* 第三层阴影 */
        4px 4px 6px rgba(0, 0, 0, 0.3);
    /* 模糊的外阴影 */
    transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.link_class_h1:hover,
.no_link_class_h1:hover {
    transform: scale(1.05);
    text-shadow:
        1px 1px 0px #B46FB4,
        2px 2px 0px #8F578F,
        3px 3px 0px #6A406A,
        4px 4px 12px rgba(0, 0, 0, 0.5);
    /* 加重模糊阴影 */
}



/* 鼠标悬停时的样式 */
.type_ul li:hover {
    background-color: #dda5bb;
    /* 鼠标悬停时的背景颜色 */
}

/* 如果v-for的item是激活状态，可以添加如下样式 */
.type_ul li.active {
    background-color: #4caf50;
    /* 激活状态的背景颜色 */
    color: #fff;
    /* 激活状态的文字颜色 */
}

/* 基础容器 - 模糊玻璃效果 (尺寸优化版) */
.search_box {
    position: relative;
    width: 240px;
    height: 35px;
    background: none;
    /* 去除背景颜色，仅作为容器 */
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
    display: flex;
    align-items: center;
    gap: 0;
}

/* 输入框 - 动态透明效果 (尺寸适配) */
.search_input {
    flex-grow: 1;
    height: 45%;
    padding: 10px 16px;
    border: none;
    border-radius: 17px 0 0 17px;
    /* 使左侧保持圆角 */
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.25) 0%, rgba(180, 180, 180, 0.12) 100%);
    backdrop-filter: blur(6px) contrast(1.1);
    color: #2A2A5A;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    white-space: nowrap;
    overflow-x: auto;
    /* 启用水平滚动 */
    text-overflow: ellipsis;
    transition: background 0.3s ease, box-shadow 0.2s ease;
}

.search_input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(42, 42, 90, 0.25);
    backdrop-filter: blur(4px);
}

/* 搜索按钮 - 渐变悬浮效果 (比例优化) */
.search_button {
    height: 103%;
    padding: 0 16px;
    background: linear-gradient(45deg, #C36EBD 0%, #EDACC5 100%);
    backdrop-filter: blur(8px) brightness(1.08);
    border: none;
    border-radius: 0 17px 17px 0;
    /* 使右侧保持圆角 */
    color: white;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.search_button:hover {
    transform: translateX(2px);
    box-shadow: 0 6px 12px rgba(195, 110, 189, 0.25);
}

.search_button:active {
    transform: translateX(1px);
}

/* 容器悬停动画 (性能优化) */
.search_box:hover {
    transform: translateY(-2px);
}

/* 暗黑模式适配 (对比度增强) */
@media (prefers-color-scheme: dark) {
    .search_input {
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.3) 0%, rgba(70, 70, 70, 0.15) 100%);
        color: #FFF;
    }

    .search_button {
        background: linear-gradient(45deg, #C36EBD 0%, #EDACC5 100%);
    }
}

/* 微交互优化 */
.search_input::placeholder {
    color: #9999B3;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.search_input:focus::placeholder {
    opacity: 0;
}

/* 硬件加速优化 */
.search_input,
.search_button {
    will-change: transform, opacity;
}

/* 响应式布局 */
@media (max-width: 600px) {
    .search_box {
        width: 90%;
    }
}

.top_nav_right {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: space-;
    /* 水平间距 */
    min-width: 150px;
    max-width: 300px;
    /* 宽度设置为100%，或者你可以根据需要设置具体的像素值 */
}

.top_nav_right span,
.manage {
    font-size: 14px;
    /* 字体大小 */
    color: #333;
    /* 字体颜色 */
    cursor: pointer;
    /* 鼠标悬停时变为手型图标，表示可以点击 */
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
}

.top_nav_right span:hover,
.manage:hover {
    color: #d7392b;
    /* 字体颜色 */
}

/* 如果需要设置登录和注册之间的间距，可以给它们添加单独的样式 */
.top_nav_right span:first-child {
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
}

.top_nav_right_bookshelf {
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
    width: 40px;
}

.top_nav_right_personal_center {
    /* width: 200px; */
    position: relative;
}

.top_nav_right_personal_center:hover .top_nav_right_none_ul {
    display: inline-block;
}

.top_nav_right_none_ul {
    display: none;
    width: 77px;
    color: #000000;
    list-style: none;
    padding: 10px;
    background-color: #ffffff;
    position: absolute;
    top: 20px;
    left: 0px;
    border-radius: 10px;
}

.top_nav_right_none_ul_2:hover {
    color: #bc2224;
}

.top_nav_right_none_ul_1:hover {
    color: #bc2224;
}

.top_nav_right_none_ul li {
    cursor: pointer;
    padding: 10px 10px;
}

.top_nav_right_none_ul li:hover {
    background-color: #efefef;
}

.content_box_max {
    position: relative;

}

.content_box {
    width: 1200px;
    margin: 0 auto;

}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* 隐藏页面的滚动条 */
}

#background-iframe {
    position: fixed;
    /* 固定定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* 放在最底层 */
    border: none;
    /* 移除边框 */
}

.content {
    position: relative;
    z-index: 1;
    /* 确保内容在背景上面 */
    padding: 20px;
    color: #333;
    text-align: center;
}

/* 主题相关按钮*/
.top_nav_right_theme {
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
    width: 50px;
    position: relative;
}

.top_nav_right_theme:hover .theme_type {
    /* 注意这里的空格 */
    display: inline-block;
}

.theme_type {
    display: none;
    width: 77px;
    color: #000000;
    list-style: none;
    padding: 10px;
    background-color: #ffffff;
    position: absolute;
    top: 20px;
    left: 0px;
    border-radius: 10px;
}

.theme_type li {
    cursor: pointer;
    padding: 10px 10px;
}

.theme_type li:hover {
    background-color: #f0f0f0;
}

.theme_option:hover {
    color: #bc2224;
}

/*游戏*/
.game_play {
    margin: 1.5rem auto;
    /*上下外边距为 1.5rem，左右自动，从而使容器在水平方向上居中。*/
    position: relative;
}

.game_play:hover .game_list {
    /* 注意这里的空格 */
    display: block;
}

.game_list {
    display: none;
    width: 77px;
    color: #000000;
    list-style: none;
    padding: 10px;
    background-color: #ffffff;
    position: absolute;
    top: 20px;
    left: 0px;
    border-radius: 10px;
}

.game_list li {
    cursor: pointer;
    padding: 10px 10px;
}

.game_list li:hover {
    background-color: #f0f0f0;
}

.game:hover {
    color: #bc2224;
}
</style>