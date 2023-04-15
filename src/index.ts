import express, { Application } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { dev } from './config/parameterConfiguration'
import { createDatabaseConnection } from './config/db'
import usersRouter from './routes/usersRoutes'


const app: Application = express()
const PORT = dev.app.serverPort

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/api/users',usersRouter)

app.listen(PORT, async() =>{
    console.log(`The app is running at http://localhost:${PORT}`)
    await createDatabaseConnection()
})

