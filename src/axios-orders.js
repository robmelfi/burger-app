import axios from 'axios';

const instance = axios.create({
   baseURL: 'https://react-my-burger-646ee.firebaseio.com/'
});

export default instance;