import { z } from 'zod';

const applicationTypeZSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    companyId: z.number().int().positive("Company ID must be a positive integer"),
    isActive: z.boolean().default(false)
});

export type ApplicationTypeZSchema = z.infer<typeof applicationTypeZSchema>;
export default applicationTypeZSchema;