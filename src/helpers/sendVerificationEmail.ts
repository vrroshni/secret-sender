import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {


    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Secret Sender | Verification Code ',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            success: true,
            message: "verification Email send successfully"
        }
    } catch (emailError) {
        console.error("Verfication email failed", emailError)
        return {
            success: false,
            message: "Failed to send verification email"
        }

    }


}