
document.querySelector('#signup')
.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    
    try {
        const resp = await axios.post("/api/v1/signup", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
        const msg = document.getElementById("msg")
        msg.innerHTML = "succecfull signup"
    
        console.log("response: ", resp.status)
     
        if (resp.status === 200) {
            window.location.href = "../login/index.html"
        }

    } catch (e) {
       const error = document.getElementById("error")
       error.innerHTML = e
        console.log(e)
    }

})