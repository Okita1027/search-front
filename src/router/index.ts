import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import PostDetailPage from "../pages/post/DetailPage.vue";
import LoginPage from "../pages/LoginPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: IndexPage,
    meta: {
      title: "聚合搜索平台",
    },
  },
  {
    path: "/:category",
    component: IndexPage,
  },
  {
    path: "/post/detail",
    component: PostDetailPage,
    meta: {
      title: "文章详情",
    },
  },
  {
    path: "/login",
    component: LoginPage,
    meta: {
      title: "用户登录",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
