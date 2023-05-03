<template>
  <div class="download-form">
    <div class="download-form">
      <h3>Download Payment Report</h3>
      <div class="form-group">
        <label for="beginDate">Begin Date:</label>
        <input type="date" id="beginDate" v-model="beginDate" />
      </div>

      <div class="form-group">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="endDate" />
      </div>

      <div class="form-group">
        <label for="requestIds">Request IDs:</label>
        <div class="request-id-container">
          <div
            v-for="requestId in requestIds"
            :key="requestId"
            :value="requestId"
            @click="toggleRequestId(requestId)"
            :class="['request-id', { 'selected': selectedRequestIds.includes(requestId) }]"
          >
            {{ requestId }}
          </div>
        </div>
      </div>

      <button class="download-button" @click="download">Download</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <button class="display-button" @click="fetchPaymentForms">Display Payment Forms</button>

    <table v-if="paymentForms.length > 0" class="payment-forms-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Student ID</th>
          <th>Begin Date</th>
          <th>End Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="form in paginatedPaymentForms" :key="form.studentId">
          <td>{{ form.firstName }}</td>
          <td>{{ form.lastName }}</td>
          <td>{{ form.studentId }}</td>
          <td>{{ form.paymentPeriod.beginDate }}</td>
          <td>{{ form.paymentPeriod.endDate }}</td>
          <td>{{ form.amount }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="paymentForms.length > 0" class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ 'active': currentPage === page }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      beginDate: '',
      endDate: '',
      requestIds: [],
      selectedRequestIds: [],
      paymentForms: [],
      currentPage: 1,
      errorMessage: '',
    };
  },
  async created() {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/appearances/criteria', {
        status: 'COMPLETED',
      });

      if (response.data.flag && response.data.code === 200) {
        this.requestIds = response.data.data.map((item) => item.requestId);
      }
    } catch (error) {
      console.error('Error fetching request IDs:', error);
    }
  },
  computed: {
    paginatedPaymentForms() {
      const itemsPerPage = 10;
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return this.paymentForms.slice(startIndex, endIndex);
    },
    totalPages() {
      const itemsPerPage = 10;
      return Math.ceil(this.paymentForms.length / itemsPerPage);
    },
  },
  methods: {
    toggleRequestId(requestId) {
      if (this.selectedRequestIds.includes(requestId)) {
        this.selectedRequestIds = this.selectedRequestIds.filter((id) => id !== requestId);
      } else {
        this.selectedRequestIds.push(requestId);
      }
    },
    async download() {
      if (!this.beginDate || !this.endDate) {
        this.errorMessage = 'Please select both begin and end dates';
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/payment/payment-forms',
          {
            requestIds: this.selectedRequestIds,
            paymentPeriod: {
              beginDate: this.beginDate,
              endDate: this.endDate,
            },
          },
          { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'payment-forms.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading payment forms:', error);
      }
    },
    async fetchPaymentForms() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/payment/payment-forms');

        if (response.data.flag && response.data.code === 200) {
          // Replace null paymentPeriod values with empty string
          const forms = response.data.data.map(form => {
            if (form.paymentPeriod === null) {
              return { ...form, paymentPeriod: { beginDate: '', endDate: '' } };
            }
            return form;
          });
          this.paymentForms = forms;
        }
      } catch (error) {
        console.error('Error fetching payment forms:', error);
      }
    },
    setPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
  .download-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px 100px 20px 100px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    width: 100%;
  }

  label {
    margin-bottom: 5px;
    text-align: center;
  }

  input,
  .request-id-container {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 7px;
  }

  .request-id-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .request-id {
    flex: 1 1 auto;
    padding: 5px;
    background-color: #f8f9fa;
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .request-id:hover {
    background-color: #bd8ad6;
  }

  .request-id.selected {
    background-color: #4d1979;
    color: #fff;
  }

  .download-button {
    padding: 8px 12px;
    background-color: #915cbd;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .download-button:hover {
    background-color: #4d1979;
  }

  .display-button {
    margin-top: 100px;
    padding: 8px 12px;
    background-color: #915cbd;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .display-button:hover {
    background-color: #4d1979;
  }

  .payment-forms-table {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
  }

  .payment-forms-table th,
  .payment-forms-table td {
    border: 2px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  .payment-forms-table th {
    background-color: #dfccea;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .pagination button {
    padding: 5px 10px;
    margin: 0 2px;
    background-color: #915cbd;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .pagination button:hover {
    background-color: #4d1979;
  }

  .pagination button.active {
    background-color: #4d1979;
  }

  .error-message {
    color: red;
    margin-top: 10px;
  }
</style>





