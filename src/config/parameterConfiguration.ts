import * as dotenv from 'dotenv'

dotenv.config()

export const dev ={
    app:{
        serverPort: process.env.SERVER_PORT || 3002
    },
    db:{
        url:process.env.MONGODB_URL || "mongodb://localhost:27017"
    }
}

