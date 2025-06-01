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
            required: true
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

const Company: CompanyModel = model<ICompany, CompanyModel>('Company', companySchema);

export default Company;
