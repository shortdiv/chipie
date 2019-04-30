import GoTrue from "gotrue-js";
import axios from "axios";

const auth = new GoTrue({
  APIUrl: "https://chipie.netlify.com/.netlify/identity",
  audience: "",
  setCookie: false
});

export const state = {
  currentUser: getSavedState("auth.currentUser"),
  loading: false,
  token: null,
  notifications: []
};

export const mutations = {
  SET_CURRENT_USER(state, value) {
    state.currentUser = value;
    saveState("auth.currentUser", value);
  },
  TOGGLE_LOAD(state) {
    state.loading = !state.loading;
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification);
  },
  YAY() {
    console.log("yay");
  },
  REMOVE_NOTIFICATION(state, notification) {
    state.notifications.splice(state.notifications.indexOf(notification), 1);
  }
};

export const getters = {
  isLoggedIn(state) {
    return !!state.currentUser;
  }
};

export const actions = {
  init() {
    localStorage.removeItem("auth.currentUser");
  },
  validate({ commit, state }) {
    if (!state.currentUser) return Promise.resolve(null);
    const user = auth.currentUser();
    commit("SET_CURRENT_USER", user);
    return user;
  },

  attemptLogin({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      dispatch("attemptConfirmation", credentials).then(() => {
        auth
          .login(credentials.email, credentials.password)
          .then(response => {
            dispatch("setCookie", response.token).then(() => {
              debugger;
              localStorage.setItem("nf_jwt", response.token);
              resolve(response);
              commit("SET_CURRENT_USER", response);
            });
          })
          .catch(error => {
            reject(error.json);
          });
      });
    });
  },

  attemptConfirmation({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      if (!credentials.token) {
        resolve();
        return;
      }
      auth
        .confirm(credentials.token)
        .then(response => {
          credentials.token = null;
          dispatch("attemptLogin", credentials);
          console.log(
            "Confirmation email sent",
            JSON.stringify({
              response
            })
          );
          commit("YAY");
          resolve(response);
        })
        .catch(error => {
          reject(error);
          console.log(error);
        });
    });
  },

  attemptSignUp({ commit }, credentials) {
    return new Promise((resolve, reject) => {
      auth
        .signup(credentials.email, credentials.password)
        .then(response => {
          console.log("Confirmation email sent", response);
          commit("TOGGLE_LOAD");
          resolve(response);
        })
        .catch(error => {
          reject(error);
          console.log("It's an error", error);
        });
    });
  },

  attemptLogout({ commit }) {
    return new Promise((resolve, reject) => {
      const user = auth.currentUser();
      debugger;
      user
        .logout()
        .then(response => {
          console.log(response);
          resolve(response);
          commit("SET_CURRENT_USER", null);
        })
        .catch(error => {
          reject(error);
          console.log("Could not log out", error);
        });
    });
  },

  getCookie({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("/.netlify/functions/get-cookie")
        .then(result => {
          if (result.data.decodedToken) {
            commit("SET_TOKEN", result.data.decodedToken);
            resolve(result.data.decodedToken);
          } else {
            reject("NO TOKEN");
            console.log("not working");
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },

  setCookie({ commit }, token) {
    return new Promise((resolve, reject) => {
      axios
        .post("/.netlify/functions/jwt", JSON.stringify({ token: token }))
        .then(res => {
          commit("YAY");
          resolve(res);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  }
};

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state));
}
