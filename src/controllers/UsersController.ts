import { Request, Response } from "express"

export const registerUser = (req:Request,res:Response) => {
    try {
        console.log(req.fields)
        const users= req.files
       console.log(users)

        res.status(201).json({
            message: 'data is created'
        })

    } catch (error) {
        res.status(500).json({
            message:error
        })
    }
}