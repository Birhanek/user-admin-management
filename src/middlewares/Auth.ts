import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helpers/Response";

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
            errorResponse(res, 400,'please logout first' )  
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}