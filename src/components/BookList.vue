<template>
    <div class="book_list_box">
        <div class="booklist_background">
            <div class="book_list">
                <div class="book_list_title">
                    <span>{{ route.query.title || `搜索结果(${obj.books.length}条结果)` }}</span>
                    <button @click="router.go(-1)">返回上一页&gt;</button>
                </div>
                <div class="book_list_list">
                    <div v-for="(item, index) in obj.books" :key="index" class = "list_bak" @click="goBookDetail(item.bid) ">
                        <img :src="`/image/bookImg/${item.imgPath}`" />
                        <div class="book_list_list_content">
                            <div class="book_list_list_content_top">
                                <span class="book_list_list_content_top_left">{{ item.name }}</span>
                                <span class="book_list_list_content_top_right">{{ item.recommendNum }}🔥</span>
                            </div>
                            <span class="book_list_list_content_middle">
                                {{ cutString(item.introduction, 115) }}
                            </span>
                            <div class="book_list_list_content_bottom">
                                <span class = "author">{{ item.author }}</span>
                                <span class = "type">{{ item.type }} | {{ item.state }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cutString } from "../hooks/cutString";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    searchBookArgs: {},
    books: {}
});

// 获取路由参数
let routeQueryArgs = () => {
    let type = route.query.type;
    let name = route.query.name;
    let num = route.query.num;
    let orderBy = route.query.orderBy;

    obj.searchBookArgs = {}; // 重置参数对象
    if (type) obj.searchBookArgs.type = type;
    if (name) obj.searchBookArgs.name = name;
    if (num) obj.searchBookArgs.num = num;
    else obj.searchBookArgs.num = -1;
    if (orderBy) obj.searchBookArgs.orderBy = orderBy;

};

// 获取书籍数据
let getBooks = () => {
    routeQueryArgs();
    axios.get("/book/getBooks", { params: obj.searchBookArgs })
        .then((res) => {
            obj.books = res.data.data;
        });
};

// 监听 URL 参数变化
watch(() => route.query, () => {
    getBooks();
});

// 页面挂载时初次获取数据
onMounted(() => {
    getBooks();
});

// 跳转到书籍详情页
let goBookDetail = (bid) => {
    router.push({ name: 'bookDetail', params: { bid } });
};

</script>

<style scoped>
.book_list_box {
    padding-top: 0.1px;
}

.type_book_box {
    padding-top: 0.1px;
}

.book_list {
    margin-top: 40px;
}

.book_list_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    /* flex-wrap: wrap; */
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
    margin-left: 20px;
}

.book_list_title span {
    font-size: 22px;
    font-weight: 600;
}

.book_list_title button {
    padding: 0 5px;
    border: 0px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
    margin-right: 50px;
}

.book_list_title button:hover {
    background-color: #f78e8e;
}

.book_list_list {
    width: 90%;
    height: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    margin-left: 50px;

}

.book_list_list>div {
    margin: 15px 0;
    display: flex;
    height: 170px;
}

.book_list_list>div>img {
    height: 170px;
}

.book_list_list_content {
    padding: 15px 0 15px 30px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%
}

.book_list_list_content_top {
    display: flex;
    justify-content: space-between;
    
}

.book_list_list_content_top_left {
    color:#5e3c99;
    font-size: 25px;
    font-weight: 600;
    line-height: 30px;
}

.book_list_list_content_top_right {
    font-size: 18px;
    color: #8B0000;
    font-weight: 600;
    line-height: 30px;
}

.book_list_list_content_middle {
    color: #b76e79;
    font-size: 18px;
    text-indent: 20px;
    line-height: 25px;
}

.book_list_list_content_bottom {
    width: 100%;
    color: #1c3d5a;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between; /* 关键属性 */
}

.list_bak{
    flex: 1;
    background: rgba(0, 0, 0, 0.05);
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
.booklist_background{
    background: linear-gradient(-105deg,
            rgba(207, 172, 244, 0.6) 0%,
            rgba(208, 189, 247, 0.6) 20%,
            rgba(172, 218, 244, 0.6) 40%,
            rgba(209, 201, 233, 0.6) 60%,
            rgba(237, 172, 197, 0.6) 80%,
            rgba(255, 153, 153, 0.6) 100%);
    border-radius: 8px;
    margin: 30px 0;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 85%;
    margin: 0 auto;
    margin-top: 30px;
}

</style>