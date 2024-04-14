import { z } from 'zod';


export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must not be greater than 20 characters")
    .regex(/^[a-zA-Z0-9]{3,16}$/, "Username must not contain special character");


export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "password must be atleast 6 characters" })

})