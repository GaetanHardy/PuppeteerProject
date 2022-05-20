import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:6060/' });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
});

export { api };
