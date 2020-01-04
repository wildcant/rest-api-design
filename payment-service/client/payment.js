const getPreference = async () => {
  const pay = document.getElementById('pay');
  const response = await fetch('http://localhost:3000/preference');
  const preference = await response.json();
  console.log(preference);
  pay.setAttribute('href', preference);
}