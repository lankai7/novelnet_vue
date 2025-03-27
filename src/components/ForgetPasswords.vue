<template>
    <div class="forgot_password_box">
        <!-- 视频背景 -->
        <video autoplay muted loop class="background-video">
            <source src="/image/background/background.webm" type="video/webm">
        </video>
        <div class="form" id="form3">
            <h2 class="form-title">找回密码</h2>
            <input type="text" placeholder="账号" class="input" v-model="resetInfo.account" required />
            <input type="text" placeholder="邮箱" class="input" v-model="resetInfo.email" required />
            <div class="verification-section">
                <input type="text" placeholder="验证码" class="input2" v-model="resetInfo.thisVerificationCode" required>
                <button class="btn2" @click="requestVerificationCode()">获取验证码</button>
            </div>
            <input type="password" placeholder="新密码" class="input" v-model="resetInfo.newPassword" required />
            <input type="password" placeholder="确认新密码" class="input" v-model="resetInfo.confirmPassword" required />
            <div class=bool>
            </div>
            <button type="button" class="btn" @click="forgetPassword()">提交</button>
            <button class="link" @click="goBack">返回登录</button>
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

//邮箱正则
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let resetInfo = reactive({
    account: '',
    email: '',
    verificationCode: '',
    thisVerificationCode: '',
    newPassword: '',
    confirmPassword: ''
});

let lastRequestTime = 0;  // 上次请求验证码的时间戳
let verificationStartTime = 0;  // 验证码生成的时间戳
const VERIFICATION_VALID_TIME = 5 * 60 * 1000;  // 验证码有效期：5分钟（5*60*1000 毫秒）

let requestVerificationCode = async () => {
    const now = Date.now();
    if (now - lastRequestTime < 60000) {  // 判断是否超过一分钟 (60000 毫秒)
        ElMessage.warning("请稍后再试，每分钟只能获取一次验证码！");
        return;
    }

    if (emailRegex.test(resetInfo.email)) {
        try {
            ElMessage.success("正在获取验证码");
            const response = await axios.get("/user/mailboxVerification", {
                params: {
                    email: resetInfo.email,
                    index: false,
                }
            });
            if (response.data.code === 200) {
                resetInfo.verificationCode = response.data.data;
                lastRequestTime = now;  // 更新请求时间
                verificationStartTime = now;  // 记录验证码生成的时间戳
                console.log('验证码已发送:', response.data.data);
                ElMessage.success(res.data.msg);
            } else {
                ElMessage.warning(res.data.msg);
            }
        } catch (error) {
            console.error('请求验证码时出错：', error);
        }
    } else {
        ElMessage.error("邮箱不符合规范！");
    }
};

// 找回密码
let forgetPassword = async () => {
    const now = Date.now();

    // 检查验证码是否过期
    if (now - verificationStartTime > VERIFICATION_VALID_TIME) {
        ElMessage.warning("验证码已过期，请重新获取！");
        return;
    }

    // 检查是否填写了所有必填项
    if (!resetInfo.account || !resetInfo.email || !resetInfo.thisVerificationCode ||
        !resetInfo.newPassword || !resetInfo.confirmPassword) {
        ElMessage.warning("请填写所有必填项。");
        return;
    }

    // 检查两次输入的密码是否一致
    if (resetInfo.newPassword !== resetInfo.confirmPassword) {
        ElMessage.warning('两次输入的密码不一致！');
        return;
    }

    // 验证验证码是否正确
    if (!resetInfo.verificationCode || resetInfo.verificationCode !== resetInfo.thisVerificationCode) {
        ElMessage.warning('验证码不正确！');
        return;
    }

    try {
        // 发送请求到后端接口
        const response = await axios.post("/user/retrievePassword", null, {
            params: {
                account: resetInfo.account,
                email: resetInfo.email,
                newPassword: resetInfo.newPassword,
            }
        });

        // 根据返回的状态码判断结果
        if (response.data.code === 200) {
            ElMessage.success('密码重置成功！请返回登录界面。');
            goBack();  // 调用返回登录方法
        } else if (response.data.code === 404) {
            ElMessage.warning(response.data.message || '找回密码失败，请检查账号和邮箱是否正确。');
        } else {
            ElMessage.error("系统出错！请稍后再试。");
        }
    } catch (error) {
        console.error("找回密码时出错：", error);
        ElMessage.error("请求出错，请检查网络连接或稍后再试。");
    }
};



let goBack = async () => {
    await router.push("/login");
};

onMounted(() => { });
</script>





<style scoped>
.forgot_password_box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /*background: url("/image/background/forget.gif") no-repeat center center;
    background-size: cover; /* 或者使用 '100% 100%' 根据需要调整 */

}

.form {
    background-color: rgba(255, 255, 255, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;

}

.form-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #e32967;
}

.input {
    width: 95.5%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.verification-section {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.input2 {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn,
.btn2 {
    background-color: #f25d8e;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn {
    width: 100%;
    height: 50px;
    font-size: 20px;
}

.btn2 {
    width: 30%;
    margin-left: 20px;
}

.btn:hover,
.btn2:hover {
    background-color: #e32967;
}

.link {
    margin-top: 1rem;
    color: #333;
    cursor: pointer;
    border: none;
    background: none;
    display: block;
    margin: 20px auto 0 auto;
}

.link:hover {
    color: #d0316e;
    text-decoration: underline;
}

.bool {
    height: 20px;
}

.forgot_password_box {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    /* 确保视频在最底层 */
}

.form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.85);
    /* 半透明背景 */
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}</style>
