import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const client = twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, { accountSid: process.env.TWILIO_ACCOUNT_SID })

async function sendOtpSms({ phone, otp }) {
  try {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^0/, '+91')
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanPhone
    })
    return { success: true, message: 'OTP sent successfully', sid: message.sid }
  } 
  catch (error) {
    console.error('\n::: Exception occurred inside sendOtpSms! :::\n', error.message)
    return { success: false, message: 'Failed to send SMS!' }
  }
}

export {
    sendOtpSms,
}
