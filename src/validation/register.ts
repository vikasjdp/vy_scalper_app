import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(1,"Name is required."),
    email: z.string().min(1,"Email is required.").email(),
    password: z.string().min(1,"Password is required."),    
    cpassword: z.string().min(1,"Confrim Password is required.")    
})
.refine((data) => data.password === data.cpassword, {
    message: "Password don't match",
    path: ['cpassword']
})