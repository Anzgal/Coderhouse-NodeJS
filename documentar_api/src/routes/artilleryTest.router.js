import { Router } from "express";

const router = Router();

router.get("/operacionSencilla", (req, res) => {
	let sum = 0;
	for (let i = 0; i < 1000000; i++) {
		sum += i;
	}
	res.send({ sum });
});

router.get("/operacionCompleja", (req, res) => {
	let sum = 0;
	for (let i = 0; i < 5e8; i++) {
		sum += i;
	}

	res.send({ sum });
});

export default router;
