
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client =new twilio(accountSid, authToken);

export const sendMobileVerificationCode = async (mobileNumber, messageData) => {
    try {
        const message = await client.messages.create({
            body: messageData,
            from: twilioPhone,
            to: mobileNumber
        });
        console.log(`✅ SMS sent to ${mobileNumber}, SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${mobileNumber}:`, error);
        throw new Error("Failed to send SMS");
    }
};
