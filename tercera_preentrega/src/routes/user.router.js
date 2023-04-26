import { Router } from "express";
import { findUser } from "../controllers/users.controller.js";
import passport from "passport";

const router = Router();

router.get("/", findUser);

router.get(
	"/registroGithub",
	passport.authenticate("github", {
		scope: ["user:email"],
	})
);

router.get("/github", passport.authenticate("github"), (req, res) => {
	req.session.email = req.user.email;
	res.redirect("/products");
});

router.post(
	"/registro",
	passport.authenticate("registro", {
		failureRedirect: "/registroFailed",
		successRedirect: "/registroSuccess",
		passReqToCallBack: true,
	})
);

export default router;
