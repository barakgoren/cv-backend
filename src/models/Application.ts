import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export interface IApplication extends SoftDeleteDocument {
    fullName: string; // Concatenation of firstName and lastName
    companyId: number; // ID of the company the application is for
    applicationTypeId?: number; // Optional ID for the application type
    customFields?: Record<string, any>; // Custom fields for the application
}

export interface ApplicationResponse extends IApplication {
    applicationTypeName: string | null; // Name of the application type, if applicable
}

export interface ApplicationModel extends Model<IApplication> {
    findByUid(uid: number): Promise<IApplication | null>;
}

const applicationSchema = new Schema<IApplication>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        companyId: {
            type: Number,
            required: true
        },
        applicationTypeId: {
            type: Number,
            required: false,
            default: null
        },
        customFields: {
            type: Schema.Types.Mixed, // Allows for flexible custom fields
            default: {}
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.plugin(softDeletePlugin);

const Application: ApplicationModel = model<IApplication, ApplicationModel>('Application', applicationSchema);

export default Application;
