

export interface IUser {
    user_id: string,
    name: string,
    email:string,
    phone:string,
    password:string,
    image:{
        data: Buffer,
        contentType: string
    },
    is_Verified: boolean,
    is_Admin:boolean,
    createdAt: Date
}

export interface emailData {
    email:string,
    subject:string,
    html: string
}

export type ImageProp ={
    image:File
}