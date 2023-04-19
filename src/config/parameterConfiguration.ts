import * as dotenv from 'dotenv'

dotenv.config()

export const dev ={
    app:{
        serverPort: process.env.SERVER_PORT || 3002,
        privateKey: process.env.JWT_PRIVATE_KEY,
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASS,
        clientUrl: process.env.CLIENT_URL
    },
    db:{
        url: process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceDB23"
    }
}

