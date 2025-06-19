<template>
    <div class="type_book_box">
        <!-- 好看的小说 -->
        <div class="good_novel">
            <div class="good_novel_title">
                <span>{{ obj.type }}小说推荐</span>
                <button @click="showMove()">查看更多&gt;</button>
            </div>
            <div class="good_novel_list">
                <div v-for="(item, index) in obj.books" :key="index" class = "list_bak" @click="goBookDetail(item.bid)">
                    <img :src="`/image/bookImg/${item.imgPath}`" />
                    <div class="good_novel_list_content">
                        <span class="good_novel_list_content_top">{{ item.name }}</span>
                        <span class="good_novel_list_content_middle">
                            {{ cutString(item.introduction) }}
                        </span>
                        <div class="good_novel_list_content_bottom">
                            <span class = "author">{{ item.author }}</span>
                            <span class = "type">{{ item.type }} | {{ item.state }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "../hooks/request";
import { onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { cutString } from "../hooks/cutString";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    type: "",
    orderBy: "",
    books: {},
});

let getBooks = () => {
    obj.type = route.query.type;
    obj.orderBy = route.query.orderBy;
    axios.get("/book/getBooks", {
            params: {
                type: obj.type,
                orderBy: obj.orderBy,
                num: -1,
            },
        }).then((res) => {
            obj.books = res.data.data;
        });
};

let goBookDetail = (bid) => {
    router.push({name: 'bookDetail', params: {bid}});
}

let showMove = () => {
    router.push({
        path: "/hello/bookList",
        query: {
            type: obj.type,
        },
    });
};

onMounted(() => {
    getBooks();
});

watch(
    () => route.query.type,
    () => getBooks()
);
</script>

<style scoped>
.type_book_box {
    padding-top: 0.1px;
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
    background-color: #e66b94;
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

.good_novel_list>div {
    display: flex;
    height: 150px;
}

.good_novel_list>div>img {
    height: 150px;
}

.good_novel_list_content {
    padding: 10px 10px;
    display: flex;
    justify-content: space-between;

    flex-wrap: wrap;
}

.good_novel_list_content_top {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
    color: #5e3c99;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 用省略号代替超出部分 */
}

.good_novel_list_content_middle {
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
    max-width: 100%;
    max-height: 60%;
    overflow: hidden;
    /* 超出部分隐藏 */
    color:#b76e79;
}

.good_novel_list_content_bottom {
    width: 100%;
    color: #1c3d5a;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between; /* 关键属性 */
}

.list_bak{
    flex: 1;
    background: rgba(254, 254, 254, 0.3);
    backdrop-filter: blur(10px); /* 模糊滤镜，增强磨砂质感 */
    -webkit-backdrop-filter: blur(10px); /* 兼容 WebKit */
    padding: 15px 15px 15px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
}

.list_bak:hover{
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
</style>