import { Request, Response } from "express"
import * as fs from 'fs'
import * as jwt from "jsonwebtoken"
import { User } from "../model/users"
import { cipherPassword } from "../helpers/bcryptPassword"
import { dev } from "../config/parameterConfiguration"
import { emailData } from "../helpers/IUsers"
import { sendEmail } from "../helpers/email"
import { UuidGenerator } from "../helpers/uuidGenerator"


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
        res.status(500).json({
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