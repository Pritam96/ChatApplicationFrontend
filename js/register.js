const registrationForm = document.querySelector('#registration-form');
const alertBox = document.querySelector('#alert-box');

registrationForm.addEventListener('submit', register);

async function register(event) {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const phone = document.querySelector('#phone').value;
  const password = document.querySelector('#password').value.trim();

  alertBox.textContent = '';

  try {
    const response = await axios.post(
      'http://localhost:4000/api/v1/auth/register',
      {
        name,
        email,
        phone,
        password,
      }
    );
    registrationForm.reset();
    alertBox.style.color = 'green';
    alertBox.textContent = 'user is successfully registered.';
  } catch (error) {
    alertBox.style.color = 'red';
    if (error.response.data) {
      alertBox.textContent = '* ' + error.response.data.error;
    } else {
      console.log(error);
      alertBox.textContent = '* ' + error.message;
    }
  }
}