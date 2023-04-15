import { Router } from "express";
import ExpressFormidable from "express-formidable";
import { registerUser } from "../controllers/UsersController";

const router = Router()
const formidable = ExpressFormidable()
router.post('/register', formidable ,registerUser)

export default router