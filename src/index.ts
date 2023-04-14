import express, { Application } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'


const app: Application = express()
const PORT = 3005

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan("dev"))


app.listen(PORT, () =>{
    console.log(`The app is running at http://localhost:${PORT}`)
})

