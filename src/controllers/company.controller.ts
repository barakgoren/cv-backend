import { Request, Response } from 'express';
import Company from "../models/Company";
import User from "../models/User";
import companySchema from "../schemas/company.schema";
import { BadRequest, InternalServerError, Success } from "../utils/errorHandler";
import { CompanyError, companyService } from '../services/companyService';
import Logger from '../utils/logger';

export const createCompany = async (request: Request, response: Response) => {
    try {
        const parsedResults = companySchema.safeParse(request.body);
        if (!parsedResults.success) {
            return BadRequest(response, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: parsedResults.error.errors[0].message,
                }
            });
        }
        const companyData = parsedResults.data;
        const company = await companyService.createCompany(companyData);
        Success(response, { company })
    } catch (error: any) {
        Logger.error('Server Error during creating company:', error.message);
        if (error.message) {
            switch (error.message) {
                case CompanyError.USERS_NOT_FOUND:
                    return BadRequest(response, {
                        data: null,
                        meta: {
                            code: 400,
                            title: 'Bad Request',
                            message: 'One or more users do not exist'
                        }
                    });
            }
        }
        return InternalServerError(response, {
            data: null, meta: {
                code: 500,
                title: 'Internal Server Error',
                message: 'An error occurred while creating the company'
            }
        })
    }
}

export const getCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await companyService.getCompanies();
        Success(res, { companies });
    } catch (error: any) {
        Logger.error('Server Error during getting companies:', error.message);
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: 'An error occurred while fetching companies'
            }
        });
    }
}

export const getCompany = async (req: Request, res: Response) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        const uid = parseInt(req.params.id);
        
        if (isNaN(uid)) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Invalid company UID'
                }
            });
        }
        const company = await companyService.getCompany(uid);
        Success(res, company);
    } catch (error: any) {
        Logger.error('Server Error during getting company:', error.message);
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 404,
                    title: 'Not Found',
                    message: 'Company not found'
                }
            });
        }
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: 'An error occurred while fetching the company'
            }
        });
    }
}

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const uid = parseInt(req.params.id);
        if (isNaN(uid)) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 400,
                    title: 'Bad Request',
                    message: 'Invalid company UID'
                }
            });
        }
        await companyService.deleteCompany(uid);
        Success(res, { message: 'Company deleted successfully' });
    } catch (error: any) {
        Logger.error('Server Error during deleting company:', error.message);
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                data: null,
                meta: {
                    code: 404,
                    title: 'Not Found',
                    message: 'Company not found'
                }
            });
        }
        return InternalServerError(res, {
            data: null,
            meta: {
                code: 500,
                title: 'Internal Server Error',
                message: 'An error occurred while deleting the company'
            }
        });
    }
}