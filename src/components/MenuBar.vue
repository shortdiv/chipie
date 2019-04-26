<template>
  <div class="menu">
    <div class="menu-btn" @click="toggleDrawer">
      <span class="menu--close-btn"></span>
    </div>
    <div class="menu--search-bar">
      This is a search
    </div>
    <div v-show="isDrawerOpen" class="menu-drawer"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "MenuBar",
  data() {
    return {
      isDrawerOpen: false
    };
  },
  methods: {
    ...mapActions("bus", ["toggleMenuDrawer"]),
    toggleDrawer() {
      this.toggleMenuDrawer();
      this.isDrawerOpen = !this.isDrawerOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  position: relative;
  top: 0;
  left: 0;
  height: 30px;
  background: #e3313d;
  width: 100%;
  z-index: 1;
  &-btn {
    position: absolute;
    top: 50%;
    padding-left: 10px;
  }
  &--close-btn,
  &--close-btn:before,
  &--close-btn:after {
    cursor: pointer;
    border-radius: 1px;
    height: 3px;
    width: 15px;
    background: white;
    position: absolute;
    display: block;
    content: "";
  }
  &--close-btn {
    &:before {
      top: -5px;
    }
    &:after {
      top: 5px;
    }
  }
}
.menu-drawer {
  position: absolute;
  top: 30px;
  height: 100vh;
  width: 100%;
  z-index: 1000;
  background: green;
}
</style>
