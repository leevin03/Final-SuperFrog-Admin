<template>
  <div class="container">
    <div class="date-inputs">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" />

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" />
    </div>

    <button class="download-button" @click="download">Download</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
    };
  },
  methods: {
    async download() {
      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/appearances/excel',
          {
            startDate: this.startDate,
            endDate: this.endDate,
            status: 'COMPLETED',
          },
          { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.date-inputs label {
  margin-bottom: 5px;
}

.date-inputs input {
  margin-bottom: 15px;
}

.download-button {
  background-color: #ae6fd7;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.download-button:hover {
  background-color: #4d1979;
}
</style>
