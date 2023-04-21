import express, { Application } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { dev } from './config/parameterConfiguration'
import { createDatabaseConnection } from './config/db'
import usersRouter from './routes/usersRoutes'
import adminRouter from './routes/adminRouter'



const app: Application = express()
const PORT = dev.app.serverPort

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/users',usersRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, async() =>{
    console.log(`The app is running at http://localhost:${PORT}`)
    await createDatabaseConnection()
})

