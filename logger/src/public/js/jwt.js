const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const boton = document.getElementById("boton");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	fetch("/jwt/login", {
		method: "POST",
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((formData) => {
			console.log(formData);
			window.location.href = "/";
		})
		.catch((error) => {
			console.error(error);
		});
});
