/**
 * @swagger
 * tags:
 *   name: Mailer
 *   description: Mailer endpoints
 * /:
 *   get:
 *     summary: Returns the mailer
 *     tags: [Mailer]
 *     responses:
 *       200:
 *         description: The mailer
 *         content:
 *           application/json:
 */
import { Router } from "express";
import { mailController } from "../controllers/messages.controller.js";

const router = Router();

router.get("/", mailController);

export default router;
