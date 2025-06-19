<template>
    <div class="home_box">
        <div class="news_show">
            <!-- 左按钮 -->
            <img src="/image/icon/left.webp" class="scroll-btn left" @click="scrollLeft" alt="左滚动">
            <!-- 新闻资讯 -->
            <div class="news" ref="newsContainer">
                <!-- 公告列表 -->
                <div class="announcement-list">
                    <li v-for="item in announcements" :key="item.id" class="announcement-item">
                        <div class="announcement-header">
                            <span class="announcement-time">{{ item.createTime }}</span>
                        </div>
                        <h3 class="announcement-title">{{ item.title }}</h3>
                        <p class="announcement-link">
                            <a :href="formatLink(item.link)" target="_blank">{{ item.link }}</a>
                        </p>
                        <div class="tooltip">{{ item.title }}</div>
                    </li>

                </div>
            </div>
            <!-- 右按钮 -->
            <img src="/image/icon/right.webp" class="scroll-btn right" @click="scrollRight" alt="右滚动">
        </div>
        <!-- 好看的小说 -->
        <div class="good_novel">
            <div class="good_novel_title">
                <span>推荐新书</span>
                <button @click="showMove()">查看排行榜&gt;</button>
            </div>
            <div class="good_novel_list">
                <div v-for="item, index in obj.books" :key="index" class="good_novel_list_bak"
                    @click="goBookDetail(item.bid)">
                    <img :src="`/image/bookImg/${item.imgPath}`">
                    <div class="good_novel_list_content">
                        <span class="good_novel_list_content_top">{{ item.name }}</span>
                        <span class="good_novel_list_content_middle">{{ cutString(item.introduction) }}</span>
                        <div class="good_novel_list_content_bottom">
                            <span class = "author"> {{ item.author }}</span>
                            <span class = "type"> {{ item.type }} | {{ item.state }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { cutString } from "../hooks/cutString";
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

let route = useRoute();
let router = useRouter();
const newsContainer = ref(null);

let obj = reactive({
    books: {}
})

let announcements = ref([]);

let goBookDetail = (bid) => {
    router.push({ name: 'bookDetail', params: { bid } });
}

let showMove = () => {
    router.push({
        path: "/hello/bookList",
        query: {
            orderBy: "recommend_num",
            title: "排行榜"
        }
    });
};
//公告滚动按钮
const scrollLeft = () => {
    if (newsContainer.value) {
        newsContainer.value.scrollBy({ left: -260, behavior: "smooth" });
    }
}

const scrollRight = () => {
    if (newsContainer.value) {
        newsContainer.value.scrollBy({ left: 260, behavior: "smooth" });
    }
}

//补齐域名
const formatLink = (link) => {
    if (link == null) {
        return "";
    }
    else if (!link.startsWith("http://") && !link.startsWith("https://")) {
        return "https://" + link; // 默认补充 https://
    }
    else {
        return link;
    }
}
//获取公告
let fetchAnnouncements = async () => {
    try {
        let res = await axios.get("/announcement/list");
        if (res.data.code === 200) {  // 确保后端返回成功
            announcements = res.data.data;  // 取出 data 部分
        } else {
            ElMessage.warning("获取公告失败");
        }
    } catch (error) {
        console.error("获取公告失败", error);
        ElMessage.error("网络错误，无法获取公告！");
    }
}

onMounted(() => {
    fetchAnnouncements();
    axios.get("/book/getBooks", {
        params: {
            num: -1
        }
    }).then(res => {
        obj.books = res.data.data;
    })
})
</script>

<style scoped>
.home_box {
    padding-top: 10px;
}

.news {
    width: 100%;
    height: 150px;
    margin: 30px 0;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 20px;
    background: linear-gradient(45deg,
            rgba(207, 172, 244, 0.6) 0%,
            /* 添加透明度：0.8 */
            rgba(208, 189, 247, 0.6) 20%,
            rgba(172, 218, 244, 0.6) 40%,
            rgba(209, 201, 233, 0.6) 60%,
            rgba(237, 172, 197, 0.6) 80%,
            rgba(255, 153, 153, 0.6) 100%);
    display: flex;
    justify-content: space-between;

    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
    width: 100%;
    overflow-x: auto;
    /* 允许横向滚动 */
    white-space: nowrap;
    /* 禁止换行 */
    /* 隐藏滚动条 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE & Edge */
}

.news::-webkit-scrollbar {
    display: none;
    /* Chrome & Safari */
}

.news_title {
    width: 90px;
    height: 70px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    background-image: linear-gradient(to right bottom, #F8A889, #F9503F);
    text-align: center;
}

.news_title span {
    line-height: 30px;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    font-family: "宋体", sans-serif;
}

.news_content {

    width: 1060px;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.news_content a {
    color: #000000;
    font-size: 16px;
    text-decoration: none;
}

.good_novel {
    margin-top: 40px;
}

.good_novel_title {
    color:#8B0000;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.good_novel_title span {
    font-size: 22px;
    font-weight: 600;
}

.good_novel_title button {
    padding: 0 5px;
    border: 0px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.good_novel_title button:hover {
    background-color: #f78e8e;
}

.good_novel_list {
    width: 100%;
    height: 500px;
    margin-top: 20px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 35px;
    cursor: pointer;
    flex-direction: column;
}

.good_novel_list_bak {
    display: flex;
    height: 150px;
    flex: 1;
    background: rgba(254, 254, 254, 0.1);
    backdrop-filter: blur(10px);
    /* 模糊滤镜，增强磨砂质感 */
    -webkit-backdrop-filter: blur(10px);
    /* 兼容 WebKit */
    padding: 15px 15px 15px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
}

.good_novel_list_bak:hover {
    background: linear-gradient(45deg,
            rgba(207, 172, 244, 0.4) 0%,
            /* 添加透明度：0.8 */
            rgba(208, 189, 247, 0.4) 20%,
            rgba(172, 218, 244, 0.4) 40%,
            rgba(209, 201, 233, 0.4) 60%,
            rgba(237, 172, 197, 0.4) 80%,
            rgba(255, 153, 153, 0.4) 100%);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.good_novel_list>div>img {
    height: 150px;
}

.good_novel_list_content {
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;

    flex-wrap: wrap;
}

.good_novel_list_content_top {
    color: #5e3c99;
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 用省略号代替超出部分 */
}

.good_novel_list_content_middle {
    color: #b76e79;
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
    max-width: 100%;
    max-height: 60%;
    overflow: hidden;
    /* 超出部分隐藏 */
}

.good_novel_list_content_bottom {
    width: 100%;
    color: #1c3d5a;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between; /* 关键属性 */
}

/*公告*/
/* 公告栏容器 */
.announcement-container {
    margin: 30px auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    font-family: 'Arial', sans-serif;
}

/* 公告栏标题 */
.announcement-title {
    text-align: center;
    font-size: 28px;
    color: #2d3436;
    margin-bottom: 30px;
    font-weight: bold;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 用省略号代替超出部分 */
    max-width: 180px;
    /* 限制最大宽度 */
}

/* 公告项 */

.announcement-item {
    display: inline-block;
    vertical-align: top;
    width: 200px;
    height: 80px;
    background-color: rgba(236, 126, 126, 0.3);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    margin-right: 20px;
}

/*显示详细公告*/
.announcement-item {
    position: relative;
}

.tooltip {
    display: none;
    /* 隐藏时不显示 */
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    top: 10px;
    /* 固定在屏幕上的某个位置 */
    left: 50%;
    transform: translateX(-50%);
    /* 居中显示 */
    width: 100%;
    /* 设置宽度为父容器的 100% */
    max-width: 300px;
    /* 设置最大宽度限制 */
    white-space: normal;
    /* 允许自动换行 */
    z-index: 1000;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    position: fixed;
    /* 固定定位在屏幕上 */
    word-wrap: break-word;
    /* 保证长单词换行 */
    pointer-events: none;
    /*不影响鼠标*/
}

.announcement-item:hover .tooltip {
    display: block;
}


.announcement-item:hover {
    transform: translateY(-5px);
    z-index: 1000;
}

.announcement-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #aaa;
    margin-bottom: 5px;
}

.announcement-time {
    color: #666;
    margin-left: 80px;
    margin-bottom: 0px;
}

.announcement-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
    white-space: nowrap
}

.announcement-link {
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 用省略号代替超出部分 */
    max-width: 180px;
    /* 限制最大宽度 */
    text-decoration: none;
    font-size: 14px;
}

.announcement-link a {
    color: #1c3d5a;
    text-decoration: none;
    font-size: 14px;
}

.announcement-link a:hover {
    text-decoration: underline;
}

/* 📌 左右滚动按钮 */
.scroll-btn {
    background: none;
    width: 25px;
    border: none;
    padding: 10px 15px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.scroll-btn:hover {
    transform: scale(1.1);
}

.left {
    margin-right: 10px;
}

.right {
    margin-left: 10px;
}

.news_show {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    gap: 10px;
    /* 按钮与 news 之间的间距 */
}</style>