import { emitWarning } from "process";
import { z } from "zod";

export const usernameSchema= z.string()
        .min(2,"Username must be at least of two characters")
        .max(20,"User must not be greater than 20 character")
        .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema=z.object({
    username:usernameSchema,
    email:z.string().email({message:"Email is not valid"}),
    password:z.string().min(6,"Password should be of atleast 6 characters")
});
