const signup_form = document.querySelector('#signup_form');
const alert_box = document.querySelector('#alert_box');

signup_form.addEventListener('submit', register);

async function register(event) {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const phone = document.querySelector('#phone').value;
  const password = document.querySelector('#password').value.trim();

  alert_box.textContent = '';

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
    signup_form.reset();
    alert_box.style.color = 'green';
    alert_box.textContent = 'user is successfully registered.';
  } catch (error) {
    alert_box.style.color = 'red';
    if (error.response.data) {
      alert_box.textContent = error.response.data.error;
    } else {
      console.log(error);
      alert_box.textContent = error.message;
    }
  }
}
