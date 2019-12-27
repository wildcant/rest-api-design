let form = document.getElementById('form');
let email = document.getElementById('email');
let password = document.getElementById('password');
let data = document.getElementById('data');
let btn = document.getElementById('btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = {
    email: email.value,
    password: password.value
  }
  const loginRes = await fetch('http://localhost:3000/customers/login', {
    method: 'POST',
    body: JSON.stringify(user),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const status = await loginRes.json();
  console.log(status);
})

btn.addEventListener('click', async ()  => {
  const response = await fetch('http://localhost:3000/customers', {
    method: 'GET',
    credentials: 'include',
  });
  const customers = await response.json();
  console.log(customers[0].email)
  data.innerHTML = JSON.stringify(customers);
})