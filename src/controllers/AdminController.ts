import { NextFunction, Request, Response } from "express";
import * as excel from "exceljs"
import createHttpError, * as createError from "http-errors"
import * as jwt from "jsonwebtoken"
import mongoose from "mongoose";

import { User } from "../model/users";
import { decryptMessage } from "../helpers/bcryptPassword";
import { errorResponse, successResponse } from "../helpers/Response";
import { dev } from "../config/parameterConfiguration";



export const adminLogin = async (req:Request, res: Response,next:NextFunction) =>{
    try {
        
        const {email, password} = req.body

        const adminUser = await User.findOne({email:email})
        if(!adminUser){
            throw createHttpError(404, 'user with this email does not existed')
           /* return res.status(404).json({
                message: 'user with this email does not existed'
            })*/
        }

        if(adminUser.is_Admin){
            const isPasswordMatch = await decryptMessage(adminUser.password, password)
            if(!isPasswordMatch)
                throw createHttpError(400,'either email or password is incorrect! try again')
            if(adminUser.is_banned)
                throw createHttpError(204, 'you are banned and contact the authority')
            
            // create a token and generate 
            const token = jwt.sign({id:adminUser.user_id}, String(dev.app.session_secret_key),{
                expiresIn:'5m',
            })

            // token as a response for traversing to another routes of the user session
            // to check whether we have an established cookie or not
            if(req.cookies[`${adminUser.user_id}`]){
                req.cookies[`${adminUser.user_id}`] = ''
            }
            res.cookie(String(adminUser.user_id),token,{
                path:"/",
                expires: new Date(Date.now() + 1000*60*4),
                secure:false,
                sameSite: 'none',
                httpOnly: true
            })
           return successResponse(res, 200,'login successfully',adminUser)
        }
        throw createHttpError(401,'you have no authority')
    } catch (error) {
        next(error)
    }
}

export const adminLogout = (req: Request, res: Response, next: NextFunction) =>{
    try {
        res.cookie(String(req.id),"",{expires: new Date(0),path:"/"})
        if(!(req.headers.cookie)){
            throw createHttpError( 401, 'you did not logout yet')
        }

       return successResponse(res,200,'logout successfully',{})
       
        
    } catch (error) {
        next(error)
    }
}

export const dashboard = async (req: Request, res:Response) =>{
    try {
        
        const getUser = await User.find({is_Admin: false}).select({email:1,  name:1, phone:1,user_id:1,_id:0,is_banned:1})

        if(!getUser){
            return errorResponse(res,404,'No users')
        }

        return successResponse(res,200,'returned all users not admins',getUser)

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const getSingleUserDashboard = async (req:Request,res:Response, next: NextFunction) =>{
    try {
        const {id} = req.params

        const user = await User.findOne({user_id:id}).select({name:1, email:1,phone:1, user_id:1,_id:0,is_admin:1,is_banned:1})
        if(!user){
            throw createHttpError(404,'User with the specific id did not found')
        }
        return successResponse(res,200,'User found successfully',user)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            next(createHttpError(400,'Invalid Id'))
        }
        next(error)
    }
}

export const deleteUserById = async(req:Request, res:Response) => {
    try {
        const {id} = req.params
        const deleteUser = await User.deleteOne({user_id:id})
        if(!deleteUser){
           return errorResponse(res, 404, 'User did not deleted. something got wrong')
        }
        return successResponse(res, 200, 'user deleted successfully', deleteUser)
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const exportToExcelSheet = async (req:Request, res:Response) => {
    try {
        
        // setting up of the work book
        const workBook = new excel.Workbook()
        workBook.creator = `Creator - Birhane Kahsay`
        workBook.lastModifiedBy = `Birhane Kahsay`
        workBook.created = new Date()
        workBook.modified = new Date()
        workBook.properties.date1904 = true
        // set the excel number of sheets and its property
        const WorkSheet = workBook.addWorksheet("Users",{properties:{tabColor:{argb:'2c2c2c'}}, views:[{state: 'frozen', xSplit: 1, ySplit:1}]})
        WorkSheet.columns = [{header:'Name', key:'name'},{header:'Email', key:'email'},{header:'Phone', key:'phone'},
            {header:'Is Banned', key:'is_banned'},{header:'Is Admin', key:'is_admin'},
        ]

        const userData = await User.find({is_Admin:false})

        userData.map(user=>WorkSheet.addRow(user))

        WorkSheet.getRow(1).eachCell((cell) =>{
            cell.font = {italic:true,bold:true} 
        })
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader(
            'Content-Disposition',
            'attachment; filename='+ "users.xlsx"
        )
        return workBook.xlsx.write(res).then(()=>{
          res.status(200).end()
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}