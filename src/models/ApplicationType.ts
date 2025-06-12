import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export interface IApplicationType extends SoftDeleteDocument {
    name: string;
    description: string;
    companyId: number;
    isActive: boolean;
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
        }
    },
    {
        timestamps: true
    }
);

applicationTypeSchema.plugin(softDeletePlugin);

const ApplicationType = model<IApplicationType, ApplicationTypeModel>('ApplicationType', applicationTypeSchema);

export default ApplicationType;