export const state = {
  isMenuDrawerOpen: false
};

export const mutations = {
  YAY() {
    console.log("yay");
  }
};

import firebase from "firebase";
require("firebase/firestore");

// const config = {
//   apiKey: `${process.env.VUE_APP_API_KEY}`,
//   authDomain: `${process.env.VUE_APP_PROJECT_ID}.firebaseapp.com`,
//   databaseURL: `https://${process.env.VUE_APP_PROJECT_ID}.firebaseio.com`,
//   projectId: `${process.env.VUE_APP_PROJECT_ID}`,
//   storageBucket: `${process.env.VUE_APP_STORAGE_BUCKET}.appspot.com`,
//   messagingSenderId: `${process.env.VUE_APP_SENDER_ID}`
// };

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

export const actions = {
  createRating({ commit }, value) {
    return new Promise((resolve, reject) => {
      var user = db
        .collection("users")
        .doc("8efdc33b-b196-402f-89f7-791bfea0881f");
      debugger;
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
      var user = db
        .collection("users")
        .doc("8efdc33b-b196-402f-89f7-791bfea0881f");
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
      var user = db
        .collection("users")
        .doc("8efdc33b-b196-402f-89f7-791bfea0881f");
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
  getRatings() {
    return new Promise((resolve, reject) => {
      var user = db
        .collection("users")
        .doc("8efdc33b-b196-402f-89f7-791bfea0881f");
      user
        .collection("pizza-places")
        .get()
        .then(res => {
          if (res.docs) {
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
