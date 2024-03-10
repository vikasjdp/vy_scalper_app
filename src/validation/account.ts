import { BROKER } from "@/lib/constants";
import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }).max(20),
  broker: z.enum(BROKER),
  userId: z
    .string()
    .trim()
    .min(1, { message: "User Id is required." })
    .max(10)
    .toUpperCase(),
  password: z.string().min(1, { message: "Password is required." }),
  totpCode: z.string().min(1, { message: "TOTP Code is required." }),
  key: z.string().trim().min(1, { message: "Key is required." }).max(50),
  secret: z.string().trim().min(1, { message: "Secret key is required." }),
  token: z.string().min(1).optional(),
  tokenExp: z.string().min(1).optional(),
});
