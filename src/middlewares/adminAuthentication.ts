import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { User } from "../model/users";
import { errorResponse } from "../helpers/Response";
import { dev } from "../config/parameterConfiguration";

export const isAdminLoggedIn = async(req: Request, res: Response, next: NextFunction) =>{

    try {
        //console.log(req.session.adminId)
        if(!req.headers.cookie){
            return errorResponse(res,404,'Please Login')
        }
        const token = req.headers.cookie.split('=')[1]
        await jwt.verify(token, String(dev.app.session_secret_key),async (err:jwt.VerifyErrors|null,decoded:string|jwt.JwtPayload|undefined) =>{
            if(err) return errorResponse(res,403,'Invalid token')
            req.id = decoded.id
            next()
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const isAdminLoggedOut = (req: Request, res: Response, next: NextFunction) =>{

    try {
        if(req.id){
            return res.status(400).json({
                message: 'please logout first'
            })  
        }
        next()
    } catch (error) {
        next(error)
    }
}

export const isAdmin = async(req:Request, res:Response, next:NextFunction) => {
    try {
        if(req.id){
            const id = req.id
            const isAdmin = await User.findOne({user_id:id})
            if(isAdmin?.is_Admin){
                next()
            }
            else
               return errorResponse(res,401,'you are not authorized to access')
        }
    } catch (error) {
       next(error)
    }
}