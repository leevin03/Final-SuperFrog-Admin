<template>
  <div class="user-form">
    <h2>Find User</h2>
    <form>
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="text" id="email" v-model="email" />
        </div>
      </div>

      <button type="button" @click="submitForm">Submit</button>
    </form>

    <div class="response" v-if="response">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Active</th>
            <th>International</th>
            <th>Payment Preference</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedResponse" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>{{ item.firstName }} {{ item.lastName }}</td>
            <td>{{ Array.isArray(item.roles) ? item.roles.join(', ') : item.roles }}</td>
            <td>{{ item.active }}</td>
            <td>{{ item.international }}</td>
            <td>{{ item.paymentPreference }}</td>
            <td>{{ item.address }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="response.length === 0">
        <span id="unsucessfulCase">No Student Found</span>
      </div>
    </div>

    <div class="pagination" v-if="response.length > 0">
      <button @click="changePage(-1)" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      response: '',
      currentPage: 1,
    };
  },
  methods: {
    async submitForm() {
      const url = 'http://localhost:8080/api/v1/users/criteria';
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
      };
      try {
        const response = await axios.post(url, data);
        this.response = response.data.data;
        this.currentPage = 1;
      } catch (error) {
        console.error(error);
        this.response =
          'An error occurred while fetching data. Please try again later.';
      }
    },
    changePage(direction) {
      this.currentPage += direction;
    },
  },
  computed: {
    paginatedResponse() {
      const itemsPerPage = 10;
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return this.response.slice(startIndex, endIndex);
    },
    totalPages() {
      const itemsPerPage = 10;
      return Math.ceil(this.response.length / itemsPerPage);
    },
  },
  created() {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
};

</script>

<style>
.user-form {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: #eaeaea;
  border-radius: 10px;
}

.user-form h2 {
  margin-top: 0;
  text-align: center;
}

.user-form form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.user-form label {
  font-size: 1.2rem;
  margin-top: 20px;
  width: 100%;
}

.user-form input {
  width: 80%;
  padding: 10px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: 1px solid #000000;
}

.user-form button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4d1979;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-form .response {
  margin-top: 20px;
  border: 2px solid #4d1979;
  padding: 20px;
  border-radius: 5px;
  max-width: 100%;
  overflow-x: auto;
}

.user-form pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-x: auto;
}

.user-form table {
  border-collapse: collapse;
  width: 100%;
}

.user-form th,
.user-form td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: left;
}

.user-form th {
  background-color: #d8a7e9;
  font-weight: bold;
}

/* hide password column */
.user-form th:nth-child(5),
.user-form td:nth-child(5) {
  display: none;
}

/* hide empty appearance data */
.user-form .response table td:empty:before {
  content: "-";
}

#unsucessfulCase{
    color: red;
    font-size: 1.1rem;
    font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #4d1979;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
}

.pagination button:disabled {
  background-color: #d8a7e9;
  cursor: not-allowed;
}
</style>