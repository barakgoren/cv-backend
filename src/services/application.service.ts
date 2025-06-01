import Application, { IApplication } from "../models/Application";
import Company from "../models/Company";
import { ApplicationZSchema } from "../schemas/application.schema";
import { CompanyError } from "./companyService";

const postApplication = async (applicationData: ApplicationZSchema): Promise<IApplication> => {
    const company = await Company.findByUid(applicationData.companyId);
    if (!company) {
        throw new Error(CompanyError.COMPANY_NOT_FOUND);
    }
    const application = new Application(applicationData);
    const app = await application.save();
    return app;
}

export const applicationService = {
    postApplication,
};