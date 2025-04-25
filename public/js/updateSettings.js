/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const  updateSettings = async (data, type) => {
  try {
    const url = type === 'password' 
    ? 'http://localhost:3000/api/v1/users/updateMypassword' 
    : 'http://localhost:3000/api/v1/users/updateme';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    })

  // if (res.data.status==='success') {
  if (res.data.status === 'success') {
    // console.log(res.data.status)
    showAlert('success', `${type.toUpperCase()} updated Successful`);
  }
} catch (err) {
  console.log(err.response.data);
  console.log("Code Got here like maddd😓")
  showAlert('error', err.response.data.message);
}};
