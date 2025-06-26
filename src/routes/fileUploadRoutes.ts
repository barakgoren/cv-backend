import express from 'express';
import {
    uploadFile,
    uploadFiles,
    deleteFile,
    getFileUrl,
    listFiles,
    getFileInfo,
    healthCheck,
    debugEnv,
    uploadSingle,
    uploadMultiple,
    readPdfFile,
} from '../controllers/fileUploadController';
import { isAuth } from '../utils/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CVAnalysis:
 *       type: object
 *       properties:
 *         personalInfo:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john.doe@email.com"
 *             phone:
 *               type: string
 *               example: "+1-555-123-4567"
 *             address:
 *               type: string
 *               example: "123 Main St, City, State 12345"
 *             linkedinUrl:
 *               type: string
 *               example: "https://linkedin.com/in/johndoe"
 *             portfolioUrl:
 *               type: string
 *               example: "https://johndoe.portfolio.com"
 *         summary:
 *           type: string
 *           example: "Experienced software developer with 5+ years in full-stack development"
 *         skills:
 *           type: object
 *           properties:
 *             technical:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["JavaScript", "Python", "React", "Node.js"]
 *             soft:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Team Leadership", "Communication", "Problem Solving"]
 *             languages:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["English", "Spanish", "French"]
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               position:
 *                 type: string
 *                 example: "Senior Software Developer"
 *               duration:
 *                 type: string
 *                 example: "2020-2023"
 *               description:
 *                 type: string
 *                 example: "Led development of key features"
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Increased performance by 40%", "Led team of 5 developers"]
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *                 example: "University of Technology"
 *               degree:
 *                 type: string
 *                 example: "Bachelor of Science"
 *               field:
 *                 type: string
 *                 example: "Computer Science"
 *               graduationYear:
 *                 type: string
 *                 example: "2018"
 *               gpa:
 *                 type: string
 *                 example: "3.8"
 *         certifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "AWS Certified Developer"
 *               issuer:
 *                 type: string
 *                 example: "Amazon Web Services"
 *               date:
 *                 type: string
 *                 example: "2022"
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "E-commerce Platform"
 *               description:
 *                 type: string
 *                 example: "Full-stack e-commerce solution"
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "MongoDB"]
 *               link:
 *                 type: string
 *                 example: "https://github.com/johndoe/ecommerce"
 *         awards:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Employee of the Year 2022", "Innovation Award"]
 *         additionalInfo:
 *           type: string
 *           example: "Available for remote work, willing to relocate"
 *
 *     CVAnalysisResponse:
 *       type: object
 *       properties:
 *         analysis:
 *           $ref: '#/components/schemas/CVAnalysis'
 *         metadata:
 *           type: object
 *           properties:
 *             totalPages:
 *               type: integer
 *               example: 2
 *             textLength:
 *               type: integer
 *               example: 1542
 *             analyzedAt:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00Z"
 *
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: Unique key/identifier for the uploaded file
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
 *     FileInfo:
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

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a single file to Cloudflare R2
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (PDF, DOC, DOCX, TXT, or images)
 *               folder:
 *                 type: string
 *                 description: Optional folder name to organize files
 *                 example: "resumes"
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - no file provided or invalid file type
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/upload', isAuth, uploadSingle, uploadFile);

/**
 * @swagger
 * /api/files/upload-multiple:
 *   post:
 *     summary: Upload multiple files to Cloudflare R2 (max 5 files)
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of files to upload (max 5 files)
 *               folder:
 *                 type: string
 *                 description: Optional folder name to organize files
 *                 example: "documents"
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - no files provided or invalid file types
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/upload-multiple', isAuth, uploadMultiple, uploadFiles);

/**
 * @swagger
 * /api/files/{key}:
 *   delete:
 *     summary: Delete a file from Cloudflare R2
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: The file key/identifier to delete
 *         schema:
 *           type: string
 *           example: "uploads/1642512345_abc123_resume.pdf"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Bad request - file key required or file not found
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.delete('/:key(*)', isAuth, deleteFile);

/**
 * @swagger
 * /api/files/{key}/url:
 *   get:
 *     summary: Get a signed URL for temporary file access
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: The file key/identifier
 *         schema:
 *           type: string
 *           example: "uploads/1642512345_abc123_resume.pdf"
 *       - in: query
 *         name: expiresIn
 *         required: false
 *         description: URL expiration time in seconds (default 3600 = 1 hour)
 *         schema:
 *           type: integer
 *           minimum: 60
 *           maximum: 604800
 *           example: 3600
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: "uploads/1642512345_abc123_resume.pdf"
 *                     url:
 *                       type: string
 *                       example: "https://your-bucket.r2.cloudflarestorage.com/uploads/file.pdf?signed-params"
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       400:
 *         description: Bad request - file key required or file not found
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/:key(*)/url', isAuth, getFileUrl);

/**
 * @swagger
 * /api/files/list:
 *   get:
 *     summary: List files in storage with optional prefix filter
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: prefix
 *         required: false
 *         description: Filter files by prefix/folder
 *         schema:
 *           type: string
 *           example: "uploads/"
 *       - in: query
 *         name: maxKeys
 *         required: false
 *         description: Maximum number of files to return (default 100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           example: 50
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FileInfo'
 *                     count:
 *                       type: integer
 *                       example: 25
 *                     prefix:
 *                       type: string
 *                       example: "uploads/"
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/list', isAuth, listFiles);

/**
 * @swagger
 * /api/files/{key}/info:
 *   get:
 *     summary: Get detailed information about a file
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: The file key/identifier
 *         schema:
 *           type: string
 *           example: "uploads/1642512345_abc123_resume.pdf"
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/FileInfo'
 *                     - type: object
 *                       properties:
 *                         contentType:
 *                           type: string
 *                           example: "application/pdf"
 *       400:
 *         description: Bad request - file key required or file not found
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/:key(*)/info', isAuth, getFileInfo);

/**
 * @swagger
 * /api/files/health:
 *   get:
 *     summary: Check the health status of the file upload service
 *     tags: [File Upload]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *       500:
 *         description: Service is unhealthy
 */
router.get('/health', healthCheck);

/**
 * @swagger
 * /api/files/debug:
 *   get:
 *     summary: Debug endpoint to check environment variables (remove in production)
 *     tags: [File Upload]
 *     responses:
 *       200:
 *         description: Environment variables status
 *       500:
 *         description: Error checking environment
 */
router.get('/debug', debugEnv);


/**
 * @swagger
 * /api/files/read-pdf:
 *   get:
 *     summary: Analyze CV/Resume from PDF file using AI
 *     description: Downloads a PDF file, extracts text content, and analyzes it using OpenAI to extract structured CV information
 *     tags: [File Upload]
 *     parameters:
 *       - in: query
 *         name: pdfUrl
 *         required: true
 *         description: URL of the PDF CV/Resume file to analyze
 *         schema:
 *           type: string
 *           example: "https://example.com/path/to/resume.pdf"
 *     responses:
 *       200:
 *         description: CV analyzed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "PDF analyzed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CVAnalysisResponse'
 *       400:
 *         description: Bad request - invalid URL or file cannot be processed
 *       500:
 *         description: Internal server error - failed to process or analyze file
 */
router.get('/read-pdf', readPdfFile);

export default router;
