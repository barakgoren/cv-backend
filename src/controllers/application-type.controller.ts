import { Request, Response } from "express"
import { BadRequest, InternalServerError, NotFound, Success } from "../utils/errorHandler"
import applicationTypeZSchema from "../schemas/application-type.schema";
import { applicationTypeService } from "../services/application-type.service";
import { companyService } from "../services/companyService";

export const createApplicationType = async (req: Request, res: Response) => {
    try {
        // Extract companyId and body from request
        const body = req.body
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'User not found in request body',
                }
            });
        }
        const companyId = user.companyId;
        
        // Validate companyId parameter and Check if company exists
        const company = await companyService.getCompany(parseInt(companyId));
        if (!companyId || isNaN(parseInt(companyId))) {
            BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Company ID not provided or invalid',
                }
            });
        }
        if (!company) {
            return NotFound(res, {
                data: null,
                meta: {
                    code: 404,
                    title: 'Not Found',
                    message: `Company with ID ${companyId} not found`,
                }
            });
        }

        // Validate request body against the schema
        const parsedApplicationType = applicationTypeZSchema.safeParse({ ...body, companyId: parseInt(companyId) });
        if (!parsedApplicationType.success) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: parsedApplicationType.error.errors[0].message,
                }
            });
        }

        const applicationTypeData = parsedApplicationType.data;
        const applicationType = await applicationTypeService.createApplicationType(applicationTypeData);
        return Success(res, applicationType);
    } catch (error: any) {
        if (error.message) {
            BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: error.message,
                }
            })
        }
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: error.message || 'An unexpected error occurred while creating the application type',
            }
        })
    }
}

export const getApplicationTypes = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'User not found in request body',
                }
            });
        }
        const companyId = user.companyId
        if (!companyId || isNaN(parseInt(companyId))) {
            return BadRequest(res, {
                data: user,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Company ID not provided or invalid',
                }
            });
        }
        const company = await companyService.getCompany(parseInt(companyId));
        if (!company) {
            return NotFound(res, {
                data: null,
                meta: {
                    code: 404,
                    title: 'Not Found',
                    message: `Company with ID ${companyId} not found`,
                }
            });
        }
        const applicationTypes = await applicationTypeService.getApplicationTypes(parseInt(companyId));
        return Success(res, applicationTypes);
    } catch (error: any) {
        if (error.message) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: error.message,
                }
            });
        }
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: error.message || 'An unexpected error occurred while fetching application types',
            }
        })
    }
}