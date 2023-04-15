

export interface IUser {
    user_id: string,
    name: string,
    email:string,
    phone:string,
    password:string,
    image:File,
    is_Verified: boolean,
    is_Admin:boolean,
    createdAt: Date
}

export type usersProp ={
    name: string,
    email:string,
    phone:string,
    password:string,
}

export type ImageProp ={
    image:File
}