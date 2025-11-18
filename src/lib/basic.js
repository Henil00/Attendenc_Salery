import axios from 'axios';

const api = axios.create({
  // baseURL: "https://rest.dovesoft.io/",
  //  baseURL: "http://localhost:9092/CpaasRest",
  //  baseURL: "https://cpaasrest.alerts365.in",
  //  baseURL:"http://95.216.43.170:8888/CpaasRest",
  baseURL: "http://localhost:4000/api/",
  // baseURL: "http://127.0.0.5:9092/cpaasrest",

  timeout: 50000,
});


export default api;