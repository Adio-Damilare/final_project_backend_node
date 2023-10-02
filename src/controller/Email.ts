import {createTransport} from "nodemailer";
import path from "path";
import dotenv from "dotenv";
dotenv.config()

const transporter=createTransport({
    service:"gmail",
    auth:{
        user:process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})



export const sendMail=async(data:any)=>{
    let mailOptions={
        from:process.env.NODEMAILER_EMAIL,
        to:data.reciever,
        subject:data.subject,
        html:data.message

    }

    let result=await transporter.sendMail(mailOptions).then((_res)=>{
        return true;
    }).catch((_error)=>{
        console.log(_error.message)
        return false;
    })
    return result;
}

// export const Months = ["January","February","March","April","May","June","July","August","September","October","November","December"]