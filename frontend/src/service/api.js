import axios from "axios";

// Axios instance එකක් සාදන්න
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// මෙය අනෙකුත් service files වල පාවිච්චි කිරීමට export කරන්න
export default api;
