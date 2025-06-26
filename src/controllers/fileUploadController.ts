import { Request, Response } from 'express';
import multer from 'multer';
import { fileUploadService } from '../services/fileUploadService';
import { BadRequest, InternalServerError, Success } from '../utils/errorHandler';
import Logger from '../utils/logger';
import pdfReader from 'pdf-parse'
import fs from 'fs';
import { openaiService } from '../services/openaiService';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Define allowed file types
        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and image files are allowed.'));
        }
    },
});

// Middleware for single file upload
export const uploadSingle = upload.single('file');

// Middleware for multiple file upload
export const uploadMultiple = upload.array('files', 5); // Max 5 files

/**
 * Upload a single file
 */
export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return BadRequest(res, {
                message: 'No file provided',
                data: null,
            });
        }

        const { buffer, originalname, mimetype } = req.file;
        const folder = req.body.folder || 'uploads'; // Optional folder parameter

        const result = await fileUploadService.uploadFile(
            buffer,
            originalname,
            mimetype,
            folder
        );

        Logger.log(`File uploaded successfully: ${result.key}`);

        return Success(res, {
            message: 'File uploaded successfully',
            data: result,
        });
    } catch (error: any) {
        Logger.error('Error in uploadFile controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to upload file',
            data: null,
        });
    }
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return BadRequest(res, {
                message: 'No files provided',
                data: null,
            });
        }

        const folder = req.body.folder || 'uploads';
        const uploadPromises = files.map(file =>
            fileUploadService.uploadFile(
                file.buffer,
                file.originalname,
                file.mimetype,
                folder
            )
        );

        const results = await Promise.all(uploadPromises);

        Logger.log(`${results.length} files uploaded successfully`);

        return Success(res, {
            message: `${results.length} files uploaded successfully`,
            data: results,
        });
    } catch (error: any) {
        Logger.error('Error in uploadFiles controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to upload files',
            data: null,
        });
    }
};

/**
 * Delete a file
 */
export const deleteFile = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;

        if (!key) {
            return BadRequest(res, {
                message: 'File key is required',
                data: null,
            });
        }

        // Check if file exists before attempting to delete
        const exists = await fileUploadService.fileExists(key);
        if (!exists) {
            return BadRequest(res, {
                message: 'File not found',
                data: null,
            });
        }

        await fileUploadService.deleteFile(key);

        Logger.log(`File deleted successfully: ${key}`);

        return Success(res, {
            message: 'File deleted successfully',
            data: { key },
        });
    } catch (error: any) {
        Logger.error('Error in deleteFile controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to delete file',
            data: null,
        });
    }
};

/**
 * Get a signed URL for temporary file access
 */
export const getFileUrl = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const expiresIn = parseInt(req.query.expiresIn as string) || 3600; // Default 1 hour

        if (!key) {
            return BadRequest(res, {
                message: 'File key is required',
                data: null,
            });
        }

        // Check if file exists
        const exists = await fileUploadService.fileExists(key);
        if (!exists) {
            return BadRequest(res, {
                message: 'File not found',
                data: null,
            });
        }

        const signedUrl = await fileUploadService.getSignedUrl(key, expiresIn);

        return Success(res, {
            message: 'Signed URL generated successfully',
            data: {
                key,
                url: signedUrl,
                expiresIn,
            },
        });
    } catch (error: any) {
        Logger.error('Error in getFileUrl controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to generate file URL',
            data: null,
        });
    }
};

/**
 * List files in a folder
 */
export const listFiles = async (req: Request, res: Response) => {
    try {
        const prefix = req.query.prefix as string;
        const maxKeys = parseInt(req.query.maxKeys as string) || 100;

        const files = await fileUploadService.listFiles(prefix, maxKeys);

        return Success(res, {
            message: 'Files retrieved successfully',
            data: {
                files,
                count: files.length,
                prefix: prefix || 'all',
            },
        });
    } catch (error: any) {
        Logger.error('Error in listFiles controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to list files',
            data: null,
        });
    }
};

/**
 * Get file information
 */
