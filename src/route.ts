import {createRouter, createWebHashHistory} from "vue-router";
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
  },
  {
    path:'/personal-center',
    name:'PersonalCenter',
    component: () => import('./views/PersonalCenter.vue'),
  },
  {
    path:'/history',
    name:'BookStore',
    component: () => import('./views/ReadingHistory.vue'),
  },
  {
    path:'/book-shelf',
    name:'BookShelf',
    component: () => import('./views/BookShelf.vue'),
  },
  {
    path:'/login',
    name:'Login',
    component: () => import('./views/Login.vue'),
  },
  {
    path:'/register',
    name:'Register',
    component: () => import('./views/Register.vue'),
  },
  {
    path:'/book-detail/:id',
    name:'BookDetail',
    component: () => import('./views/BookInfo.vue'),
  },
  {
    path:'/book-read/:bookId/:contentId',
    name:'BookRead',
    component: () => import('./views/BookRead.vue'),
  },
  {
    path:'/book-search',
    name:'BookSearch',
    component: () => import('./views/BookSearch.vue'),
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
