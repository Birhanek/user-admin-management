import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../helpers/Response"



export const userInputValidation = async(req:Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password}  = req.body
    const image = req.file?.filename
    console.log(image)

    if(!name || !email || !phone || !password){
        return res.status(404).json({
            message: 'name, email, phone or password is missed'
        })
    }
    
    if(password.length < 6){
        return res.status(400).json({
            message: 'minimum password length is 6'
        })
    }
    
    next()
}

export const userLoginValidation = async(req:Request, res:Response, next:NextFunction) =>{
    const {email, password} = req.body
   console.log(req.body)
    if(!email || !password){
        errorResponse(res, 404,'Either email or password is missed!') 
    }
    if(password.length < 6){
        errorResponse(res, 400,' minimum password length is 6')
    }

    next()
}