import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

async function sendMail({ email, otp }) {
    try {
        const info = await transporter.sendMail({
            from: `"SkillHatch OTP" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Your OTP for SkillHatch Login',
            html: `<h4>Your OTP is <h2>${otp}</h2></h4><p>It is valid for 5 minutes.</p>`,
        })

        return { success: true, message: 'OTP sent to your email!', info }
    } 
    catch (error) {
        console.error(error)
        return { success: false, message: 'Failed to send OTP!' }
    }
}

export {
    sendMail,
}