import { NextFunction, Request, Response } from "express"

export const userInputValidation = async(req:Request, res: Response, next: NextFunction) => {
    const { name, email, phone, password}  = req.fields
    const {image} = req.files
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
    if(image && image.size > 1000000){
        return res.status(404).json({
            message: 'maximum image size is 1Mb'
        })
    }
    next()
}

export const userLoginValidation = async(req:Request, res:Response, next:NextFunction) =>{
    const {email, password} = req.fields
   
    if(!email || !password){
        return res.status(404).json({
            message: 'Either email or password is missed!'
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            message: ' minimum password length is 6'
        })
    }

    next()
}