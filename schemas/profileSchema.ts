import { z } from "zod";

export const profileSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters"),
    email: z
        .email("Please enter a valid email address"),
});


// Infer TypeScript type from schema
export type ProfileFormData = z.infer<typeof profileSchema>;
