/**
 * @swagger
 * tags:
 *  name: Chat
 *  description: Chat endpoints
 *  /chat:
 *  get:
 *  summary: Returns the chatroom
 *  tags: [Chat]
 *  responses:
 *  200:
 */
import { Router } from "express";
import { __dirname } from "../utils.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("chatroom");
});

export default router;
