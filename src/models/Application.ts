import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export interface IApplication extends SoftDeleteDocument {
    firstName: string;
    lastName: string;
    companyId: number
    email: string;
    phone?: string;
    resumeUrl?: string;
}

export interface ApplicationModel extends Model<IApplication> {
    findByUid(uid: number): Promise<IApplication | null>;
}

const applicationSchema = new Schema<IApplication>(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        companyId: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false
        },
        resumeUrl: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.plugin(softDeletePlugin);

const Application: ApplicationModel = model<IApplication, ApplicationModel>('Application', applicationSchema);

export default Application;
