/*eslint-disable*/
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// Remove '@babel/polyfill' as it is deprecated and replaced by the above imports
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')


//VALUES

//DELEGATION
if (mapBox){
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents the form from loading other pages.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({name, email}, 'data')
  })

  if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...'
      // console.log("This actually gets clicked")
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings({passwordCurrent, password, passwordConfirm}, 'password')

      document.querySelector('.btn--save-password').textContent = 'Save Password'
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    })