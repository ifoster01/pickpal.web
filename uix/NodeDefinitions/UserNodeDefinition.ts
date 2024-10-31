import { defineNode } from "@thinairthings/uix";
import { z } from "zod";

export const UserNodeDefinition = defineNode(
    "User",
    z.object({
        email: z.string().email("Invalid email address"),
        firstName: z
            .string()
            .min(1, "Please enter your first name.")
            .optional(),
        lastName: z.string().min(1, "Please enter your last name.").optional(),
        phoneNumber: z
            .string()
            .min(10, "Please enter a valid phone number.")
            .optional(),
        profilePictureUrl: z.string().optional(),
    })
)
.defineUniqueIndexes(["email"])