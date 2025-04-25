/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const  login = async (email, password) => {
  // console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
    })
  console.log(res.data)
  console.log("Code got here")

  if (res.data.status==='success') {
    // console.log(res.data);
    showAlert('success', 'Logged in successfully');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  }

} catch (err) {
  console.log(err.response.data);
  showAlert('error', 'Login failed. Please check your credentials and try again.');
}
};

export const logout = async () => {
  try {
    const res = await axios ({
      method: 'GET',
      url:  'http://localhost:3000/api/v1/users/logout'
    });
    if (res.data.status = 'success') location.reload(true);
  } catch(err) {
    showAlert('error', 'Error logging out! Try again.');
  }
}