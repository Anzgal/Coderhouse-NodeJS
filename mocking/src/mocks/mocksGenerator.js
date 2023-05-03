import { faker } from "@faker-js/faker";

export function userGenerator() {
	const user = {
		first_name: faker.name.firstName(),
		last_name: faker.name.lastName(),
		email: faker.internet.email(),
		age: faker.commerce.price(18, 90, 0),
		password: "123456",
	};
	return user;
}

export function productGenerator() {
	const product = {
		title: faker.commerce.product(),
		description: faker.commerce.productDescription(),
		code: faker.commerce.productName(),
		price: faker.commerce.price(1000, 10000, 0),
		stock: faker.commerce.price(0, 50, 0),
		category: faker.commerce.department(),
		thumbnail: faker.image.technics(800, 800, true),
	};
    console.log("Mock generado: ", product);
	return product;
}
export const PRODUCTS = () => {
    const products = [];
    for (let i = 0; i < 5; i++) {
        const product = productGenerator();
        products.push(product);
    }
    console.log("Mocks generados: ", products)
    return products;
}