<template>
  <div class="signup-container">

    <div class="row">
      <h1>Profile</h1>
    </div>

    <div class="row">
      <div class="input-container">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" v-model="firstName">
      </div>
      <div class="input-container">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" v-model="lastName">
      </div>
    </div>
    <div class="row">
      <div class="input-container">
        <label for="phone-number">Phone Number</label>
        <input type="tel" id="phone-number" v-model="phoneNumber">
      </div>
      <div class="input-container">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email">
      </div>
    </div>
    <div class="row">
      <div class="input-container">
        <label for="physical-address">Physical Address</label>
        <input type="text" id="physical-address" v-model="physicalAddress">
      </div>
      <div class="input-container">
        <label for="password">Password</label>
        <input type="text" id="password" v-model="password">
      </div>
    </div>

    <div class="row">
      <div class="input-container">
        <label for="role">Role:</label>
        <select name="role" id="role" v-model="role">
          <option value="">Select Role</option>
          <option value="SUPERFROG">SUPERFROG</option>
          <option value="SUPERFROG SPIRITDIRECTOR">SUPERFROG SPIRITDIRECTOR</option>
        </select>

      </div>
      <div class="input-container">
        <button type="submit" class="submit-button" @click="submitForm">Submit</button>
        <div v-if="message" class="message">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    props: {
      roles: {
          type: String,
          required: true,
        },
        user: {
          type: Object,
          required: true,
        },
      },
    data() {
      return {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
        email: this.user.email,
        physicalAddress: this.user.address,
        password: this.user.password,
        role: this.user.roles,
        message: ""
      };
    },
    created() {
      console.log("User Roles: ", this.roles);
      console.log("User ID: ", this.user.id);
    },
    methods: {

      async updateStudentData() {
        try {
          console.log("hello")
          const response = await axios.put(`http://localhost:8080/api/v1/students/${this.studentData.id}`, {
            "firstName": this.studentData.firstName,
            "lastName": this.studentData.lastName,
            "phoneNumber": this.studentData.phoneNumber,
            "email": this.studentData.email,
            "physicalAddress": this.studentData.physicalAddress,
            "password": this.studentData.password,
            "roles": this.studentData.role,
          });
          console.log(JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
        }
    },

      async submitForm() {
        this.message = "Waiting for server... Please wait."
        let data = JSON.stringify({
          "email": this.email,
          "phoneNumber": this.phoneNumber,
          "password": this.password,
          "firstName": this.firstName,
          "lastName": this.lastName,
          "roles": this.role,
          "active": true,
          "international": false,
          "address": this.physicalAddress,
          "paymentPreference": "PICKUPCHECK"
        });

        const config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/api/v1/users',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };

        try {
          const response = await axios.request(config);
          console.log(JSON.stringify(response.data));
          this.message = "Profile Updated Successfully";
        } catch (error) {
          console.log(error);
          this.message = "Failed to Update Profile";
        }
      },

        
      },
    };
</script>

<style>
.signup-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-left: 60px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.input-container {
  flex: 1;
  margin-right: 0.5rem;
  margin: 30px;
}

.input-container:last-child {
  margin-right: 0;
  align-self: flex-end;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.message {
margin-top: 1rem;
color: green;
font-weight: bold;
}
</style>