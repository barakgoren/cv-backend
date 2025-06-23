import { Request, Response } from "express";
import applicationZSchema from "../schemas/application.schema"
import { BadRequest, InternalServerError, NotFound, Success } from "../utils/errorHandler";
import { applicationService } from "../services/application.service";
import { CompanyError } from "../services/companyService";
import Company from "../models/Company";
import Application, { IApplication, ApplicationModel } from "../models/Application";

export const postApplication = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const companyId = Number(body.companyId)
        if (!companyId || isNaN(companyId)) {
            return BadRequest(res, { message: "companyId is required" })
        }
        const company = await Company.findByUid(companyId)
        if (!company) {
            return NotFound(res, { message: "Company not found" });
        }
        const bodyParsed = {
            ...body,
            companyId: companyId,
            applicationTypeId: body.applicationTypeId ? Number(body.applicationTypeId) : undefined
        }
        const application = new Application(bodyParsed);
        await application.save();
        return Success(res, "Application posted successfully")
    } catch (error: any) {
        return InternalServerError(res, {
            message: error.message || 'An error occurred while posting the application',
            data: null
        });
    }
}

export const getApplication = async (req: Request, res: Response) => {
    try {
        const applicationId = parseInt(req.params.applicationId);
        if (isNaN(applicationId)) {
            return BadRequest(res, {
                message: 'Application ID is required',
                data: null
            });
        }
        const application = await applicationService.getApplication(applicationId);
        if (!application) {
            return BadRequest(res, {
                message: 'Application not found',
                data: null
            });
        }
        Success(res, application);
    } catch (error: any) {
        return InternalServerError(res, {
            message: error.message || 'An error occurred while fetching the application',
            data: null
        });
    }
}

export const getApplicationsByCompanyId = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.companyId);
        if (isNaN(companyId)) {
            return BadRequest(res, {
                message: 'Company ID is required',
                data: null
            });
        }
        const company = await Company.findByUid(companyId);
        if (!company) {
            return NotFound(res, { message: "Company not found" });
        }
        const applications = await applicationService.getApplicationsByCompanyId(companyId);
        Success(res, applications);
    } catch (error: any) {
        return InternalServerError(res, {
            message: error.message || 'An error occurred while fetching the applications',
            data: null
        });
    }
}