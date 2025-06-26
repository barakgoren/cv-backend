/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadDTO:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: The file to upload
 *         folder:
 *           type: string
 *           description: Optional folder name to organize files
 *           example: "resumes"
 *       required:
 *         - file
 * 
 *     FileUploadResponseDTO:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: Unique identifier for the uploaded file
 *           example: "uploads/1642512345_abc123_resume.pdf"
 *         url:
 *           type: string
 *           description: Public URL to access the file
 *           example: "https://your-bucket.r2.cloudflarestorage.com/uploads/1642512345_abc123_resume.pdf"
 *         bucket:
 *           type: string
 *           description: Name of the storage bucket
 *           example: "your-bucket-name"
 *         size:
 *           type: number
 *           description: File size in bytes
 *           example: 1048576
 * 
 *     FileInfoDTO:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: File key/identifier
 *           example: "uploads/1642512345_abc123_resume.pdf"
 *         size:
 *           type: number
 *           description: File size in bytes
 *           example: 1048576
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: Last modification date
 *           example: "2024-01-15T10:30:00Z"
 *         url:
 *           type: string
 *           description: Public URL to access the file
 *           example: "https://your-bucket.r2.cloudflarestorage.com/uploads/1642512345_abc123_resume.pdf"
 *         contentType:
 *           type: string
 *           description: MIME type of the file
 *           example: "application/pdf"
 */

export interface FileUploadDTO {
    file: File;
    folder?: string;
}

export interface FileUploadResponseDTO {
    key: string;
    url: string;
    bucket: string;
    size: number;
}

export interface FileInfoDTO {
    key: string;
    size: number;
    lastModified: Date;
    url: string;
    contentType?: string;
}
