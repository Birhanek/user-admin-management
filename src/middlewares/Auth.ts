import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) =>{

    try {
        if(req.session.userId){
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

export const isLoggedOut = (req: Request, res: Response, next: NextFunction) =>{

    try {
        if(req.session.userId){
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