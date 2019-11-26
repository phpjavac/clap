import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/login.vue";
// import { Message } from "view-design";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: login
  },
  {
    path: "/teacher",
    component: () =>
      import(/* webpackChunkName: "teacher" */ "../views/teacher/index.vue"),
    children: [
      {
        path: "/",
        name: "userlist",
        component: () =>
          import(
            /* webpackChunkName: "teacher" */ "../views/teacher/managingUser/index.vue"
          )
      }
    ]
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if (localStorage.token) {
    if (to.name === "login") {
      if (localStorage.role !== "student") {
        return next({
          path: "/teacher"
        });
      }
    } else {
      return next();
    }
  } else {
    if (to.name !== "login") {
      return next({
        name: "login"
      });
    }
    next();
  }
  // next();
});
export default router;