export const getFileInfo = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;

        if (!key) {
            return BadRequest(res, {
                message: 'File key is required',
                data: null,
            });
        }

        const fileInfo = await fileUploadService.getFileInfo(key);

        if (!fileInfo) {
            return BadRequest(res, {
                message: 'File not found',
                data: null,
            });
        }

        return Success(res, {
            message: 'File information retrieved successfully',
            data: {
                key,
                ...fileInfo,
            },
        });
    } catch (error: any) {
        Logger.error('Error in getFileInfo controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to get file information',
            data: null,
        });
    }
};

/**
 * Health check endpoint for file upload service
 */
export const healthCheck = async (req: Request, res: Response) => {
    try {
        // Test connection by listing files with limit 1
        await fileUploadService.listFiles('', 1);

        return Success(res, {
            message: 'File upload service is healthy',
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        Logger.error('File upload service health check failed:', error);
        return InternalServerError(res, {
            message: 'File upload service is unhealthy',
            data: {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            },
        });
    }
};

/**
 * Environment debug endpoint - remove in production
 */
export const debugEnv = async (req: Request, res: Response) => {
    try {
        const envStatus = {
            R2_BUCKET: process.env.R2_BUCKET ? 'SET' : 'NOT SET',
            R2_ENDPOINT: process.env.R2_ENDPOINT ? 'SET' : 'NOT SET',
            R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? 'SET' : 'NOT SET',
            R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET',
            bucketValue: process.env.R2_BUCKET || 'UNDEFINED',
            endpointValue: process.env.R2_ENDPOINT || 'UNDEFINED'
        };

        Logger.log('Environment debug:', envStatus);

        return Success(res, {
            message: 'Environment variables status',
            data: envStatus,
        });
    } catch (error: any) {
        Logger.error('Error in debugEnv controller:', error);
        return InternalServerError(res, {
            message: error.message || 'Failed to check environment',
            data: null,
        });
    }
};

/**
 * Reads PDF file and extracts text content, then analyzes it with OpenAI
 * @param req - Express request object
 * @param res - Express response object
 * @returns Analyzed CV data in structured JSON format
 */
export const readPdfFile = async (req: Request, res: Response) => {
    try {
        const fileUrl = req.query.pdfUrl as string;
        if (!fileUrl) {
            return BadRequest(res, {
                message: 'File URL is required',
                data: null,
            });
        }

        // Validate file URL
        const urlPattern = /^(https?:\/\/)?([\w.-]+)(:[0-9]+)?(\/[\w.-]*)*\/?$/;
        if (!urlPattern.test(fileUrl)) {
            return BadRequest(res, {
                message: 'Invalid file URL format',
                data: null,
            });
        }

        Logger.log(`Starting PDF analysis for URL: ${fileUrl}`);

        // Fetch and parse PDF
        const ress = await fetch(fileUrl);
        if (!ress.ok) {
            return BadRequest(res, {
                message: 'Failed to fetch PDF file from the provided URL',
                data: null,
            });
        }

        const buffer = await ress.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);
        const pdfData = await pdfReader(pdfBuffer);

        // Check if text was extracted
        if (!pdfData.text || pdfData.text.trim().length === 0) {
            Logger.warning('No text extracted from PDF');
            return BadRequest(res, {
                message: 'No text could be extracted from the PDF. The file may be image-based or corrupted.',
                data: null,
            });
        }

        Logger.log(`PDF text extracted successfully. Length: ${pdfData.text.length} characters`);

        // Analyze the extracted text with OpenAI
        const analyzedData = await openaiService.analyzeCVText(pdfData.text);

        Logger.log('PDF analysis completed successfully');

        return Success(res, {
            analysis: analyzedData,
            metadata: {
                totalPages: pdfData.numpages,
                textLength: pdfData.text.length,
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error: any) {
        Logger.error('Error reading PDF file:', error);

        // Handle specific error types
        if (error.message.includes('CV analysis failed')) {
            return InternalServerError(res, {
                message: 'Failed to analyze CV content with AI',
                data: {
                    error: error.message,
                    suggestion: 'Please ensure the PDF contains readable text and try again.'
                }
            });
        }

        if (error.message.includes('OpenAI API key')) {
            return InternalServerError(res, {
                message: 'AI analysis service is not properly configured',
                data: null,
            });
        }

        return InternalServerError(res, {
            message: error.message || 'Failed to read and analyze PDF file',
            data: null,
        });
    }
}