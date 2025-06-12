import companySchema, { CompanySchema } from '../schemas/company.schema';
import Company, { CompanyModel, ICompany } from '../models/Company';
import User from '../models/User';
import Logger from '../utils/logger';

export enum CompanyError {
    USERS_NOT_FOUND = 'USERS_NOT_FOUND',
    COMPANY_NOT_FOUND = 'COMPANY_NOT_FOUND',
}

export const createCompany = async (comp: CompanySchema): Promise<ICompany> => {
    // Create the company with a the default "users" field as null if not provided. If its provided, it will override the default.
    const company = new Company({
        users: null,
        ...comp,
    });
    await company.save();
    if (company.users) {
        // Search if all users exist in the database
        const users = await User.findManyByUids(company.users);
        if (users.length !== company.users.length) {
            throw new Error(CompanyError.USERS_NOT_FOUND);
        } else {
            await Promise.all(users.map(async (user) => {
                if (user.companyId) {
                    const alternateCompany = await Company.findByUid(user.companyId);
                    if (!alternateCompany) {
                        return
                    } else {
                        alternateCompany.users = alternateCompany.users?.filter(uid => uid !== user.uid); // Remove user from old company
                        await alternateCompany.save()
                    }
                }
                user.companyId = company.uid; // Set the companyId for each user
                await user.save();
            }));
        }
    }
    return company;
}

const getCompanies = async (): Promise<ICompany[]> => {
    const comps = await Company.find();
    return comps;
};

const getCompany = async (uid: number): Promise<ICompany | null> => {
    const company = await Company.findByUid(uid);
    if (!company) {
        return null;
    }
    return company;
}

const deleteCompany = async (uid: number): Promise<void> => {
    const company = await Company.findByUid(uid);
    if (!company) {
        throw new Error(CompanyError.COMPANY_NOT_FOUND);
    }
    if (company.users && company.users.length > 0) {
        await Promise.all(company.users.map(async (userUid) => {
            const user = await User.findByUid(userUid);
            if (user) {
                user.companyId = null; // Remove the companyId from the user
                await user.save();
            }
        }
        ));
    }
    await company.softDelete();
}

export const companyService = {
    createCompany,
    getCompanies,
    getCompany,
    deleteCompany,
};
