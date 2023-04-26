document.addEventListener("DOMContentLoaded", async () => {
	const cartCreation = await fetch("/api/carts", {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	});
	const responseJson = await cartCreation.json();
	const cartId = responseJson.cartId;

	fetch("/api/products")
		.then((res) => res.json())
		.then((response) => {
			const products = response.results.payload;

			products.forEach((product) => {
				let cardDiv = document.createElement("div");
				cardDiv.setAttribute("class", "card");
				cardDiv.setAttribute("style", "width: 25rem;");

				cardDiv.innerHTML = `
<img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
<div class="card-body" style="text-align: center;">
  <h5 class="card-title">${product.title}</h5>
  <p class="card-text">${product.description}</p>
  <a href="#" class="btn btn-primary addToCart" id=${product._id}>Añadir al carrito</a>
</div>
`;

				let myDiv = document.getElementById("card-render");
				myDiv.appendChild(cardDiv);
			});

			let spinner = document.querySelector(".custom-loader");
			spinner.setAttribute("hidden", "hidden");

			let addToCart = document.querySelectorAll(".addToCart");

			addToCart.forEach((button) => {
				const productId = button.id;
				button.addEventListener("click", async (e) => {
					e.preventDefault();
					await fetch(`/api/carts/${cartId}/product/${productId}`, { method: "POST" });
					alert("Producto añadido al carrito");
				});
			});
		})
		.catch((error) => console.log(error));

	let cartLink = document.getElementById("linkToCart");
	cartLink.setAttribute("href", `/api/carts/${cartId}`);
});
