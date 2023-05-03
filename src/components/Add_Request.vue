<template>

  <div class="signup-container">

      <div class="row">

          <h1>Request</h1>

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
        <label for="Event Name">Event Title</label>
        <input type="text" id="EventName" v-model="EventTitle">
      </div>
      <div class="input-container">
        <label for="address">Address</label>
        <input type="text" id="address" v-model="address">
      </div>
    </div>

    <div class="row">
      <div class="input-container">
        <label for="eventDate">Event Date:</label>
      <input type="date" id="eventDate" v-model="EventDate" />
      </div>

      <div class="input-container">
        <label for="appearanceType">*Event Type</label>
        <select id="appearanceType" v-model="appearanceType" required>
          <option value="TCU">TCU</option>
          <option value="NONPROFIT">Public School/Non-Profit</option>
          <option value="PRIVATE">Private/Residential</option>
        </select>
      </div>

    </div>
    
    <div class="row">
      <div class="input-container">
        <div class="form-group-row">
            <label for="startTime">*Start Time</label>
            <input type="time" id="startTime" v-model="startTime" required>
          </div>
      </div>
      <div class="input-container">
        <label for="startTime">*End Time</label>
            <input type="time" id="endTime" v-model="endTime" required>
     </div>
    </div>

    <div class="row">
      <div class="input-container">
        <label for="orgName">Name of Organization</label>
        <input type="text" id="orgName" v-model="orgName">
      </div>
      <div class="input-container">
        <label for="desc">*Event Description</label>
        <textarea id="desc" v-model="desc" required class="description-field"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="input-container">
        <button type="submit" class="submit-button" @click="submitRequest">Submit</button>
      </div>
      <div class="input-container">
        <div v-if="message" class="message">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const apiKey = 'AIzaSyBs-7sheiPvy3j8RW4xihtxOIUUnsmB_Ec';

  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        EventTitle: '',
        address: '',
        EventDate: '',
        appearanceType: '',
        startTime: '',
        endTime: '',
        orgName: '',
        desc: '',
        message: ''
      };
    },
    methods: {
    async submitRequest() {
      this.message = 'Waiting for server...'; 

        let data = JSON.stringify({
          "reqFirstName": this.firstName,
          "reqLastName": this.lastName,
          "reqPhoneNumber": this.phoneNumber,
          "reqEmail": this.email,
          "appearanceType": "PRIVATE",
          "title": this.EventTitle,
          "orgName": this.orgName,
          "address": this.address,
          "mileage": 2.5,
          "eventDate": this.EventDate,
          "startTime": this.startTime,
          "endTime": this.endTime,
          "status": "PENDING",
          "desc": "party",
          "onCampus": false,
          "instructions": "none",
          "expenses": "none",
          "outsideOrg": "none",
          "assignedName":null,
          "assignedId":null,
        });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/appearances',
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.message = "Request added successfully!";
      })
      .catch((error) => {
        console.log(error);
        this.message = "Error adding request";
      });
    },
  },
};
</script>

<style scoped>
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