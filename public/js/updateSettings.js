/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/updateMypassword' : '/api/v1/users/updateme';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    });

    // if (res.data.status==='success') {
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated Successful`);
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};
