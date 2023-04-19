import { Router } from "express";
import ExpressFormidable from "express-formidable";
import { registerUser, verifyUser } from "../controllers/UsersController";
import { userValidation } from "../validators/userValidation";

const router = Router()
const formidable = ExpressFormidable()
router.post('/register', formidable ,userValidation, registerUser)
router.post('/verify-user', verifyUser)

export default router