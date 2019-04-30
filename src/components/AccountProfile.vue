<template>
  <div class="account-profile">
    <span class="account-profile--img" @click="toggleLogin"></span>
    <div v-show="isOpen" id="auth--modal">
      <button @click="logout()">
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AccountProfile",
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    ...mapActions("auth", ["attemptLogout"]),
    toggleLogin() {
      this.isOpen = !this.isOpen;
    },
    transferToLoginScreen() {
      this.$router.push(this.$route.query.redirect || "/login");
    },
    logout() {
      this.attemptLogout().then(() => {
        this.transferToLoginScreen();
        console.log("successful logout");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle-login {
  display: block;
  font-weight: 900;
  cursor: pointer;
}
#auth--modal {
  position: absolute;
  width: 100px;
  right: 0;
  top: 59px;
  margin-right: 1em;
  padding: 20px;
  text-align: left;
  background: #fff;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  &:before {
    border: 0.5em solid transparent;
    border-bottom-color: #fff;
    content: "";
    margin-left: -1em;
    position: absolute;
    top: -16px;
    right: 0;
    width: 0;
    height: 0;
  }
}
.account-profile {
  position: fixed;
  height: 30px;
  width: 30px;
  z-index: 10000;
  right: 0;
  padding: 1em;
  &--img {
    display: block;
    background-image: url("../assets/user-avatar.png");
    border-radius: 50%;
    background-size: 32px 32px;
    height: 32px;
    width: 32px;
    cursor: pointer;
  }
}
button {
  position: relative;
  margin: 0 auto;
  display: block;
  right: 0;
  background: none;
  color: black;
  font-size: 1.5em;
  cursor: pointer;
  span {
    font-size: 0.75em;
    position: relative;
    vertical-align: middle;
  }
}
</style>
