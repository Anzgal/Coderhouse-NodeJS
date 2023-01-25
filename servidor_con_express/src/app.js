import express from 'express';
import {ProductManager} from './ProductManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager1 = new ProductManager('./data/Products.json');

app.get('/products', (req, res) => {
    let products = productManager1.getProducts();
    if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
        products = products.slice(0, parseInt(req.query.limit));
    }
    return res.json({products});
});


app.get('/products/:pid', (req, res) => {

    if (req.params.pid && !isNaN(parseInt(req.params.pid))) {
        const product = productManager1.getProductById(parseInt(req.params.pid));
        return res.json(product);
    }
    else {
        return res.status(400).json({ error: 'Insert a valid numeric id!' });
    }

});

app.get('/saludo', (req, res)=>{
    res.send("Hola a todos, pero ahora desde express");
})

app.get('/unparametro/:nombre', (req, res)=>{
    res.send(`Hola a: ${req.params.nombre}`);
})

app.get('/dosparametro/:nombre/:apellido', (req, res)=>{
    res.send(`Nombre completo: ${req.params.nombre} ${req.params.apellido}`);
})

app.listen(8080, ()=>console.log("Servidor arriba en el puerto 8080!"));