import { Request } from "express"
import multer from "multer"
import path from "path"

const fileSize = 1024 * 1024 *3
 const storage = multer.diskStorage({
    destination: function (req: Request, file:Express.Multer.File, cb: Function):void {
      cb(null, path.join(__dirname,'../public/image'))
    },
    filename: function (req: Request, file: Express.Multer.File, cb: Function):void {
      const uniqueSuffix =  file.originalname
      cb(null,  uniqueSuffix)
    }
  })

  export const upload = multer({storage:storage, limits:{fileSize:fileSize}})