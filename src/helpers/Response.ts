import { Response } from "express";

export const errorResponse = (res:Response, statusCode:number, message:string) => {
    return res.status(statusCode).json({
        ok: false,
        message:message
    })
}

export const successResponse = (res:Response, statusCode: number, message:string, data={}) => {
    return res.status(statusCode).json({
        ok: true,
        message: message,
        data: data
    })
}