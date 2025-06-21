import { z } from 'zod';
import { FieldType } from '../models/ApplicationType';

export const formFieldZSchema = z.object({
    fieldName: z.string().min(1, "Field name is required"),
    fieldType: z.nativeEnum(FieldType, {
        message: "Field type must be one of the predefined types: text, email, tel, textarea, url, number"
    }),
    label: z.string().min(1, "Label is required"),
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
});

const applicationTypeZSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    companyId: z.number().int().positive("Company ID must be a positive integer"),
    isActive: z.boolean().default(false),
    formFields: z.array(formFieldZSchema).optional().default([]),
});


export type FormFieldZSchema = z.infer<typeof formFieldZSchema>;
export type ApplicationTypeZSchema = z.infer<typeof applicationTypeZSchema>;
export default applicationTypeZSchema;