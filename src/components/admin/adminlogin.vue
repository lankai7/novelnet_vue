<template>
    <div class="login_box">
        <div :class="{ container: true, 'panel-active': obj.isSignUp }">
            <!-- 登录 -->
            <div class="container-form container-signin">
                <div action="#" class="form" id="form2">
                    <h2 class="form-title">欢迎登录后台管理</h2>
                    <input type="text" placeholder="账号5-16个字符" class="input" v-model="obj.user.user_name" />
                    <input type="password" placeholder="密码5-16个字符" class="input" v-model="obj.user.password" />
                    <a href="#" class="link">忘记密码?</a>
                    <button type="button" class="btn" @click="login()">登录</button>
                    <a href="#" class="link" @click="goBack()">返回主页</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "../../hooks/request.js";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import qs from 'qs';
let route = useRoute();
let router = useRouter();
import { ElMessage } from 'element-plus';
//邮箱正则
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let obj = reactive({
    isSignUp: false,
    user: {
        user_name: "",
        password: "",
        email: "",
    },
    verificationCode: '',
    thisVerificationCode: ''
});

let clearUser = () => {
    obj.user = {
        user_name: "",
        password: "",
        email: "",
    };
}

let changeSign = (signInOrUp) => {
    clearUser();
    obj.isSignUp = signInOrUp == "signUp";
};

// 登录方法
let login = () => {
  if (obj.user.user_name ==='admin' && obj.user. password === 'admin'){
    router.push("/manage");
  }else {
    console.log(obj.user.user_name)
    console.log(obj.user. password)
    ElMessage.warning("您无此项权限！")


  }
}



let mailboxVerification = () => {
    if (emailRegex.test(obj.user.email)) {
        alert("正在获取验证码");
        axios.get("/user/mailboxVerification", {
            params: {
                email: obj.user.email
            }
        }).then(res => {
            if (res.data.code == 200) {
                obj.verificationCode = res.data.data;
                console.log(res.data.data);
            } else {
                alert("验证码获取失败！")
            }
        })
    } else {
        alert("邮箱不符合规范！");
    }
}

//注册方法
let enroll = () => {
  if (obj.user.user_name != null && obj.user.password != null && obj.user.email != null) {
    axios.post(
        "http://localhost:8080/user/register",
        qs.stringify(obj.user),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    ).then(res => {
      if (res.data.code === 0) {
        if (confirm("注册成功！是否自动登录？")) {
          login();
        } else {
          changeSign();
        }
      } else if (res.data.code === 1) {
        alert("格式有误请重新输入！");
      } else {
        alert("系统出错！请稍后再试");
      }
    });
  } else {
    alert("用户名和密码不能为空");
  }
}
let goBack = () => {
    router.push("/hello");
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