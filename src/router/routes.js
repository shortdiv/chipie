import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import store from "../state/store";

export default [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      authRequired: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      beforeResolve(to, from, next) {
        if (store.getters["auth/isLoggedIn"]) {
          next({ name: "home" });
        } else {
          next();
        }
      }
    }
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin.vue")
  },
  {
    path: "/access-denied",
    name: "accessdenied",
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/AccessDenied.vue")
  }
];
