<template>
  <div>
    <h1>SuperFrog</h1>
    <table class="student-table">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Active</th>
          <th>Deactivate Account</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id" :class="{ 'disabled-row': !student.active }">
          <td>{{ student.id }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.email }}</td>
          <td>{{ getRolesDisplay(student.roles) }}</td>
          <td>{{ student.active ? 'Yes' : 'No' }}</td>
          <td v-if="showDeactivateButton(student.roles, student.active)">
            <button @click="openDeactivationModal(student.id)" :disabled="!student.active">Deactivate</button>
          </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Reason for deactivation:</h3>
        <input type="text" v-model="deactivationReason" />
        <button @click="confirmDeactivation" :disabled="isDeactivating">{{ isDeactivating ? 'Waiting...' : 'Confirm' }}</button>
        <button @click="cancelDeactivation">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const students = ref([])
    const showModal = ref(false)
    const deactivationReason = ref('')
    const selectedStudentId = ref(null)
    const isDeactivating = ref(false)

    async function fetchStudents() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users')
        students.value = response.data.data
      } catch (error) {
        console.log(error)
      }
    }

    function getRolesDisplay(roles) {
      switch (roles) {
        case 'SPIRITDIRECTOR SUPERFROG':
        case 'SUPERFROG SPIRITDIRECTOR':
          return 'Spirit Director & Super Frog'
        case 'SUPERFROG':
          return 'Super Frog'
        case 'SPIRITDIRECTOR':
          return 'Spirit Director'
        default:
          return roles
      }
    }

    function showDeactivateButton(roles) {
      return !['SUPERFROG SPIRITDIRECTOR', 'SPIRITDIRECTOR SUPERFROG', 'SPIRITDIRECTOR'].includes(roles)
    }

    function openDeactivationModal(studentId) {
      selectedStudentId.value = studentId
      showModal.value = true
    }

    async function confirmDeactivation() {
      try {
        isDeactivating.value = true
        await axios.post(`http://localhost:8080/api/v1/users/inactive/${selectedStudentId.value}`, {
          message: deactivationReason.value,
        })
        const student = students.value.find(s => s.id === selectedStudentId.value)
        if (student) {
          student.active = false
        }
        showModal.value = false
        deactivationReason.value = ''
      } catch (error) {
        console.log(error)
      } finally {
        isDeactivating.value = false
      }
    }

    function cancelDeactivation() {
      showModal.value = false
      deactivationReason.value = ''
    }

    onMounted(fetchStudents)

    return {
      students,
      getRolesDisplay,
      showDeactivateButton,
      openDeactivationModal,
      showModal,
      deactivationReason,
      confirmDeactivation,
      cancelDeactivation,
      isDeactivating,
    }
  },
}
</script>


<style scoped>
.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-left: 60px;
}

.student-table th,
.student-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.student-table th {
  color: white;
}

.student-table thead {
  background-color: #4d1979;
}

.student-table .disabled-row {
  background-color: #f2f2f2;
}

.student-table .disabled-row button {
  background-color: #ccc;
  color: #fff;
  cursor: not-allowed;
}
.modal {
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
  background-color: #fff; /* set background color to solid white */
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.modal-content button {
  margin-top: 10px;
  margin-right: 5px;
}
</style>

