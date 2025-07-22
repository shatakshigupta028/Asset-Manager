import axios from 'axios';

const token = localStorage.getItem("token");

const API = axios.create({
  baseURL: 'http://localhost:5050/api', 
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  export const fetchAssets = async () => {
    const response = await API.get('/assets');
    return response.data;
  };  

export const fetchUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await API.get('/users/me');
  return response.data;
};

export const deleteComplaint = async (id: number) => {
  const response = await API.delete(`/complaints/${id}`);
  return response.data;
};

export const fetchAssignments = async () => {
  const response = await API.get(`/assignments/`);
  return response.data;
};

export const fetchComplaints = async () => {
  const response = await API.get(`/complaints/`);
  return response.data;
};


export default API;
