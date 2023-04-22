import { Router } from "express";
import session from "express-session"


import { deleteUser, forgotPassword, login, profile, registerUser, resetPassword, updateUser, userLogout, verifyUser } from "../controllers/UsersController";
import { userInputValidation, userLoginValidation } from "../validators/userValidation";
import { dev } from "../config/parameterConfiguration";
import { isLoggedIn, isLoggedOut } from "../middlewares/Auth";
import { upload } from "../helpers/storage";

const userRouter = Router()


userRouter.use(
    session({
    name:'user_session',
    secret: dev.app.session_secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10*6000 }
}))


userRouter.post('/register',upload.single('image'),userInputValidation, registerUser)
userRouter.post('/verify-user', verifyUser)
userRouter.post('/login', userLoginValidation,isLoggedOut, login)
userRouter.get('/profile', isLoggedIn, profile)
userRouter.get('/logout',isLoggedIn, userLogout)
userRouter.delete('/',isLoggedIn,deleteUser)
userRouter.put('/', isLoggedIn,upload.single('image'), updateUser)

// password resetting 
userRouter.post('/forgot-password',userLoginValidation, isLoggedOut, forgotPassword)
userRouter.post('/reset-password',isLoggedOut, resetPassword)


export default userRouter