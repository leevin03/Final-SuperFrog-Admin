<template>
  <div class="login-container">
    <div class="login-form">
      <img src="https://brand.tcu.edu/wp-content/uploads/2015/12/TCULogo_purple_5X7-01.jpg" alt="Logo" class="logo-image" />
      <form @submit.prevent="submitForm">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
        <div>
          <button type="button" class="user-type-button" @click="login()">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
            try {

                console.log(this.username);
                console.log(this.password);
                const basicAuth = 'Basic ' + btoa(this.username + ':' + this.password);
                console.log(basicAuth);
                const response = await axios.post('http://localhost:8080/api/v1/users/login', {}, {
                    headers: {
                        Authorization: basicAuth
                    }
                });

                console.log(response.data);
                const token = response.data.data.token;
                localStorage.setItem('token',token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const user = response.data.data.userInfo;
                const roles = response.data.data.userInfo.roles;
                console.log("ROLE IS >>> " + user.roles);
                console.log("User info >>> " + user);

                  
                this.$emit('login', roles, user);
                if(roles.includes('SPIRITDIRECTOR')){
                  this.$router.push('/admin/add-student');
                }else{
                  this.$router.push('/admin/edit-profile');
                }



            } catch (error) {
                console.error(error);
                this.errorMessage = error.response.data.message;
            }
        },
  },
};
</script>
<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 100vh;
  background-image: url('https://www.collegiateparent.com/wp-content/uploads/2020/09/Commons.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  width: 400px;
  margin: 0 auto;
  padding: 50px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px #ccc;
  background-color: #ffffff;
}

.logo-image {
  display: block;
  width: 150px;
  margin: 0 auto 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  display: block;
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.user-type-button {
  display: block;
  width: 100%;
  margin: 0 auto;
  padding: 5px 10px;
  background-color: #4d1979;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.user-type-button:hover {
  background-color: #3c146b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}
</style>