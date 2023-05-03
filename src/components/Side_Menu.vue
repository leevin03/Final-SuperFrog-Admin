<script>

export default {
  props: {
    roles: {
      type: String,
      required: true,
    },
  },
  mounted() {
    console.log('Roles:', this.roles);
  },
  methods: {
    addNewStudent() {
      this.$router.push('/admin/add-student');
    },
    viewAllStudents() {
      this.$router.push('/admin/view-students');
    },
    addNewRequest() {
      this.$router.push('/admin/add-request');
    },
    viewAllRequests() {
      this.$router.push('/admin/view-requests');
    },
    viewEditProfile(){
      this.$router.push('/admin/edit-profile');
    },
    calendar() {
      // Your logic for showing the calendar
    },
    performance_reports() {
      this.$router.push('/admin/performance-report');
    },
    payment_reports(){
      this.$router.push('/admin/payment-report');
    },
    find_student(){
      this.$router.push('/admin/find-student');
    },
    findRequest(){
      this.$router.push('/admin/find-request');
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
      this.$emit('logout'); // Emit the 'logout' event
    }
  },
  
};
</script>

<template>
  <div class="navbar">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <ul class="nav-list">
      <li v-if="roles.includes('SPIRITDIRECTOR')">
        <p class="tab">--- About Student ---</p>
      </li>

      <li v-if="roles.includes('SPIRITDIRECTOR')" :class="{ active: $route.path === '/admin/add-student' }"><a href="#" @click.prevent="addNewStudent" >Add a New Student</a></li>
      <li v-if="roles.includes('SPIRITDIRECTOR')" :class="{ active: $route.path === '/admin/view-students' }"><a href="#" @click.prevent="viewAllStudents">View All Students</a></li>
      <li  v-if="roles.includes('SPIRITDIRECTOR')"><a href="#" @click.prevent="find_student">Find Student</a></li>

      <li v-if="roles.includes('SPIRITDIRECTOR')">
        <p class="tab">--- About Request ---</p>
      </li>

      <li v-if="roles.includes('SPIRITDIRECTOR')" :class="{ active: $route.path === '/admin/add-request' }">
        <a href="#" @click.prevent="addNewRequest">Add a New Request</a>
      </li> 
      <li><a href="#" @click.prevent="viewAllRequests" :class="{ active: $route.path === '/admin/view-requests' }">View All Requests</a></li>
      <li  v-if="roles.includes('SPIRITDIRECTOR')"><a href="#" @click.prevent="findRequest">Find Request</a></li>
      <!-- <li><a href="#" @click.prevent="calendar">Calendar</a></li> -->
      <li v-if="roles.includes('SPIRITDIRECTOR')" >
        <p class="tab">--- Others ---</p>
      </li>
      <li  v-if="roles.includes('SPIRITDIRECTOR')"><a href="#" @click.prevent="performance_reports">Performance reports</a></li>
      <li  v-if="roles.includes('SPIRITDIRECTOR')"><a href="#" @click.prevent="payment_reports">Payment reports</a></li>
      <li :class="{ active: $route.path === '/admin/edit-profile' }">
        <a href="#" @click.prevent="viewEditProfile">Profile</a></li>
      <li><a href="#" @click.prevent="logout">Logout</a></li>

    </ul>

  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  width: 30%; /* Increase the width to 25% or another value that works for your design */
  min-width: 200px; /* Set a minimum width to ensure the navbar remains usable on smaller screens */
  height: 100vh;
  background-color: #4d1979;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  max-width: 100%;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 1rem;
}

.nav-list a {
  color: white;
  text-decoration: none;
}

.nav-list a:hover {
  text-decoration: underline;
}

.logout-container {
  position: absolute;
  bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

button {
  background-color: #4d1979;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.active{
  color: yellow; /* Change the color of the selected item */
  background-color: #6f42c1;
}

.tab{
  font-weight: bold;
  color: white;
}
</style>