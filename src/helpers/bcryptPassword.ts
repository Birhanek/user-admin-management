import bcrypt from 'bcrypt'
const saltRounds = 10
export const cipherPassword = async(plainText: string) => {
    try {
       return await bcrypt.hash(plainText, saltRounds)
    } catch (error) {
        console.log(error)
    }
}

export const decryptMessage = async (cipherText: string, plainText: string) => {
    try {
        return await bcrypt.compare(plainText, cipherText)
    } catch (error) {
        console.log(error)
    }
}