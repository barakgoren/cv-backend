import mongoose, { model, Model, Schema } from 'mongoose';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export interface ICompany extends SoftDeleteDocument {
    name: string;
    users?: number[];
}

export interface CompanyModel extends Model<ICompany> {
    findByUid(uid: number): Promise<ICompany | null>;
}

const companySchema = new Schema<ICompany>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        users: {
            type: [Number],
            default: null,
            required: false,
        }
    },
    {
        timestamps: true
    }
);

companySchema.plugin(softDeletePlugin);
companySchema.index({ active: 1, name: 1 }, { unique: true }); // Use createIndexes instead of ensureIndex


const Company: CompanyModel = model<ICompany, CompanyModel>('Company', companySchema);

export default Company;
