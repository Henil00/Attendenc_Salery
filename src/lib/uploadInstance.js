import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';


const uploadInstance = axios.create({
  // baseURL: "https://rest.dovesoft.io/",
  baseURL: "https://event.dovesoft.io/",
  // timeout: 1200000,
});



uploadInstance.interceptors.request.use(
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


uploadInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Something went wrong';

      if (status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again.',
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.remove('token'); 
            window.location.href = '/login';
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        });
      }
    } else {
      // Network errors or server is down
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server.',
      });
    }

    return Promise.reject(error);
  }
);




export default uploadInstance;