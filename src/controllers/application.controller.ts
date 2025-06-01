import { Request, Response } from "express";
import applicationZSchema from "../schemas/application.schema"
import { BadRequest, InternalServerError, Success } from "../utils/errorHandler";
import { applicationService } from "../services/application.service";
import { CompanyError } from "../services/companyService";

export const postApplication = async (req: Request, res: Response) => {
    try {
        const id = req.params.companyId;
        if (!id || isNaN(parseInt(id))) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Company ID is required',
                }
            });
        }
        const parsedApplication = applicationZSchema.safeParse({ ...req.body, companyId: parseInt(id) });
        if (!parsedApplication.success) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: parsedApplication.error.errors[0].message,
                }
            });
        }
        const application = await applicationService.postApplication(parsedApplication.data);
        Success(res, { application });
    } catch (error: any) {
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Company not found',
                }
            });
        }
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: error.message || 'An error occurred while posting the application',
            }
        });
    }
}