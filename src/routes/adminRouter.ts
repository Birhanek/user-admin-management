import { Router } from "express";
import session from "express-session"
import { dev } from "../config/parameterConfiguration";

import {  userLoginValidation } from "../validators/userValidation";
import { adminLogin, adminLogout, dashboard, deleteUserById, exportToExcelSheet, getSingleUserDashboard } from "../controllers/AdminController";
import { isAdmin, isAdminLoggedIn, isAdminLoggedOut } from "../middlewares/adminAuthentication";

const adminRouter = Router()

/*
adminRouter.use(
    session({
    name:'admin_session',
    secret: dev.app.session_secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10*6000 }
}))*/
adminRouter.get('/dashboard/users-excel',exportToExcelSheet)
adminRouter.post('/login', userLoginValidation,isAdminLoggedOut, adminLogin )
adminRouter.get('/logout', isAdminLoggedIn,adminLogout)
adminRouter.get('/dashboard',isAdminLoggedIn,isAdmin,dashboard)
adminRouter.get('/dashboard/:id',isAdminLoggedIn,isAdmin,getSingleUserDashboard)
adminRouter.delete('/:id', isAdminLoggedIn,isAdmin,deleteUserById)



export default adminRouter