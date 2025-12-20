import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invaild email"),
    password: z.string().min(6, "Password is required"),
})

export const SignUpSchema = z.object({
    first_name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invaild email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })


//private  Chat Schems 

export const PrivateChatSchema = z.object({
    name: z.string().min(1, "Name is required"),
    roomName: z.string().min(1, "Room Name is required")
})

// open chat schema

export const OpenChatSchema = z.object({
    name: z.string().min(1, "Name is required")
})