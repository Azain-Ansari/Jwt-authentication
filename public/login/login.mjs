// message 
function showAlert(message, type) {
 const alertContainer = document.getElementById('alertContainer');

 const alert = document.createElement('div');
 alert.classList.add('alert');
 alert.textContent = message;

 alertContainer.appendChild(alert);

 setTimeout(() => {
   alert.classList.add('hide');
   setTimeout(() => {
     alert.remove();
   }, 4000);
 }, 5000);
}


// Sticky alert   (help from chatgpt so that alert should be responsive)
window.addEventListener('scroll', function () {
const alertContainer = document.getElementById('alertContainer');
const alert = alertContainer.querySelector('.alert');
if (alert) {
 const alertHeight = alert.offsetHeight;
 const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
 const windowHeight = window.innerHeight || document.documentElement.clientHeight;
 const windowBottom = scrollTop + windowHeight;

 if (windowBottom > alertContainer.offsetTop + alertHeight) {
   alert.classList.add('sticky');
 } else {
   alert.classList.remove('sticky');
 }
}
});


document.querySelector('#loginForm')
.addEventListener('submit',  (event) => {
    event.preventDefault();

    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;


let whole = {
  email,
  password
}

axios.post("/api/v1/login",whole )

.then( (response)=>{

console.log(response.data);
const msg = document.getElementById("msg")
msg.innerHTML = "login signup"

setTimeout(() => {
  window.location.href = '/post';
}, 1000); // Wait for 1 seconds before redirecting


})

.catch( (error)=>{
  const error1 = document.getElementById("error")
  error1.innerHTML = error
console.log(error.response.data);

} )


})