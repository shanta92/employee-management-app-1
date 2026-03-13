import axios from 'axios';

const BASE = '/api/employees';

export const getEmployees = (department) => {
  const params = department ? { department } : {};
  return axios.get(BASE, { params }).then(r => r.data);
};

export const getEmployee = (id) =>
  axios.get(`${BASE}/${id}`).then(r => r.data);

export const createEmployee = (data) =>
  axios.post(BASE, data).then(r => r.data);

export const updateEmployee = (id, data) =>
  axios.put(`${BASE}/${id}`, data).then(r => r.data);

export const deleteEmployee = (id) =>
  axios.delete(`${BASE}/${id}`);
