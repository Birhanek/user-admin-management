import * as nodeMailer from 'nodemailer'
import { dev } from '../config/parameterConfiguration'
import { emailData } from './IUsers'


export const sendEmail = async(emailData:emailData) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth:{
                user: dev.app.user,
                pass: dev.app.pass
            },
            
        })

        const mailOptions = {
            from: dev.app.user,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html
        }

        //sending an email with above options
        await transporter.sendMail(mailOptions,(error:unknown, info:nodeMailer.SentMessageInfo) => {
            
            if(error){
                console.log("__________SMTP_MESSAGE_______")
                console.log(error)
            }
            else
                console.log("Message sent, "+ info.response)
        })
    } catch (error) {
        console.log("Returned error is ,"+ error)
    }
}