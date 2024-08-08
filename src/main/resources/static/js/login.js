function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password,
    };

    fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => {
        if (!response.ok) {
            alert('Login / Password Incorrect');
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(response => {
        localStorage.setItem('connectedUser', JSON.stringify(response));
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error('Post Request Error: ', error.message);
    });
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", handleLogin);
