import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'hello'
    },
    {
      path: '/hello',
      component: () => import('../components/Hello.vue'),
      children: [
        {
          path: '',
          component: () => import('../components/Home.vue')
        },
        {
          path: 'home',
          component: () => import('../components/Home.vue')
        },
        {
          path: 'typeBook',
          component: () => import('../components/TypeBook.vue')
        },
        {
          path: 'bookshelf',
          component: () => import('../components/Bookshelf.vue')
        },
        {
          path: 'bookDetail/:bid',
          name: 'bookDetail',
          component: () => import('../components/BookDetail.vue')
        },
        {
          path: 'bookList',
          component: () => import('../components/BookList.vue')
        },
        {
          path: 'userInformation',
          component: () => import('../components/UserInformation.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('../components/Login.vue')
    },
    {
      path:'/forgetPasswords',
      component: () => import('../components/ForgetPasswords.vue')
    },
    {
      path: '/readBook',
      component: () => import('../components/ReadBook.vue')
    },
    {
      path:'/manage',
      component:() =>import('../components/admin/manage.vue')
    },
    {
      path:'/chapter',
      component:() =>import('../components/admin/chapter.vue')
    },
    {
      path:'/dele',
      component:() =>import('../components/admin/dele.vue')
    },
    {
      path:'/banner',
      component:() =>import('../components/admin/banner.vue')
    },
    {
      path:'/discuss',
      component:() =>import('../components/admin/discuss.vue')
    },
    {
      path:'/adminlogin',
      component:() =>import('../components/admin/adminlogin.vue')
    },
    {
      path:'/userinfo',
      component:() =>import('../components/admin/userinfo.vue')
    }
  ]
})