import axios from "axios";

const apiGoTrip = axios.create({
  baseURL: "https://localhost:7070/api/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "*/*"
  },
});

export default apiGoTrip;
