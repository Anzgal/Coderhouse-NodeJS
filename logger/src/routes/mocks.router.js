import { Router } from "express";
import { userGenerator, productGenerator, PRODUCTS } from "../mocks/mocksGenerator.js";
import passport from "passport";
import { addOneProduct, addManyProducts } from "../controllers/products.controller.js";
const router = Router();

router.post(
    "/usersTest",
    async (req, res, next) => {
        const user = userGenerator();
        req.body = user;
        next();
    },
    passport.authenticate("registro", {
        failureRedirect: "/registroFailed",
        passReqToCallBack: true,
    }),
    async (req, res) => {
        res.json(req.user);
    }
);

router.post(
	"/mockingproducts",
	(req, res, next) => {
		//const product = productGenerator();
		const products = PRODUCTS(5);
		req.body = products;
		next();
	},
	addManyProducts
);

export default router;
