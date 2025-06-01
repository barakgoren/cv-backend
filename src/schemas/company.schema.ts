import { z } from 'zod';

const companySchema = z.object({
    name: z.string({
        required_error: "Name is required as 'name'",
        invalid_type_error: "Name must be a string"
    })
        .min(1, "Name is required"),
    users: z.array(z.number()).optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;
export default companySchema;