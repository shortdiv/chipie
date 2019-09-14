import firebase from "firebase";
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyBbJ1cL0qa1YO34BxYY7Hemqc1qcTQApfg",
  authDomain: "chipie-8c496.firebaseapp.com",
  databaseURL: "https://chipie-8c496.firebaseio.com",
  projectId: "chipie-8c496",
  storageBucket: "chipie-8c496.appspot.com",
  messagingSenderId: "273055802101"
};

firebase.initializeApp(config);
const db = firebase.firestore();

export const state = {
  chiPieReviews: {}
};

export const mutations = {
  YAY() {
    console.log("yay");
  },
  SET_CHIPIE_REVIEWS(state, value) {
    var t = {};
    value.forEach(val => {
      t[val.id] = val.data();
    });
    state.chiPieReviews = t;
  }
};

export const actions = {
  createRating({ commit }, value) {
    return new Promise((resolve, reject) => {
      var user = db.collection("users").doc(value.id);
      user
        .collection("pizza-places")
        .doc(value.name)
        .set({
          rating: value.rating
        })
        .then(res => {
          commit("YAY");
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateRating({ commit }, value) {
    return new Promise((resolve, reject) => {
      var user = db.collection("users").doc(value.id);
      var docRef = user.collection("pizza-places").doc(value.name);
      docRef
        .update({
          rating: value.rating
        })
        .then(res => {
          commit("YAY");
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  setRatings({ dispatch }, value) {
    return new Promise((resolve, reject) => {
      var user = db.collection("users").doc(value.id);
      var docRef = user.collection("pizza-places").doc(value.name);

      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            resolve("oh yeah");
            dispatch("updateRating", value);
          } else {
            dispatch("createRating", value);
            resolve("emopty");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getRatings({ commit }, value) {
    return new Promise((resolve, reject) => {
      var user = db.collection("users").doc(value);
      user
        .collection("pizza-places")
        .get()
        .then(res => {
          if (res.docs) {
            commit("SET_CHIPIE_REVIEWS", res.docs);
            resolve(res.docs);
          } else {
            resolve("no data liao");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
