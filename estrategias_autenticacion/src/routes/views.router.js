import { Router } from "express";
import userValidation from "../middlewares/userValidation.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  res.render("chatroom", {});
});

router.get("/products", userValidation, async (req, res) => {
  res.render("products", req.session.userInfo);
});

router.get("/registro", async (req, res) => {
  res.render("registro");
});

router.get("/registroSuccess", async (req, res) => {
  res.render("registroSuccess");
});

router.get("/registroFailed", async (req, res) => {
  res.render("registroFailed");
});

router.get("/loginError", async (req, res) => {
  res.render("loginError");
});

export default router;
