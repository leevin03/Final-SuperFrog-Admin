<template>
    <div class="signup-container">
      <h1>Event Lookup</h1>
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="input-container">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="formData.title" />
          </div>
        </div>
        
        <div class="row">
          <div class="input-container">
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate" v-model="formData.startDate" />
          </div>
          <div class="input-container">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate" v-model="formData.endDate" />
          </div>
        </div>
  
        <div class="row">
          <div class="input-container">
            <label for="assignedEmail">Assigned Email:</label>
            <input type="text" id="assignedEmail" v-model="formData.assignedEmail" />
          </div>
        </div>
  
        <div class="row">
          <div class="input-container">
            <label for="reqEmail">Requester Email:</label>
            <input type="text" id="reqEmail" v-model="formData.reqEmail" />
          </div>
          <div class="input-container">
            <label for="reqPhoneNumber">Requester Phone Number:</label>
            <input type="text" id="reqPhoneNumber" v-model="formData.reqPhoneNumber" />
          </div>
        </div>
  
        <div class="row">
          <div class="input-container">
            <label for="reqFirstName">Requester First Name:</label>
            <input type="text" id="reqFirstName" v-model="formData.reqFirstName" />
          </div>
          <div class="input-container">
            <label for="reqLastName">Requester Last Name:</label>
            <input type="text" id="reqLastName" v-model="formData.reqLastName" />
          </div>
        </div>
  
        <div class="row">
        <div class="input-container">
            <label for="status">Status:</label>
            <select id="status" v-model="formData.status">
            <option value="">Any Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PAYROLL">Payroll</option>
            </select>
        </div>
        </div>

  
        <div class="row">
          <div class="input-container">
            <button class="submit-button" type="submit">Submit</button>
          </div>
        </div>
      </form>
  
      
      <div v-if="requests.length > 0" class="table-container">
      <table>
        <thead>
        <tr>
          <th style="text-align: center;">Request ID</th>
          <th style="text-align: center;">Requester Name</th>
          <th style="text-align: center;">Event Date</th>
          <th style="text-align: center;">Title</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Assigned <br/>SuperFrog</th>
          <th style="text-align: center;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.requestId">
          <td>{{ request.requestId }}</td>
          <td>{{ request.reqFirstName }} {{ request.reqLastName }}</td>
          <td>{{ request.eventDate }}</td>
          <td>{{ request.title }}</td>
          <td>{{ request.status }}</td>
          <td>{{ request.assignedSuperFrog ? request.assignedSuperFrog : 'N/A' }}</td>
          <td>
            <button @click="editRequest(request)">View Details/Edit</button>
          </td>
        </tr>
      </tbody>
      </table>
    <!-- </div>
    <div v-if="submitted && requests.length === 0" style="color: red">No matching appearances found</div>

    </div> -->

    <div class="pagination">
        <button :disabled="currentPage === 1" @click="previousPage">&laquo;</button>
        <button
          v-for="page in pagesToShow"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >{{ page }}</button>
        <button :disabled="currentPage === lastPage" @click="nextPage">&raquo;</button>
      </div>
    </div>

    <div v-if="submitted && requests.length === 0" style="color: red">No matching appearances found</div>

    <edit-request
    :show-modal="showEditModal"
      :students="students"
      :selected-request="requests[selectedRequestIndex]"
      @close-modal="closeModal"
      @data-updated="fetchRequests"
    ></edit-request>
  </div>
  </template>
  
  
  
  <script>
  import axios from 'axios';
  import EditRequest from "./Edit_Request.vue";
  
  
  export default {
    components: {
      EditRequest,
    },
    data() {
      return {
        formData: {
          title: '',
          startDate: '',
          endDate: '',
          assignedEmail: '',
          reqEmail: '',
          reqPhoneNumber: '',
          reqFirstName: '',
          reqLastName: '',
          status: '',
        },
        appearances: [], // Array to hold the appearances
        submitted: false,
        requests: [],
        showEditModal: false,
        selectedRequestIndex: null,
        students: [],
        currentPage: 1,
        requestsPerPage: 10,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.requests.length / this.requestsPerPage);
      },
      pagesToShow() {
        const pages = [];

        for (let i = 1; i <= this.totalPages; i++) {
          if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
            pages.push(i);
          }
        }

        return pages;
      },
      lastPage() {
        return this.totalPages;
      },
      paginatedRequests() {
        const startIndex = (this.currentPage - 1) * this.requestsPerPage;
        const endIndex = startIndex + this.requestsPerPage;

        return this.requests.slice(startIndex, endIndex);
      },
    },
    methods: {
      async handleSubmit() {
        // Check if at least one input field has a value
        const hasValue = Object.values(this.formData).some(val => val !== '');
        if (!hasValue) {
          alert('Please have at least one input');
          return;
        }

        try {
          let status = this.formData.status;
          if (status === '') {
            // If "Any Status" is selected, set status to null
            status = null;
          }

          const response = await axios.post(
          'http://localhost:8080/api/v1/appearances/criteria',
          {
            ...this.formData,
            status: status,
          }
          );

          console.log(response.data.data);

          this.requests = response.data.data; // Set the array of appearances in data
          this.submitted = true; // Set submitted to true to display message if no matching appearances found
        } catch (error) {
          console.error(error);
        }
      },

      async fetchStudents() {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:8080/api/v1/users",
        };

        try {
          const response = await axios.request(config);
          console.log(JSON.stringify(response.data));
          this.students = response.data.data;
        } catch (error) {
          console.log(error);
        }
      },
      editRequest(request) {
        this.selectedRequestIndex = this.requests.findIndex(
          (req) => req.requestId === request.requestId
        );
        this.fetchStudents();
        this.showEditModal = true;
      },
      closeModal() {
        this.showEditModal = false;
      },

    },
  };
  </script>
  

  <style scoped>
  /* Styles for the table */
 /* Styles for the table */
.table-container {
  margin-top: 20px;
  overflow-x: auto; /* Add horizontal scroll bar to the table container */
}

table {
  border-collapse: collapse;
  width: 100%;
  max-width: 100%; /* Add max-width to the table to prevent it from flowing out of its container */
  white-space: nowrap; /* Prevent text from wrapping in table cells */
}

thead th,
tbody td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}




  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  /* Styles for the form */
  .signup-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: Arial, sans-serif;
  }

  .signup-container h1 {
    font-size: 32px;
    margin: 0;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .input-container {
    flex: 1;
    margin-right: 10px;
  }

  label {
    display: block;
    font-size: 18px;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 5px;
  }

  button {
    background-color: #4caf50;
    color: white;
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #3e8e41;
  }
</style>

<!-- <template></template> -->