const productsList = document.getElementById("card-render");
const pagination = document.getElementById("pagination");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");

async function renderProductsList(pageNumber = 1) {
	const response = await fetch(`/api/products?page=${pageNumber}`);
	const responseJSON = await response.json();
	const results = responseJSON.results;
	const products = results.payload;
	const totalPages = results.totalPages;

	let cardHTML = "";
	products.forEach((product) => {
		// Se establece el contenido de la card
		cardHTML += `
        <div class ="card" , style= "width:25rem">
<img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
<div class="card-body" style="text-align: center;">
<h5 class="card-title">${product.title}</h5>
<p class="card-text">${product.description}</p>
<a href="#" class="btn btn-primary addToCart" id=${product._id}>Añadir al carrito</a>
</div>
</div>`;
	});

	productsList.innerHTML = cardHTML;

	pagination.style.display = "flex";

	hideSpinner();
}

let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
	renderProductsList();
});

nextButton.addEventListener("click", () => {
	productsList.innerHTML = "";
	currentPage++;
	renderProductsList(currentPage);
});

prevButton.addEventListener("click", () => {
	productsList.innerHTML = "";
	currentPage--;
	renderProductsList(currentPage);
});
