import crypto from 'crypto'
const generateOTP =()=>{
  const otp =   crypto.randomInt(1000,10000)
 return  otp.toString()
} 

export default generateOTP