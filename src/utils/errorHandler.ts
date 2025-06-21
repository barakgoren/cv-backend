import { Response } from "express";

interface ErrorResponseParam {
    data: any;
    meta: {
        code: number;
        title: string;
        message: string;
    };
}

interface ResponseParams {
    message?: string;
    data?: any;
}

class ErrorResponse {
    private data: any;
    private meta?: {
        code: number;
        title: string;
        message: string;
    };

    constructor({ data, meta }: ErrorResponseParam) {
        this.data = data;
        this.meta = meta;
    }
}

export function Success(res: Response, data: any) {
    const error = new ErrorResponse({ data, meta: { code: 200, title: 'Success', message: 'Request successful' } });
    return res.status(200).json(error);
}

export function BadRequest(res: Response, { message, data }: ResponseParams) {
    const error = new ErrorResponse({ data, meta: { code: 400, title: 'Bad Request', message: message || 'Invalid request' } });
    return res.status(400).json(error);
}

export function Unauthorized(res: Response, { message, data }: ResponseParams) {
    const error = new ErrorResponse({ data, meta: { code: 401, title: 'Unauthorized', message: message || 'Authentication required' } });
    return res.status(401).json(error);
}

export function Forbidden(res: Response, { message, data }: ResponseParams) {
    const error = new ErrorResponse({ data, meta: { code: 403, title: 'Forbidden', message: message || 'Access denied' } });
    return res.status(403).json(error);
}

export function NotFound(res: Response, { message, data }: ResponseParams) {
    const error = new ErrorResponse({ data, meta: { code: 404, title: 'Not Found', message: message || 'Resource not found' } });
    return res.status(404).json(error);
}

export function InternalServerError(res: Response, { message, data }: ResponseParams) {
    const error = new ErrorResponse({ data, meta: { code: 500, title: 'Internal Server Error', message: message || 'An unexpected error occurred' } });
    return res.status(500).json(error);
}