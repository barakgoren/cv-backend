import Application, { ApplicationResponse, IApplication } from "../models/Application";
import Company from "../models/Company";
import { ApplicationZSchema } from "../schemas/application.schema";
import { fetchLinkPreview } from "../utils/link-preview";
import Logger from "../utils/logger";
import { applicationTypeService } from "./application-type.service";
import { CompanyError, companyService } from "./companyService";
import * as cheerio from 'cheerio';



const postApplication = async (applicationData: ApplicationZSchema): Promise<IApplication> => {
    const company = await Company.findByUid(applicationData.companyId);
    if (!company) {
        throw new Error(CompanyError.COMPANY_NOT_FOUND);
    }
    const application = new Application(applicationData);
    const app = await application.save();
    return app;
}

const getApplication = async (applicationId: number): Promise<IApplication | null> => {
    const application = await Application.findByUid(applicationId);
    if (!application) {
        return null; // or throw an error if you prefer
    }
    return await serializeApplication(application);
}

const getApplicationsByCompanyId = async (companyId: number): Promise<any> => {
    const applications = await Application.find({ companyId, active: true });
    Logger.log(`Found ${applications.length} applications for company ID ${companyId}`);
    return Promise.all(applications.map(serializeApplication));
}

async function serializeApplication(application: IApplication): Promise<any> {
    const applicationType = application.applicationTypeId ? await applicationTypeService.getApplicationTypeById(application.applicationTypeId) : null;
    const company = application.companyId ? await companyService.getCompany(application.companyId) : null;
    return {
        ...application.toObject(),
        applicationTypeName: applicationType ? applicationType.name : null,
        companyName: company ? company.name : null,
        linkPreviews: application.customFields ? await Promise.all(
            Object.entries(application.customFields).map(async ([key, value]) => {
                console.log({ key, value });

                if (typeof value === 'string' && value.startsWith('http')) {
                    const preview = await fetchLinkPreview(value);
                    return { key, preview };
                }
                return { key, preview: null };
            })
        ) : []
    };
}



export const applicationService = {
    postApplication,
    getApplication,
    getApplicationsByCompanyId
};