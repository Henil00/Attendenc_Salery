import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';


const axiosInstance = axios.create({
  // baseURL: "https://rest.dovesoft.io/",
  // baseURL: "http://localhost:9092/CpaasRest",
    //  baseURL: "https://cpaasrest.alerts365.in",
  // baseURL: "http://95.216.43.170:8888/CpaasRest",
  baseURL: "http://localhost:4000/api/",
    // baseURL: "http://127.0.0.5:9092/cpaasrest",

  // timeout: 1200000,
});



axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const language = localStorage.getItem('language') || 'en';
    if (token) {  
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = language;
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Something went wrong';

      // if (status === 401 || status === 404) {
      if (status === 401 ) {
        Cookies.remove('token');
        localStorage.clear(); 
        window.location.href = '/login';
        
        return new Promise(() => {});
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server.',
      });
    }

    return Promise.reject(error);
  }
);




export default axiosInstance;