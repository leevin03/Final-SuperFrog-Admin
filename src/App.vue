<template>
  <div id="app">
    <login v-if="!loggedIn" @login="onLogin" :key="'login-' + loggedIn" />
    <div class="admin-container" v-if="loggedIn">
      <side-menu :roles="roles" @logout="onLogout" />
      <div class="content-container">
        <router-view :roles="roles" :user="user"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Login from './components/Login.vue';
import SideMenu from './components/Side_Menu.vue';

export default {
  components: {
    Login,
    SideMenu,
  },
  data() {
    return {
      loggedIn: false,
      roles: [],
      user: {},
    };
  },
  methods: {
    onLogin(roles, user) {
      this.loggedIn = true;
      this.roles = roles;
      this.user = user;
    },
    onLogout() {
      this.loggedIn = false;
      this.roles = [];
      this.user = {};
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.admin-container {
  display: flex;
}

.content-container {
  flex: 1;
}
</style>
