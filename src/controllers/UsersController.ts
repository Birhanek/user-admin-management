import { Request, Response } from "express"
import * as fs from 'fs'
import * as jwt from "jsonwebtoken"
import { User } from "../model/users"
import { cipherPassword } from "../helpers/bcryptPassword"
import { dev } from "../config/parameterConfiguration"
import { emailData } from "../helpers/IUsers"
import { sendEmail } from "../helpers/email"
import { UuidGenerator } from "../helpers/uuidGenerator"
import { decryptMessage } from "../helpers/bcryptPassword"



export const registerUser = async (req:Request,res:Response) => {
    try {
        const {name, email, password, phone} = req.fields
        const {image} = req.files

        const isExist = await User.findOne({email: email})

        if(isExist){
           return res.status(409).json({
                message: `user with ${email} is already exist`
            })
        }

        // generating a hashed password
        const hashPassword = await cipherPassword(password)

        // generating token
        const token:jwt.Jwt = jwt.sign({name, email, phone, hashPassword,image},dev.app.privateKey,{expiresIn:'10m'})

        // sending an email
        const emailData :emailData = {
            email: email,
            subject: "Account verification email",
            html: `
            <h2> Hello ${name}</h2>
            <p> please click  <a href=${dev.app.clientUrl}/api/users/activate/${token}>Activate</a> to activate your account</p>`
        }

        await sendEmail(emailData)


        res.status(201).json({
            message: 'verification message is sent to your email from',
            token
        })

    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}

export const verifyUser = async (req:Request, res:Response) => {
    try {
        const { token } = req.body
        if(!token){
            return res.status(404).json({
                message: 'token is missing'
            })
        }

        // decoding the user
        jwt.verify(token, dev.app.privateKey, async(err, decoded) =>{
             
            if(err){
                return res.status(401).json({
                    message: 'Token is expired!'
                })
            }
            const {name, email, phone, hashPassword,image} = decoded
            console.log(email)
            const foundUser = await User.findOne({email:email})
            if(foundUser){
                return res.status(400).json({
                    message : 'User with the email is already existed'
                })
            }

            const newUser = new User({
                user_id:UuidGenerator(),
                name,
                email,
                phone,
                password: hashPassword,
                is_Verified:true
            })

            // image is optional
            if(image){
                newUser.image.data = fs.readFileSync(image.path)
                newUser.image.contentType = image.type
            }

            // save the user
            const user = await newUser.save()

            if(!user){
                return res.status(400).json({
                    message: 'user is not saved and something wrong happened'
                })
            }
            return res.status(201).json({
                message: 'User created successfully'
            })


          });
    } catch (error) {
        return res.status(500).json({
            message: error
        })
        
    }
}

export const login = async (req:Request, res: Response) => {
    try {
        console.log(req.fields)
        const {email, password} = req.fields
        const foundUser = await User.findOne({email: email})
        if(!foundUser){
            return res.status(404).json({
                message: 'user with this email does not existed. please register'
            })
        }
        const isPasswordMatched = await decryptMessage(foundUser.password, password)
        
        if(!isPasswordMatched){
            return res.status(400).json({
                message: 'either email or password is incorrect! please try again!'
            })
        }

        req.session.userId = foundUser.user_id
        console.log(req.session.userId)
        return res.status(200).json({
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            image: foundUser.image,
            message: 'login successfully'
        })


    } catch (error) {
       return res.status(500).json({
            message:error
        })
    }
}

export const profile = async (req:Request, res: Response) =>{
    try {
        const user = await User.findOne({user_id:req.session.userId},{password:0, _id:0})
        return res.status(200).json({
            ok: true,
            message: 'you are in profile',
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: error
    })
}
}

export const  userLogout = async (req:Request, res: Response) => {
    try {
        req.session.destroy()
        res.clearCookie('user_session')

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

export const deleteUser = async (req:Request, res:Response) => {
    try {
        console.log(req.session.userId)
        const deletedUser = await User.deleteOne({user_id: req.session.userId})
        if(!deletedUser.acknowledged){
            return res.status(404).json({
                message: 'user is not deleted'
            })
        }
        return res.status(200).json({
            ok: true,
            message: 'user deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const updateUser = async (req:Request, res: Response) =>{
    try {
        
        const updateUser = await User.updateOne({user_id: req.session.userId},{...req.fields},{new:true})
        if(!updateUser.acknowledged){
            return res.status(400).json({
                ok: false,
                message: 'user did not updated'
            })
        }

        return res.status(201).json({
            ok:true,
            message: 'user is updated successfully'
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const forgotPassword = async (req:Request, res: Response) => {
    try {

        const {email, password } = req.fields
        const user = await User.findOne({email:email})

        if(!user) return res.status(404).json({message: 'user does not found'})
         // generating a hashed password
         const hashPassword = await cipherPassword(password)

         // generating token
         const token:jwt.Jwt = jwt.sign({ email, hashPassword},dev.app.privateKey,{expiresIn:'10m'})
 
         // sending an email
         const emailData :emailData = {
             email: email,
             subject: "password reset",
             html: `
             <h2> Hello ${user.name}</h2>
             <p> please click  <a href=${dev.app.clientUrl}/api/users/activate/${token}>Reset password </a> to reset the password</p>`
         }
 
         await sendEmail(emailData)
 
 
         res.status(201).json({
             message: 'verification message is sent to your email from',
             token
         })

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}

export const resetPassword = async (req: Request, res: Response) =>{
    try {
        const { token } = req.body
        if(!token){
            return res.status(404).json({
                message: 'token is missing'
            })
        }

        // decoding the user
        jwt.verify(token, dev.app.privateKey, async(err, decoded) =>{
             
            if(err){
                return res.status(401).json({
                    message: 'Token is expired!'
                })
            }
            const { email, hashPassword} = decoded
           
            const resetPassword = await User.updateOne({email:email},{$set:{
                password:hashPassword
            }})
      

            if(!resetPassword){
                return res.status(400).json({
                    message: 'password resetting goes wrong and try again!'
                })
            }
            return res.status(201).json({
                message: 'password reset successfully'
            })


          });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error
        })
    }
}