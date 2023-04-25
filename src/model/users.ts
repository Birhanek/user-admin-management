import { Schema, model } from "mongoose";

import { IUser } from "../helpers/IUsers";

const userSchema:Schema = new Schema({
    user_id:{
        type: String,
        unique:true,
        required:[true, 'User ID is missed']
    },
    name:{
        type:String,
        minLength:[2,'Name is too short'],
        maxLength:[40,'Name is too long'],
        trim:true,
        required:[true, 'Name is required']
    },
    email:{
        type: String,
        unique: true,
        lowercase:true,
        trim:true,
        validate: {
            validator: (v:string) => {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: `Please enter valid email`
          },
        required: [true, 'Email is required']
    },
    phone:{
        type:String,
        trim:true,
        validate:{
            validator:(v:string) => {
                return /\d{3}-\d{3}-\d{4}/.test(v)
            },
            message:`please enter valid phone number`
        },
        required:[true, 'phone number is required']
    },
    password:{
        type:String,
        minLength:[6,'minimum length of password is 6'],
        maxLength:[100,'maximum length of password is 20'],
        validate:{
            validator:(v:string)=>{
                return  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,100}$/.test(v)
            },
            message:`either digit, lowercase, uppercase or special character is missed`
        },
        required:[true, 'password is required']
    },
    /*image:{
        data:Buffer,
        contentType:String
    },*/
    image:{
        type: String,
        default:'UnitedKingdom.png'
    },
    is_Admin:{
        type:Boolean,
        default:false
    },
    is_banned:{
        type: Boolean,
        default: false
    },
    /*
    is_Verified:{
        type:Boolean,
        default:false
    },*/
    createdAt:{
        type:Date,
        default: Date.now
    }
}) 

export const User = model<IUser>("users",userSchema)
