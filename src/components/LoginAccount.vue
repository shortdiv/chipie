<template>
  <div class="login-screen">
    <div class="account-login">
      <form @submit.prevent="login()" v-if="isNewUser">
        <label for="">
          <span>Email:</span>
          <input type="text" placeholder="name" v-model="loginCreds.email" />
        </label>
        <label for="">
          <span>Password:</span>
          <input
            type="password"
            placeholder="password"
            v-model="loginCreds.password"
          />
        </label>
        <button type="submit" class="account-button">Login</button>
        <p>
          New to chipie?<span class="toggle-login" @click="toggleLoginMode"
            >Create an account.</span
          >
        </p>
      </form>
      <form @submit.prevent="signup()" v-else>
        <label for="">
          <span>Email:</span>
          <input type="text" placeholder="email" v-model="signupCreds.email" />
        </label>
        <label for="">
          <span>Password:</span>
          <input
            type="password"
            placeholder="password"
            v-model="signupCreds.password"
          />
        </label>
        <button type="submit" class="account-button">Sign Up</button>
        <p>
          Already have a login?<span
            class="toggle-login"
            @click="toggleLoginMode"
            >Return to Login.</span
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "LoginAccount",
  mounted() {},
  data() {
    return {
      isNewUser: true,
      loginCreds: {
        email: null,
        password: null
      },
      signupCreds: {
        email: null,
        password: null
      }
    };
  },
  methods: {
    ...mapActions("auth", ["attemptLogin", "attemptSignUp"]),
    toggleLoginMode() {
      this.isNewUser = !this.isNewUser;
    },
    transferToDashboard() {
      this.$router.push(this.$route.query.redirect || "/");
    },
    login() {
      let token = decodeURIComponent(window.location.search)
        .substring(1)
        .split("confirmation_token=")[1];
      this.attemptLogin({ token, ...this.loginCreds })
        .then(res => {
          this.transferToDashboard();
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    signup() {
      this.attemptSignUp(this.signupCreds)
        .then(() => {
          this.addNotification({
            title: "Sign Up",
            text:
              "You have successfully signed up. Check your email to confirm your account.",
            type: "success"
          });
          console.log("a confirmation email has been sent to you!");
        })
        .catch(err => this.handleUnsuccessfulLogin(err));
    }
  }
};
</script>

<style lang="scss" scoped>
.login-screen {
  margin: 0 auto;
  padding: 40px;
  height: 400px;
  width: calc(100vw - 180px);
  max-width: 600px;
  min-width: 200px;
  background-color: white;
  h2 {
    margin-bottom: 13px;
  }
}
.account-login {
  input[type="text"],
  input[type="password"] {
    border: 2px solid #949494;
    border-radius: 4px;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #0e1e25;
    display: block;
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    line-height: 24px;
    margin: 0;
    margin-bottom: 0.5em;
    padding: 6px 14px;
    width: 100%;
    &:focus {
      border-color: #e2873e;
      outline: none;
    }
  }
  button {
    margin-top: 0.5em;
    font-size: 1.25em;
    background-color: #0f1b20;
    border: none;
    border-radius: 5px;
    color: #fff;
    outline: none;
    padding: 10px 40px;
    width: 100%;
    cursor: pointer;
  }
}
.toggle-login {
  display: block;
  font-weight: 900;
  cursor: pointer;
}
</style>
