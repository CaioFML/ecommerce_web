import axios from 'axios';
import Cookie from 'js-cookie';
import ApiData from '../dtos/ApiData';

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

api.interceptors.response.use(response => {
  if(response.headers['access-token']) {
    const apiData: ApiData = {
      'access-token': response.headers['access-token'],
      client: response.headers.client,
      expiry: response.headers.expiry,
      'token-type': response.headers['token-type'],
      uid: response.headers.uid
    };

    api.defaults.headers = apiData;
    Cookie.set('@api-data', apiData);
  }

  return response;
})

api.interceptors.request.use(request => {
  if(request.url.includes('admin')) {
    const apiData: ApiData = JSON.parse(Cookie.get('@api-data'));
    request.headers = apiData;
  }

  return request;
})

export default api;