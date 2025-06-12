import { Response } from "express";

interface ErrorResponseParam {
    data: any;
    meta: {
        code: number;
        title: string;
        message: string;
    };
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

export function BadRequest(res: Response, { data, meta }: ErrorResponseParam) {
    const error = new ErrorResponse({ data, meta });
    return res.status(400).json(error);
}

export function Unauthorized(res: Response, { data, meta }: ErrorResponseParam) {
    const error = new ErrorResponse({ data, meta });
    return res.status(401).json(error);
}

export function Forbidden(res: Response, { data, meta }: ErrorResponseParam) {
    const error = new ErrorResponse({ data, meta });
    return res.status(403).json(error);
}

export function NotFound(res: Response, { data, meta }: ErrorResponseParam) {
    const error = new ErrorResponse({ data, meta });
    return res.status(404).json(error);
}

export function InternalServerError(res: Response, { data, meta }: ErrorResponseParam) {
    const error = new ErrorResponse({ data, meta });
    return res.status(500).json(error);
}