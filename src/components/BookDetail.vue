<template>
    <div class="book_detail_box">
        <div class="book_detail_title">
            <span>小说详情</span>
            <button @click="router.go(-1)">返回上一页&gt;</button>
        </div>
        <div class="book_detail_top">
            <img :src="`/image/bookImg/${obj.book.imgPath}`" class="book_detail_img" />
            <div class="book_detail_content">
                <span class="book_detail_content_name">{{ obj.book.name }}</span>
                <span class="book_detail_content_author">{{ obj.book.author }}</span>
                <div class="book_detail_content_tag">
                    <span class="book_detail_content_type">
                        {{ obj.book.type }}
                    </span>
                    <span>
                        {{ obj.book.state }}
                    </span>
                    <span>
                        好评：{{ obj.book.loveNum }}
                    </span>
                </div>
                <div>
                    <span class="book_detail_content_issuedTime">
                        更新时间：{{ obj.book.updateTime }}
                    </span>
                    <span>
                        {{ obj.lastChapterNum == 0 ? '未阅读' : `已看章节：第${obj.lastChapterNum}章 ${obj.lastChapter.title}` }}
                    </span>
                </div>
                <div class="book_detail_content_but_box">
                    <button class="book_detail_content_but_read" @click="readBook(-1)">
                        {{ obj.lastChapterNum == 0 ? '开始阅读' : '继续阅读' }}
                    </button>
                    <div class="book_detail_content_but_praise" @click="thumbsUp()">
                        <div class="icon-container">
                            <img src="/image/icon/praise.png" alt="好评图标">
                        </div>
                        <span>好评</span>
                        <span>-{{ obj.book.loveNum }}-</span>
                    </div>
                    <div class="book_detail_content_but_collect" @click="collectBook()">
                        <div class="icon-container">
                            <img src="/image/icon/love.png" alt="收藏图标">
                        </div>
                        <span>收藏</span>
                        <span>-{{ obj.book.collectNum }}-</span>
                    </div>
                    <div class="book_detail_comment" @click="goComment()">
                        <div class="icon-container">
                            <img src="/image/icon/comment.png" alt="评论图标">
                        </div>
                        <span>评论</span>
                        <span>-{{ obj.book.commentNum }}-</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="book_detail_introduction_box">
            <div class="book_detail_introduction_title">
                <span>书籍简介</span>
            </div>
            <div class="book_detail_introduction_content">
                <span>{{ obj.book.introduction }}</span>
            </div>
        </div>
        <!--章节目录 -->
        <div class="book_detail_chapters_box">
            <div class="book_detail_chapters_title">
                <span>书籍章节</span>
            </div>
            <!--分页按钮 -->
            <div class="pagination">
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    :class="{ active: page === currentPage }">
                    {{ 1 + (page - 1) * 100 }} - {{ page * pageUnit }}
                </button>
            </div>
            <ul class="book_detail_chapters_content">
                <li v-for="item in (obj.book.chapters || []).slice(currentChapters, currentChapters + pageUnit)"
                    :key="item.chapterNum" @click="readBook(item.chapterNum)">
                    <span>第{{ item.chapterNum }}章</span>
                    <span>《{{ item.title }}》</span>
                </li>
            </ul>
        </div>

        <!-- 评论区 -->
        <div class="book_detail_comments_box" id="commentsSection">
            <!-- 标题栏 -->
            <div class="book_detail_comments_titleh">
                <span>用户评论</span>
                <span class="comment_count">({{ obj.book.commentNum }} 条评论)</span>
                <span class="to_top" @click="goTop()">回到顶部</span>
            </div>

            <!-- 添加评论 -->
            <div class="book_detail_comments_content">
                <textarea v-model="data.newComment" placeholder="添加评论..." rows="3"></textarea>
                <button @click="submitComment">提交评论</button>
            </div>

            <!-- 评论列表 -->
            <div class="book_detail_comments_list">
                <div v-for="(comment, index) in data.comments" :key="index" class="comment_item">
                    <!-- 评论内容 -->
                    <div class="comment_content">
                        <p class="comment_user">{{ comment.userName }}：</p>
                        <p class="comment_text">{{ comment.commentText }}</p>
                        <small class="comment_time">{{ comment.createTime }}</small>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

let route = useRoute();
let router = useRouter();
let totalPages; // 总页数（可以根据实际情况修改）
let currentPage = ref(1); // 当前选中的页数
let pageUnit = 100; //设置单页显示章数
let currentChapters = ref(0);
let obj = reactive({
    book: {},
    lastChapter: {},
    lastChapterNum: 0,
})
let data = reactive({
    newComment: '',
    comments: {},
})


