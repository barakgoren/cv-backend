import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export interface IApplicationType extends SoftDeleteDocument {
    name: string;
    description: string;
    companyId: number;
    isActive: boolean;
    qualifications: string[]; // Array of qualifications required for this application type
    formFields: IFormField[]; // Custom form fields for this application type
}

export enum FieldType {
    Text = 'text',
    Email = 'email',
    Tel = 'tel',
    Textarea = 'textarea',
    Url = 'url',
    Number = 'number',
    File = 'file',
    Date = 'date',
}

export interface IFormField {
    fieldName: string; // The name attribute of the field
    fieldType: FieldType; // The type of the input field
    label: string; // The display label for the field
    required: boolean; // Whether the field is required
    placeholder?: string; // Placeholder text for the field   
}

export interface ApplicationTypeModel extends Model<IApplicationType> {
    findByUid(uid: number): Promise<IApplicationType | null>;
}

const applicationTypeSchema = new Schema<IApplicationType>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
        },
        companyId: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        qualifications: {
            type: [String], // Array of qualifications required for this application type
            default: [],
            required: false, // Qualifications for this application type
        },
        formFields: {
            type: [
                {
                    fieldName: {
                        type: String,
                        required: true, // The name attribute of the field
                    },
                    fieldType: {
                        type: String,
                        enum: Object.values(FieldType), // The type of the input field
                        required: true, // The type of the input field  
                    },
                    label: {
                        type: String,
                        required: true, // The display label for the field
                    },
                    required: {
                        type: Boolean,
                        default: false, // Whether the field is required
                    },
                    placeholder: {
                        type: String,
                        required: false, // Placeholder text for the field
                    }
                }
            ],
            default: [],
            required: false, // Custom form fields for this application type
        }
    },
    {
        timestamps: true
    }
);

applicationTypeSchema.plugin(softDeletePlugin);

const ApplicationType = model<IApplicationType, ApplicationTypeModel>('ApplicationType', applicationTypeSchema);

export default ApplicationType;