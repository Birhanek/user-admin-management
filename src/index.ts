import express, { Application, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { dev } from './config/parameterConfiguration'
import { createDatabaseConnection } from './config/db'
import usersRouter from './routes/usersRoutes'
import adminRouter from './routes/adminRouter'
import * as createError from 'http-errors'



const app: Application = express()
const PORT = dev.app.serverPort

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors({
    origin:'*',
    credentials: true,
}))


app.use('/api/users',usersRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, async() =>{
    console.log(`The app is running at http://localhost:${PORT}`)
    await createDatabaseConnection()
})

app.use((err:createError.HttpError, req:Request,res:Response,next:NextFunction) => {
    res.status(err.status || 500).json({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