//翻页
let PageCount = (totalChapters) => {
    totalPages = Math.ceil(totalChapters / pageUnit); // 总页数（可以根据实际情况修改）
}

let changePage = (page) => {
    currentPage.value = page;
    currentChapters.value = ((page - 1) * pageUnit);
    console.log("切换到第", page, "页");
    // 这里可以添加加载该页数据的逻辑
};

//收藏图书
let collectBook = () => {
    let user = sessionStorage.getItem('user');
    if (user) {
        let uid = JSON.parse(user).uid;
        axios.post("/bookshelf/token/addBook", {
            uid,
            bid: obj.book.bid
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(res => {
            if (res.data.code == 201) {
                ElMessage.success("收藏成功！")
                getBook();
            } else if (res.data.code == 403) {
                ElMessage.warning("重复收藏！")
            } else {
                ElMessage.error("收藏失败！")
            }
        })
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            router.push({ path: '/login' });
        }
    }
}

//点赞
let thumbsUp = () => {
    if (sessionStorage.getItem('user')) {
        axios.put(`/book/token/thumbsUp?bid=${obj.book.bid}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(res => {
                if (res.data.code == 200) {
                    ElMessage.success("点赞成功！")
                    getBook();
                } else {
                    ElMessage.error("点赞失败！")
                }
            })
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            router.push({ path: '/login' });
        }
    }
}
//跳转评论区
let goComment = () => {
    const commentsSection = document.getElementById("commentsSection");
    const offset = 200; // 让它比原本的位置高 100px
    const position = commentsSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: position, behavior: 'smooth' });
}
//跳到顶部
let goTop = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
};
let getBook = () => {
    axios.get(`/book/getBook/${route.params.bid}`).then(res => {
        if (res.data.code == 200) {
            obj.book = res.data.data;
            getLastChapter();
            fetchComments();
            PageCount(obj.book.chapters.length);   //总章节数
        }
    })
}

//获取阅读的章节
let getLastChapter = () => {
    let user = sessionStorage.getItem('user');
    if (user) {
        let uid = JSON.parse(user).uid;
        axios.get("/bookshelf/token/getBookshelf", {
            params: {
                uid,
                bid: obj.book.bid
            }
        }).then(res => {
            if (res.data.code == 200) {
                obj.lastChapterNum = res.data.data.lastChapter;
                axios.get("/chapter/getChapter", {
                    params: {
                        uid,
                        bid: obj.book.bid,
                        chapterNum: obj.lastChapterNum
                    }
                }).then(res2 => {
                    if (res2.data.code == 200) {
                        obj.lastChapter = res2.data.data;
                    }
                })
            }
        })
    } else {
        obj.lastChapter = 0;
    }
}
// 获取评论列表
const fetchComments = async () => {
    const response = await axios.get(`comment/${obj.book.bid}`);

    if (response.data.code === 200) {
        data.comments = response.data.data || []; // 确保 data.comments 至少是空数组
    } else {
        data.comments = [];
    }
}

// 提交评论
const submitComment = async () => {
    if (!data.newComment.trim()) {
        ElMessage.warning("评论内容不能为空！");
        return;
    }
    try {
        let user = sessionStorage.getItem('user');
        let uid = JSON.parse(user).uid;
        let name = JSON.parse(user).username;
        const response = await axios.post("/comment/add", {
            bookId: obj.book.bid,
            userId: uid,
            userName: name,
            commentText: data.newComment,
        });

        if (response.data.code === 200) {
            data.comments.push({
                user_name: user.userName,
                comment_text: data.newComment,
                create_time: new Date().toISOString(),
            });
            data.commentCount++;
            data.newComment = "";
            ElMessage.success(response.data.msg);
            getBook();
        } else {
            ElMessage.warning("提交评论失败：" + response.data.msg);
        }
    } catch (error) {
        if (confirm("此操作需要登录，是否登录？")) {
            router.push({ path: '/login' });
        } else {
            ElMessage.error("提交评论失败：未登录或网络错误！");
        }
    }
};

let readBook = (chapterNum) => {
    if (chapterNum < 0) {
        router.push({ path: '/readBook', query: { bid: obj.book.bid, chapterNum: obj.lastChapterNum } });
    } else {
        router.push({ path: '/readBook', query: { bid: obj.book.bid, chapterNum } });
    }
}

onMounted(() => {
    getBook();
})
</script>

<style scoped>
.book_detail_box {
    padding-top: 0.1px;
}

/* 添加CSS样式 */
/* 通用按钮样式 */
.book_detail_content_but_praise,
.book_detail_content_but_collect,
.book_detail_comment {
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    margin-left: 12px;
    /* 按钮间距 */

    &:hover {
        .icon-container {
            transform: scale(1.2);

            img {
                filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
            }
        }

        span {
            transform: translateY(-1px);
        }
    }

    span {
        transition: transform 0.2s ease;
        margin-left: 6px;
    }
}

/* 按钮使用红色系 */
.book_detail_content_but_collect:hover,
.book_detail_content_but_praise:hover,
.book_detail_comment:hover {
    color: #f56c6c;
    filter: hue-rotate(-10deg);
}


/* 图标动画增强 */
.praise-icon {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);

    &:hover {
        animation: thumbsUp 0.6s ease;
    }
}

@keyframes thumbsUp {
    0% {
        transform: scale(1) rotate(0deg);
    }

    25% {
        transform: scale(1.3) rotate(-10deg);
    }

    50% {
        transform: scale(1.1) rotate(5deg);
    }

    75% {
        transform: scale(1.2) rotate(-5deg);
    }

    100% {
        transform: scale(1.15) rotate(0deg);
    }
}

/* 移动端适配 */
@media (hover: none) {
    .book_detail_content_but_praise:hover {
        .icon-container {
            transform: none !important;
        }

        span {
            transform: none !important;
        }
    }
}

/* 章节目录分页按钮 */
.pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 20px;
    padding: 0 0 15px 0;
    flex-wrap: wrap;
    /* 允许按钮换行 */
    justify-content: flex-start;
    /* 让按钮左对齐 */
}

/* 按钮样式 */
.pagination button {
    padding: 5px 10px;
    border: 2px solid #fadede;
    border-radius: 15px;
    background-color: rgba(251, 192, 192, 0.6);
    color: #333;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 2px 5px rgba(241, 118, 118, 0.6);
    text-align: center;

    /* 防止文字换行 */
    white-space: nowrap;

    /* 设置最小和最大宽度，确保按钮不太宽 */
    min-width: 9%;
    /* 最小宽度 */
    max-width: 9%;
    /* 最大宽度，可以根据需要调整 */
}

/* 按钮悬停效果 */
.pagination button:hover {
    background-color: rgba(255, 255, 255, 0.6);
    border-color: #f78e8e;
    color: rgb(249, 134, 134);
    transform: translateY(-2px);
}

/* 当前页按钮 */
.pagination button.active {
    background-color: #f78e8e;
    color: white;
    border-color: #fadede;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(164, 1, 173, 0.3);
}

/* 小圆点分页样式 */
.pagination button.dot {
    font-size: 16px;
    border-radius: 50%;
    background-color: #e0e0e0;
}

.pagination button.dot:hover {
    background-color: #f78e8e;
}


.book_detail_title {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.book_detail_title span {
    font-size: 22px;
    font-weight: 600;
}

.book_detail_title button {
    padding: 0 5px;
    border: 0px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.book_detail_title button:hover {
    background-color: #e66b94;
}

.book_detail_top {
    height: 250px;
    margin-top: 30px;
    display: flex;
}

.book_detail_chapters_content {
    list-style: none;
    columns: 3;
    /* 分成三栏 */
    column-gap: 40px;
    /* 两栏间距 */
}

.book_detail_content {
    width: 600px;
    padding: 15px 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.book_detail_content_name {
    font-weight: 600;
    font-size: 30px;
}

.book_detail_content_author {
    color: #ff1500;
}

.book_detail_content_type {
    margin-right: 30px;
    padding: 0 10px;
    display: inline-block;
    border-radius: 5px;
    font-size: 14px;
    line-height: 25px;
}

.book_detail_content_tag span:last-of-type {
    margin-left: 50px;
}

.book_detail_content_issuedTime {
    display: inline-block;
    margin-right: 30px;
}

.book_detail_content_but_box {
    display: flex;
}

.book_detail_content_but_read {
    width: 170px;
    height: 50px;
    margin-right: 80px;
    border: none;
    border-radius: 25px;
    background-color: #CB3D30;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
}


.book_detail_content_but_read:hover {
    text-decoration: underline;
    color: #f1df8f;
    filter: hue-rotate(-10deg);
}

.book_detail_content_but_praise,
.book_detail_content_but_collect,
.book_detail_comment {
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.book_detail_content_but_praise img,
.book_detail_content_but_collect img,
.book_detail_comment img {
    width: 30px;
}

.book_detail_introduction_box,
.book_detail_chapters_box {
    margin-top: 40px;
}

.book_detail_introduction_title,
.book_detail_chapters_title {
    border-bottom: 1px solid #808080;
}

.book_detail_introduction_title span,
.book_detail_chapters_title span {
    line-height: 60px;
    font-weight: 600;
    font-size: 24px;
}

.book_detail_introduction_content {
    margin: 0;
    text-indent: 50px
}

.book_detail_introduction_content span {
    font-size: 18px;
    line-height: 50px;
}

.book_detail_chapters_content {
    list-style: none;
}

.book_detail_chapters_content li {
    width: calc(100% - 10px);
    /* 让每个章节占 50% 宽度 */
    box-sizing: border-box;
    height: 50px;
    border-bottom: 1px solid #c7c5c5;
    font-size: 14px;
    text-indent: 20px;
    line-height: 50px;
    cursor: pointer;
    overflow: hidden;
    /* 隐藏超出的部分 */
    white-space: nowrap;
    /* 不换行 */
    text-overflow: ellipsis;
    /* 用省略号代替溢出内容 */
}


.book_detail_chapters_content li:hover {
    color: #ff0000;
}

.book_detail_chapters_content li span {
    margin-right: 50px;
}

/*评论区*/
.book_detail_comments_box {
    background: linear-gradient(120deg,
            rgba(207, 172, 244, 0.6) 0%,
            rgba(208, 189, 247, 0.6) 20%,
            rgba(172, 218, 244, 0.6) 40%,
            rgba(209, 201, 233, 0.6) 60%,
            rgba(237, 172, 197, 0.6) 80%,
            rgba(255, 153, 153, 0.6) 100%);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 75%;
    margin: 0 auto;
    margin-top: 30px;
}

.book_detail_comments_title {
    font-size: 18px;
    font-weight: bold;
    color: #4a4a4a;
    margin-bottom: 20px;
}

.book_detail_comments_titleh {
    display: flex;
}

.book_detail_comments_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.book_detail_comments_content {
    text-align: center;
    /* 让子元素（如 textarea）居中 */
}

.book_detail_comments_content textarea {
    width: 91%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: none;
    font-size: 16px;
    color: #7a7373;
    background: rgba(255, 255, 255, 0.4);
    box-sizing: border-box;
    display: block;
    /* 让 margin: auto 生效 */
    margin: 0 auto;
    /* 水平居中 */
}


.book_detail_comments_content button {
    align-self: flex-end;
    padding: 10px 15px;
    background-color: #f25d8e;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 41px;
}

.book_detail_comments_content button:hover {
    background-color: #e32967;
}

.book_detail_comments_list {
    margin-top: 30px;
}

.book_detail_comments_list {
    max-width: 800px;
    margin: 20px auto;
    padding: 10px;
    background: #f9f9f9;
    /* 浅色模式背景 */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(126, 125, 125, 0.1);
}

.comment_item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    transition: background 0.3s;
}

.comment_item:last-child {
    border-bottom: none;
}

.comment_item:hover {
    background: rgba(0, 0, 0, 0.05);
}

/* 评论内容 */
.comment_content {
    flex: 1;
    background: rgb(244, 220, 220);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    margin: 10px 0;
}

/* 用户名 */
.comment_user {
    font-weight: bold;
    color: #0077ff;
    /* 用户名的颜色 */
    margin-bottom: 5px;
}

/* 评论文字 */
.comment_text {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
}

/* 时间 */
.comment_time {
    font-size: 12px;
    color: gray;
    margin-top: 5px;
    text-align: right;
    margin: 25px 25px;
}

/* 评论项中的段落 */
.comment_item p {
    font-size: 14px;
    color: #333;
    /* 评论文本颜色，覆盖不到用户名 */
    margin: 0;
    margin: 5px 0 20px 25px;

}

/* 强调文本（用户名） */
.comment_item p.comment_user {
    color: #f25d8e;
    /* 确保用户名颜色是蓝色 */
    font-weight: bold;
}


.to_top {
    align-self: flex-end;
    padding: 0 45px 10px 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-left: auto;
}

.to_top:hover {
    color: #e32967;
}
</style>



