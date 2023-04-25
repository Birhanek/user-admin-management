

export interface IUser {
    user_id: string,
    name: string,
    email:string,
    phone:string,
    password:string,
    image: string,
    is_banned: boolean,
    is_Admin:boolean,
    createdAt: Date
}

export interface emailData {
    email:string,
    subject:string,
    html: string
}

export type imageType = Express.Multer.File | undefined
