import { z } from 'zod';

const applicationZSchema = z.object({
    firstName: z.string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
    }),
    lastName: z.string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
    }),
    companyId: z.number({
        required_error: 'Company ID is required',
        invalid_type_error: 'Company ID must be a number',
    }),
    email: z.string().email(),
    phone: z.string().optional(),
});

export type ApplicationZSchema = z.infer<typeof applicationZSchema>;
export default applicationZSchema;