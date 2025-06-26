import { z } from 'zod';

const applicationZSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    companyId: z.number().int().positive("Company ID must be a positive integer"),
    applicationTypeId: z.number().int().optional(),
    customFields: z.record(z.any()).optional(),
});

export type ApplicationZSchema = z.infer<typeof applicationZSchema>;
export default applicationZSchema;