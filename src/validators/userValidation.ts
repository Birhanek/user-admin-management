import createHttpError, * as createError from "http-errors"

import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../helpers/Response"



export const userInputValidation = async(req:Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password}  = req.body
    const image = req.file
    console.log(image)

    if(!name || !email || !phone || !password) return  errorResponse(res,404,'name, email, phone or password is missed')
   /* {
        return res.status(404).json({
            message: 'name, email, phone or password is missed'
        })
    }*/
    
    if(password.length < 6) return errorResponse(res,400,'minimum password length is 6')
   /* {
        return res.status(400).json({
            message: 'minimum password length is 6'
        })
    }*/
    if(image && image.size > 1024 * 1024 *1) return errorResponse(res,400, 'File too large. It must be less than 1Mb')
    
    next()
}

export const userLoginValidation = async(req:Request, res:Response, next:NextFunction) =>{
    const {email, password} = req.body
    console.log(req.body)
    if(!email || !password){
        return errorResponse(res,404,'Either email or password is missed!')
       // errorResponse(res, 404,'Either email or password is missed!') 
    }
    if(password.length < 6){
        return errorResponse(res,400,' minimum password length is 6')
        //errorResponse(res, 400,' minimum password length is 6')
    }

    next()
}