import { Router } from "express";
import ExpressFormidable from "express-formidable";
import session from "express-session"
import { dev } from "../config/parameterConfiguration";

import {  userLoginValidation } from "../validators/userValidation";
import { adminLogin, adminLogout, getAllUsers } from "../controllers/AdminController";
import { isAdminLoggedIn, isAdminLoggedOut } from "../middlewares/adminAuthentication";

const adminRouter = Router()
const formidable = ExpressFormidable()

adminRouter.use(
    session({
    name:'admin_session',
    secret: dev.app.session_secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10*6000 }
}))

adminRouter.post('/login',formidable, userLoginValidation,isAdminLoggedOut, adminLogin )
adminRouter.get('/logout', isAdminLoggedIn,adminLogout)
adminRouter.get('/',isAdminLoggedIn,getAllUsers)



export default adminRouter