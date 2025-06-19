<template>
    <div class="login_box">
        <div :class="{ container: true, 'panel-active': obj.isSignUp }">
            <!-- 登录 -->
            <div class="container-form container-signin">
                <div action="#" class="form" id="form2">
                    <h2 class="form-title">欢迎登录后台管理</h2>
                    <input type="text" placeholder="账号5-16个字符" class="input" v-model="obj.user.account" />
                    <input type="password" placeholder="密码5-16个字符" class="input" v-model="obj.user.password" />
                    <button type="button" class="btn" @click="login()">登录</button>
                    <a href="#" class="link" @click="goBack()">返回主页</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import axios from "../../hooks/request";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from 'element-plus';

let route = useRoute();
let router = useRouter();


let obj = reactive({
    isSignUp: false,
    user: {
        account: "",
        password: "",
        email: "",
    },
    verificationCode: '',
    thisVerificationCode: ''
});

let login = () => {
    axios
        .post(
            "/user/login",
            {
                account: obj.user.account,
                password: obj.user.password,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
            if (res.data.code === 200) {
                const { token, user } = res.data.data;
                
                // 登录成功，跳转到上一个页面
                goAdmin();
            } else {
                ElMessage.error(res.data.msg);
            }
        })
        .catch((error) => {
            console.error("登录失败:", error);
            ElMessage.error("登录请求失败，请检查网络");
        });
};


let goAdmin = () => {
    router.push("/manage");
}

onMounted(() => { });
</script>

<style scoped>
/* 让登录界面始终居中 */
.login_box {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #ffe1dc, #f6e4e3 25%, #ffffff);
}
/* 登录框的容器 */
.container {
    background: rgba(255, 255, 255, 0.9); /* 轻微透明效果，更现代 */
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    height: 500px;
    max-width: 400px;
    width: 100%;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
}
.container:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}   

/* 登录/注册表单 */
.container-form {
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
    transition: all 0.6s ease-in-out;
}

.container-signup {
    left: 0;
    opacity: 0;
    width: 100%;
    z-index: 1;
}

.form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 100%;
    text-align: center;
    background-color: #e7e7e7;
}

.form-title {
    font-weight: 300;
    margin: 0;
    margin-bottom: 1.25rem;
}
/* 输入框样式 */
.input {
    width: 100%;
    background: #f9f9f9;
    border-radius: 10px;
    padding: 12px 15px;
    margin: 10px 0;
    border: 1px solid #ddd;
    outline: none;
    transition: all 0.3s;
}

.input:focus {
    border-color: #c7c670;
    background: #fff;
    box-shadow: 0 0 10px rgba(199, 198, 112, 0.2);
}
.link {
    color: #333;
    font-size: 0.9rem;
    margin: 1.5rem 0;
    text-decoration: none;
}

/* 按钮样式 */
.btn {
    width: 180px;
    background: linear-gradient(135deg, #c7c670, #a5a54f);
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
}

.btn:hover {
    background: linear-gradient(135deg, #a5a54f, #898934);
    transform: scale(1.05);
}

.btn:active {
    transform: scale(0.98);
}

</style>