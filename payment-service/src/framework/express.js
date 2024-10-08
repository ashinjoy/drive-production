import express from "express";
// import http from 'http'
import cookieParser from "cookie-parser";
// import paymentRouter from "../interface/routes/paymentRoute.js";
import userRouter from "../interface/routes/userRoute.js";
import driverRouter from "../interface/routes/driverRoutes.js";
import adminRouter from '../interface/routes/adminRoutes.js'




const createServer = () => {
  const app = express();
  
  app.use(cookieParser())
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // app.get('/api/payment/health',(req,res)=>{
  //   console.log("hello health");
    
  // })
  // app.use('/api/payment/user/',paymentRouter)
  // app.use('/api/payment',paymentRouter)
    app.use('/payment/user',userRouter)
    app.use('/payment/driver',driverRouter)
    app.use('/payment/admin',adminRouter)
  // app.use('/payment',paymentRouter)



  return app
};

export { createServer };