import { Request, Response } from 'express';
import Company from "../models/Company";
import User from "../models/User";
import companySchema from "../schemas/company.schema";
import { BadRequest, InternalServerError, NotFound, Success } from "../utils/errorHandler";
import { CompanyError, companyService } from '../services/companyService';
import Logger from '../utils/logger';
import { MongoError } from 'mongodb';

export const createCompany = async (request: Request, response: Response) => {
    try {
        const parsedResults = companySchema.safeParse(request.body);
        if (!parsedResults.success) {
            return BadRequest(response, {
                message: parsedResults.error.errors[0].message,
                data: null
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
                        message: 'One or more users do not exist',
                        data: null
                    });
                default:
                    if (error instanceof MongoError) {
                        if (error.code === 11000) {
                            // Duplicate key error
                            const message = `Duplicate key error: ${Object.keys((error as any).keyValue)[0]} already exists`;
                            Logger.error(message);
                            return BadRequest(response, {
                                message,
                                data: null
                            });
                        }
                    }
                    return BadRequest(response, {
                        message: error.message,
                        data: null
                    });
            }
        }
        return InternalServerError(response, {
            message: 'An error occurred while creating the company',
            data: null
        })
    }
}

export const getCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await companyService.getCompanies();
        Success(res, companies);
    } catch (error: any) {
        Logger.error('Server Error during getting companies:', error.message);
        return InternalServerError(res, {
            message: 'An error occurred while fetching companies',
            data: null
        });
    }
}

export const getCompany = async (req: Request, res: Response) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        const uid = parseInt(req.params.id);

        if (isNaN(uid)) {
            return BadRequest(res, {
                message: 'Invalid company UID',
                data: null
            });
        }
        const company = await companyService.getCompany(uid);
        Success(res, company);
    } catch (error: any) {
        Logger.error('Server Error during getting company:', error.message);
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                message: 'Company not found',
                data: null
            });
        }
        return InternalServerError(res, {
            message: 'An error occurred while fetching the company',
            data: null
        });
    }
}

export const getCompanyByIdentifier = async (req: Request, res: Response) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay
        const identifier = req.params.companyIdentifier;
        if (!identifier) {
            return BadRequest(res, {
                message: 'Company identifier is required',
                data: null
            });
        }
        const company = await companyService.getCompanyByName(identifier);
        if (!company) {
            return NotFound(res, {
                message: 'Company not found',
                data: null
            });
        }
        const companyRes = {
            uid: company.uid,
            name: company.name,
        }
        Success(res, companyRes);
    } catch (error: any) {
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                message: 'Company not found',
                data: null
            });
        }
        Logger.error('Server Error during getting company by identifier:', error.message);
        return InternalServerError(res, {
            message: 'An error occurred while fetching the company by identifier',
            data: null
        });
    }
}

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const uid = parseInt(req.params.id);
        if (isNaN(uid)) {
            return BadRequest(res, {
                message: 'Invalid company UID',
                data: null
            });
        }
        await companyService.deleteCompany(uid);
        Success(res, { message: 'Company deleted successfully' });
    } catch (error: any) {
        Logger.error('Server Error during deleting company:', error.message);
        if (error.message && error.message === CompanyError.COMPANY_NOT_FOUND) {
            return BadRequest(res, {
                message: 'Company not found',
                data: null
            });
        }
        return InternalServerError(res, {
            message: 'An error occurred while deleting the company',
            data: null
        });
    }
}