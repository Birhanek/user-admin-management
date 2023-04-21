import { NextFunction, Request, Response } from "express";

export const isAdminLoggedIn = (req: Request, res: Response, next: NextFunction) =>{

    try {
        console.log(req.session.adminId)
        if(req.session.adminId){
            next()
        }
        else{
            return res.status(400).json({
                message: 'please login'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const isAdminLoggedOut = (req: Request, res: Response, next: NextFunction) =>{

    try {
        if(req.session.adminId){
            return res.status(400).json({
                message: 'please logout first'
            })
            
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}