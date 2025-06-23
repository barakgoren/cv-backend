import { Request, Response } from "express"
import { BadRequest, InternalServerError, NotFound, Success } from "../utils/errorHandler"
import applicationTypeZSchema from "../schemas/application-type.schema";
import { applicationTypeService } from "../services/application-type.service";
import { companyService } from "../services/companyService";
import Logger from "../utils/logger";

export const createApplicationType = async (req: Request, res: Response) => {
    try {
        // Extract companyId and body from request
        const body = req.body
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, { data: null, message: 'User not found in request body', });
        }
        const companyId = user.companyId;

        // Validate companyId parameter and Check if company exists
        const company = await companyService.getCompany(parseInt(companyId));
        if (!companyId || isNaN(parseInt(companyId))) {
            BadRequest(res, { data: null, message: 'Company ID not provided or invalid', });
        }
        if (!company) {
            return NotFound(res, { data: null, message: `Company with ID ${companyId} not found`, });
        }

        // Validate request body against the schema
        const parsedApplicationType = applicationTypeZSchema.safeParse({ ...body, companyId: parseInt(companyId) });
        if (!parsedApplicationType.success) {
            return BadRequest(res, { data: null, message: parsedApplicationType.error.errors[0].message, });
        }

        const applicationTypeData = parsedApplicationType.data;
        const applicationType = await applicationTypeService.createApplicationType(applicationTypeData);
        return Success(res, applicationType);
    } catch (error: any) {
        if (error.message) {
            BadRequest(res, { data: null, message: error.message, })
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while creating the application type', })
    }
}

export const getApplicationTypes = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, { data: null, message: 'User not found in request body', });
        }
        const companyId = user.companyId
        if (!companyId || isNaN(parseInt(companyId))) {
            return BadRequest(res, { data: user, message: 'Company ID not provided or invalid', });
        }
        const company = await companyService.getCompany(parseInt(companyId));
        if (!company) {
            return NotFound(res, {
                data: null, message: `Company with ID ${companyId} not found`,
            });
        }
        const applicationTypes = await applicationTypeService.getApplicationTypes(parseInt(companyId));
        return Success(res, applicationTypes);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, { data: null, message: error.message, });
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while fetching application types', })
    }
}

export const patchApplicationType = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, { data: null, message: 'User not found in request body', });
        }
        const companyId = user.companyId;
        if (!companyId || isNaN(parseInt(companyId))) {
            return BadRequest(res, { data: null, message: 'Company ID not provided or invalid', });
        }
        const company = await companyService.getCompany(parseInt(companyId));
        if (!company) {
            return NotFound(res, { data: null, message: `Company with ID ${companyId} not found`, });
        }

        const applicationTypeId = parseInt(req.params.id);
        if (isNaN(applicationTypeId)) {
            return BadRequest(res, { data: null, message: 'Application type ID is required and must be a number', });
        }

        const updateData = req.body;
        const updatedApplicationType = await applicationTypeService.patchApplicationType(applicationTypeId, updateData);
        return Success(res, updatedApplicationType);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, { data: null, message: error.message, });
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while updating the application type', })
    }
}

export const updateApplicationType = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, { data: null, message: 'User not found in request body', });
        }
        const companyId = user.companyId;
        if (!companyId || isNaN(parseInt(companyId))) {
            return BadRequest(res, { data: null, message: 'Company ID not provided or invalid', });
        }
        const company = await companyService.getCompany(parseInt(companyId));
        if (!company) {
            return NotFound(res, { data: null, message: `Company with ID ${companyId} not found`, });
        }

        const applicationTypeId = parseInt(req.params.id);
        if (isNaN(applicationTypeId)) {
            return BadRequest(res, { data: null, message: 'Application type ID is required and must be a number', });
        }

        const updateData = req.body;
        const updatedApplicationType = await applicationTypeService.updateApplicationType(applicationTypeId, updateData);
        return Success(res, updatedApplicationType);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, { data: null, message: error.message, });
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while updating the application type', });
    }
}

export const getApplicationTypeById = async (req: Request, res: Response) => {
    try {
        Logger.log('Fetching application type by ID:', req.params.id);
        // Gets the attraction type ID from the request parameters
        const applicationTypeId = parseInt(req.params.id);
        if (isNaN(applicationTypeId)) {
            return BadRequest(res, { data: null, message: 'Application type ID is required and must be a number', });
        }
        // Fetches the application type by ID
        const applicationType = await applicationTypeService.getApplicationTypeById(applicationTypeId);
        Logger.log('Fetched application type:', applicationType);
        if (!applicationType) {
            return NotFound(res, { data: null, message: `Application type with ID ${applicationTypeId} not found`, });
        }
        Logger.log('Returning application type:', applicationType);
        return Success(res, applicationType);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, { data: null, message: error.message, });
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while fetching the application type', });
    }
}

export const deleteApplicationType = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, { data: null, message: 'User not found in request body', });
        }
        const companyId = user.companyId;
        if (!companyId || isNaN(parseInt(companyId))) {
            return BadRequest(res, { data: null, message: 'Company ID not provided or invalid', });
        }
        const company = await companyService.getCompany(parseInt(companyId));
        if (!company) {
            return NotFound(res, { data: null, message: `Company with ID ${companyId} not found`, });
        }

        const applicationTypeId = parseInt(req.params.id);
        if (isNaN(applicationTypeId)) {
            return BadRequest(res, { data: null, message: 'Application type ID is required and must be a number', });
        }

        const applicationType = await applicationTypeService.getApplicationTypeById(applicationTypeId);
        if (!applicationType) {
            return NotFound(res, { data: null, message: `Application type with ID ${applicationTypeId} not found`, });
        }
        if (applicationType.companyId !== parseInt(companyId)) {
            return BadRequest(res, { data: null, message: 'Application type does not belong to the company', });
        }
        const deletedApplicationType = await applicationTypeService.deleteApplicationType(applicationTypeId);
        return Success(res, deletedApplicationType);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, { data: null, message: error.message, });
        }
        return InternalServerError(res, { data: null, message: error.message || 'An unexpected error occurred while deleting the application type', });
    }
}