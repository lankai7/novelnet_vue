import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "hello",
    },
    {
      path: "/hello",
      component: () => import("../components/Hello.vue"),
      children: [
        { path: "", component: () => import("../components/Home.vue") },
        { path: "home", component: () => import("../components/Home.vue") },
        { path: "typeBook", component: () => import("../components/TypeBook.vue") },
        { path: "bookshelf", component: () => import("../components/Bookshelf.vue"), meta: { needLogin: true }, },
        { path: "bookDetail/:bid", name: "bookDetail", component: () => import("../components/BookDetail.vue") },
        { path: "bookList", component: () => import("../components/BookList.vue") },
        { path: "userInformation", component: () => import("../components/UserInformation.vue"), meta: { needLogin: true }, },
      ],
    },
    { path: "/login", component: () => import("../components/Login.vue") },
    { path: "/forgetPasswords", component: () => import("../components/ForgetPasswords.vue") },
    { path: "/readBook", component: () => import("../components/ReadBook.vue") },

    // 管理员页面
    {
      path: "/manage",
      component: () => import("../components/admin/manage.vue"),
      meta: { requiresAdmin: true }, // 需要管理员权限
    },
    {
      path: "/chapter",
      component: () => import("../components/admin/chapter.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/dele",
      component: () => import("../components/admin/dele.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/banner",
      component: () => import("../components/admin/banner.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/discuss",
      component: () => import("../components/admin/discuss.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/adminlogin",
      component: () => import("../components/admin/adminlogin.vue"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/userinfo",
      component: () => import("../components/admin/userinfo.vue"),
      meta: { requiresAdmin: true },
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token"); // 替换为你的 JWT token
  let isAdmin;
  if (token){
    const base64Url = token.split('.')[1]; // 获取 JWT 的第二部分（payload）
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64Url 转换为标准 Base64
    const decoded = atob(base64); // 解码
    const userInfo = JSON.parse(decoded); // 解析 payload 中的用户信息 // 解析用户信息
    isAdmin = userInfo ? userInfo.isAdmin : 0; // 0: 普通用户, 1: 管理员
  }

  if (!token && to.meta.needLogin || !token && to.meta.requiresAdmin ) {
    alert("请先登录！");
    next("/login"); // 未登录，跳转到登录页
  } 
  else if (to.meta.requiresAdmin && isAdmin !== 1) {
    alert("您没有权限访问该页面！");
    next("/"); // 没有管理员权限，跳转到首页
  } 
  else {
    next(); // 允许访问
  }
});

export default router;
