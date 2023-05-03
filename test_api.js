const apiUrl = 'http://localhost:8080/api/v1/users/1';

async function fetchStudents() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const students = await response.json();
    console.log(students);
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

fetchStudents();