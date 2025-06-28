import Application, { ApplicationResponse, IApplication } from "../models/Application";
import { IApplicationType } from "../models/ApplicationType";
import Company from "../models/Company";
import { ApplicationZSchema } from "../schemas/application.schema";
import { ApplicantsCompareResponse } from "../types/AiResponses";
import { fetchLinkPreview } from "../utils/link-preview";
import Logger from "../utils/logger";
import { applicationTypeService } from "./application-type.service";
import { CompanyError, companyService } from "./companyService";
import { fileService } from "./file.service";
import { openaiService } from "./openaiService";



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
    return await serializeApplication(application, { includeLinkPreviews: true });
}

const getApplicationsByCompanyId = async (companyId: number): Promise<any> => {
    const applications = await Application.find({ companyId, active: true });
    Logger.log(`Found ${applications.length} applications for company ID ${companyId}`);
    return Promise.all(applications.map(app => serializeApplication(app, { includeLinkPreviews: false })));
}

const compareApplicants = async (applications: IApplication[], applicationType: IApplicationType): Promise<ApplicantsCompareResponse> => {
    if (!applications || applications.length === 0) {
        throw new Error("No applications provided for comparison");
    }
    if (!applicationType) {
        throw new Error("Application type is required for comparison");
    }

    const position = {
        title: applicationType.name,
        description: applicationType.description || "",
        requirements: applicationType.qualifications || [],
    }
    const keyOfPdfUrl = applications.reduce((acc, app) => {
        const pdfKey = Object.keys(app.customFields || {}).find(key => app.customFields?.[key]?.endsWith('.pdf') || app.customFields?.[key]?.endsWith('.PDF'));
        if (pdfKey) {
            acc = pdfKey;
        }
        return acc;
    }, undefined as string | undefined);
    const applicantsPromises = applications.map(async (app) => {
        const pdfUrl = keyOfPdfUrl ? app.customFields?.[keyOfPdfUrl] : undefined;
        const extractedPdfText = await fileService.extractPdfText(pdfUrl);
        return {
            name: app.fullName,
            cv: extractedPdfText,
        }
    })

    const applicants = await Promise.all(applicantsPromises);
    const filteredApplicants = applicants.filter(applicant => applicant.cv && applicant.cv.trim() !== "");
    const compare = await openaiService.compareApplicants({
        position,
        applicants: filteredApplicants,
    })
    return compare;
}

async function serializeApplication(application: IApplication, options: { includeLinkPreviews?: boolean } = { includeLinkPreviews: true }): Promise<any> {
    const applicationType = application.applicationTypeId ? await applicationTypeService.getApplicationTypeById(application.applicationTypeId) : null;
    const company = application.companyId ? await companyService.getCompany(application.companyId) : null;

    const serialized: any = {
        ...application.toObject(),
        applicationTypeName: applicationType ? applicationType.name : null,
        companyName: company ? company.name : null,
    };

    // Only include link previews if requested (default: true for single application, false for multiple)
    if (options.includeLinkPreviews && application.customFields) {
        serialized.linkPreviews = await Promise.all(
            Object.entries(application.customFields).map(async ([key, value]) => {
                console.log({ key, value });

                if (typeof value === 'string' && value.startsWith('http')) {
                    const preview = await fetchLinkPreview(value);
                    return { key, preview };
                }
                return { key, preview: null };
            })
        );
    }

    return serialized;
}



export const applicationService = {
    postApplication,
    getApplication,
    getApplicationsByCompanyId,
    compareApplicants
};