
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function isUsernameTaken(username:string) {
    const existingUser = await UserModel.findOne({ username ,isVerfied: true});
    return !!existingUser;
}

export async function isEmailTaken(email:string) {
    const existingUser = await UserModel.findOne({ email });
    return existingUser;
}
export async function POST(request: Request) {
    await dbConnect()

    try {

        const { username, email, password } = await request.json()
        const existingUserVerifiedByName = await isUsernameTaken(username)

        if (existingUserVerifiedByName) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
                {
                    status: 400
                }

            )
        }
        const existingUserByEmail = await isEmailTaken(email)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedPassword = await bcrypt.hash(password, 10)
        
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerfied) {

                return Response.json({
                    success: false,
                    message: "User with this email  exists"
                },
                    {
                        status: 400
                    }

                )
            } else {


                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserByEmail.verifyCode = verifyCode;
                await existingUserByEmail.save()
            }
        } else {

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                password: hashedPassword,
                isVerfied: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },
                {
                    status: 500
                }
            )
        }
        return Response.json({
            success: true,
            message: "User registered successfully,Please verify your email"
        },
            {
                status: 201
            }

        )

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            {
                status: 500
            }

        )
    }
}