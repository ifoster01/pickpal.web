import { defineNode } from "@thinairthings/uix";
import { z } from "zod";

export const UserNodeDefinition = defineNode(
    "User",
    z.object({
        email: z.string().email("Invalid email address"),
        phoneNumber: z
            .string()
            .min(10, "Please enter a valid phone number.")
            .optional(),
    })
)
.defineUniqueIndexes(["email"])