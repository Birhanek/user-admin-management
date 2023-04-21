import { Request, Response } from "express";
import { User } from "../model/users";
import { decryptMessage } from "../helpers/bcryptPassword";

export const adminLogin = async (req:Request, res: Response) =>{
    try {
        
        const {email, password} = req.fields

        const adminUser = await User.findOne({email:email})
        if(!adminUser){
            return res.status(404).json({
                message: 'user with this email does not existed'
            })
        }

        if(adminUser.is_Admin){
            const AdminPassword = await decryptMessage(adminUser.password, password)
            if(!AdminPassword){
                return res.status(400).json({
                    ok: false,
                    message: 'either email or password is incorrect! try again'
                })
            }

            req.session.adminId = adminUser.user_id
            return res.status(200).json({
                ok: true,
                admin: adminUser,
                message: 'login successfully'
            })
        }
        return res.status(401).json({
            ok: false,
            message: 'you have no authority'
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const adminLogout = (req: Request, res: Response) =>{
    try {
        req.session.destroy()
        res.clearCookie('admin_session')

       return res.status(200).json({
            ok:true,
            message: 'logout successfully'
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const getAllUsers = async (req: Request, res:Response) =>{
    try {
        
        const getUser = await User.find({is_Admin: false}).select({email:1,  name:1, phone:1,user_id:1,_id:0,is_verified:true})

        if(!getUser){
            return res.status(404).json({
                ok: false,
                message: 'No users'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'returned all users',
            Users: getUser
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}