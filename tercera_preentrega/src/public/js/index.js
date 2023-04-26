const socketClient = io();

let formAddProduct = document.getElementById("formulario");
let productsList = document.getElementById("productsList");

const formElements = [...document.getElementsByClassName("form")];

socketClient.on("productsList", (productsListArray) => {
	let listToRender = "";
	productsListArray.forEach((product) => {
		listToRender += `Producto: ${product.title} </br>
        Precio: $${product.price} </br></br> `;
	});
	productsList.innerHTML = listToRender;
});

formAddProduct.addEventListener("submit", (e) => {
	e.preventDefault();

	let producto = {
		title: formElements[0].value,
		description: formElements[1].value,
		code: formElements[2].value,
		price: formElements[3].value,
		status: formElements[4].value,
		stock: formElements[5].value,
		category: formElements[6].value,
		thumbnail: formElements[7].value,
	};

	const options = {
		method: "POST",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
		body: JSON.stringify(producto),
	};

	fetch("/api/products", options)
		.then((response) => {
			if (response.ok) console.log(response.json());
			else throw new Error(response.status);
		})
		.catch((err) => {
			console.error("ERROR: ", err.message);
		});

	socketClient.emit("dataForm", { title: producto.title, price: producto.price });
	socketClient.on("productsList", (productsListArray) => {
		let listToRender = "";

		productsListArray.forEach((product) => {
			listToRender += `Producto: ${product.title} </br>
            Precio: $${product.price} </br></br> `;
		});
		productsList.innerHTML = listToRender;
	});

	formElements.forEach((e) => {
		e.value = "";
	});
});

//formulario DELETE

let formDelete = document.getElementById("deleteForm");
let idDeleteElement = document.getElementById("idProduct");

formDelete.addEventListener("submit", (e) => {
	e.preventDefault();

	let idProductToDelete = idDeleteElement.value;
	let url = "/api/products/" + idProductToDelete;

	const options = {
		method: "DELETE",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	};

	fetch(url, options)
		.then((response) => {
			if (response.ok) console.log(response);
			else throw new Error(response.status);
		})
		.then(() => {
			socketClient.emit("dataDeleted", { id: idProductToDelete });
		})
		.catch((err) => {
			console.error("ERROR: ", err.message);
		});

	socketClient.on("productsListDeleted", (productsListArray) => {
		let listToRender = "";

		productsListArray.forEach((product) => {
			listToRender += `Producto: ${product.title} </br>
                Precio: $${product.price} </br>
                </br> `;
		});

		productsList.innerHTML = listToRender;
	});
});
