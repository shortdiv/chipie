import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import store from "../state/store";

export default [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      authRequired: false
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      beforeResolve(to, from, next) {
        debugger;
        if (store.getters["auth/isLoggedIn"]) {
          debugger;
          next({ name: "home" });
        } else {
          next();
        }
      }
    }
  }
];
