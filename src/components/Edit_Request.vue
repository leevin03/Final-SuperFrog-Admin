<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">

      <span class="close" @click="closeModal">&times;</span>
      <h3>Edit Request</h3>

      <div v-if="selectedRequest">
        <p>Request ID: {{ selectedRequest.requestId }}</p>
        <p>Title: {{ selectedRequest.title }}</p>
      </div>

      <label for="phoneNumber">Phone Number:</label>
      <input type="text" id="phoneNumber" v-model="editedRequest.reqPhoneNumber" />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="editedRequest.reqEmail" />

      <label for="eventDate">Event Date:</label>
      <input type="date" id="eventDate" v-model="editedRequest.eventDate" />

      <label for="eventTime">Event Time:</label>
      <input type="time" id="eventTime" v-model="editedRequest.startTime" />

      <label for="status">Status:</label>
      <select id="status" v-model="editedRequest.status">
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="COMPLETED">Completed</option>
        <option value="REJECT">Reject</option>
      </select>

      <!-- <label for="students">Assign Student:</label>
      <select id="students" v-model="selectedStudent">
        <option value="">N/A</option>
        <option v-for="student in students" :key="student.id" :value="student">{{ student.firstName }} {{ student.lastName }}</option>
      </select> -->

      <label for="students">Assign Student:</label>
      <select id="students" v-model="selectedStudent" :disabled="editedRequest.status === 'REJECT'">
        <option value="">N/A</option>
        <option v-for="student in students" :key="student.id" :value="student">
          {{ hasSpecificRequest(student) ? '(Signed)' : '' }} {{ student.firstName }} {{ student.lastName }}
        </option>
      </select>

      <div class="submit-container">
        <div>
          <button @click="saveRequest">Save</button>
          <button @click="cancelRequest">Cancel</button>
        </div>
        <div v-if="errorMessage" class="errorMessage">{{ errorMessage }}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import axios from "axios";

export default {
  props: {
    showModal: Boolean,
    students: Array,
    reqStudents: Array,
    selectedRequest: Object,
  },
  data(){
    return {
      errorMessage: ""
    }
  },
  emits: ["close-modal", "data-updated"],
  setup(props, { emit }) {
    const selectedStudent = ref(null);
    const editedRequest = ref({ ...props.selectedRequest });

    watchEffect(() => {
      if (props.selectedRequest) {
        editedRequest.value = { ...props.selectedRequest };

        const assignedStudent = props.students.find(student => student.id === props.selectedRequest.assignedId);
        selectedStudent.value = assignedStudent ? assignedStudent : null;
      }

    });

    async function saveRequest() {

      this.errorMessage = "Waiting for response..."
      const apiCalls = [];

      if (
        JSON.stringify(props.selectedRequest) !==
        JSON.stringify(editedRequest.value) && editedRequest.value.status !== "REJECT"
      ) {
        let config = {
          method: "put",
          maxBodyLength: Infinity,
          url: "http://localhost:8080/api/v1/appearances/admin/" + editedRequest.value.requestId,
          headers: {
            "Content-Type": "application/json",
          },
          data: editedRequest.value,
        };

        apiCalls.push(axios.request(config));
        // try {
        //   const response = await axios.request(config);
        //   console.log("Updated Data: " + JSON.stringify(response.data));
        //   emit("data-updated");
        //   closeModal();
        // } catch (error) {
        //   console.log(error);
        // }
      }

      if (selectedStudent.value && editedRequest.value.status !== "REJECT") {
        apiCalls.push(assign(selectedStudent.value, editedRequest.value.requestId))
      }else{
        
      }
      
      if(editedRequest.value.status === "APPROVED"){
        apiCalls.push(approve(editedRequest.value.requestId))
      }else if(editedRequest.value.status === "COMPLETED"){
        apiCalls.push(complete(editedRequest.value.requestId))
      }else if (editedRequest.value.status === "REJECT"){
        apiCalls.push(reject(editedRequest.value.requestId))
      }
      

      try {
          const results = await Promise.all(apiCalls);
          console.log("Updated Data: ", results);
          emit("data-updated");
          closeModal();
      } catch (error) {
        console.log(error);
      }

    }

    function assign(stuInfo, reqId){

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/users/assignments/' + stuInfo.id + '/' + reqId,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : stuInfo
      };

      return (axios.request(config))
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    }

    function approve(id){
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/appearances/approval/' + id,
      };

      return (axios.request(config))
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    }

    function complete(id){
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/appearances/complete/' + id,
      }

      return (axios.request(config))
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function reject(id){
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/appearances/rejection/' + id,
        data: {
            "message": ""
        }
    };

    return axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}


    function closeModal() {
      emit("close-modal");
    }

    function cancelRequest() {
      closeModal();
    }

    return {
      selectedStudent,
      saveRequest,
      closeModal,
      cancelRequest,
      editedRequest,
    };
  },
  methods: {
  hasSpecificRequest(student) {
    const specificRequestID = this.selectedRequest.requestId;
    return student.appearanceDtos.some(request => {
      return request.reqID === specificRequestID;
    });
  }
}
};
</script>

<style scoped>
button{
  margin: 5px;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  color: #333;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

label {
  display: block;
  margin-top: 1em;
}

select {
  display: block;
  width: 100%;
  margin-top: 0.5em;
}

button {
  margin-top: 1em;
}

.errorMessage {
  margin-top: 1rem;
  color: green;
  font-weight: bold;
}

.submit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>