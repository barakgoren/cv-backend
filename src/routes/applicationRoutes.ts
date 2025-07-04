import express from 'express';
import { getApplication, getApplicationsByCompanyId, postApplication, compareApplicants } from '../controllers/application.controller';
import { isAuth } from '../utils/auth';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});


/**
 * @swagger
 * /api/application:
 *   post:
 *     summary: Post new application for a company
 *     tags: [Application]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the applicant
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the applicant
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the applicant
 *                 example: "john.doe@email.com"
 *               phone:
 *                 type: string
 *                 description: Phone number of the applicant
 *                 example: "+1-555-123-4567"
 *               companyId:
 *                 type: number
 *                 description: ID of the company for this application
 *                 example: 1
 *               applicationTypeId:
 *                 type: number
 *                 description: ID of the application type
 *                 example: 1
 *               customFields:
 *                 type: object
 *                 description: Custom fields as defined by the application type
 *                 additionalProperties: true
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional files to upload with the application
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - companyId
 *     responses:
 *      200:
 *       description: The application was successfully created
 *      400:
 *       description: Bad request - missing required fields or invalid data
 *      404:
 *       description: Company not found
 *      500:
 *       description: Internal server error
 */
router.post('/', upload.any(), postApplication);

/**
 * @swagger
 * /api/application/company/{companyId}:
 *   get:
 *     summary: Get all applications for a specific company
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: ID of the company to get applications for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: integer
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       companyId:
 *                         type: integer
 *                       applicationTypeId:
 *                         type: integer
 *                       applicationTypeName:
 *                         type: string
 *                       companyName:
 *                         type: string
 *                       customFields:
 *                         type: object
 *                         additionalProperties: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request - invalid company ID
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.get('/company/:companyId', isAuth, getApplicationsByCompanyId);

/**
 * @swagger
 * /api/application/{applicationId}:
 *   get:
 *     summary: Get a specific application by ID
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         description: ID of the application to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     companyId:
 *                       type: integer
 *                     applicationTypeId:
 *                       type: integer
 *                     applicationTypeName:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     customFields:
 *                       type: object
 *                       additionalProperties: true
 *                     linkPreviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                           preview:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               image:
 *                                 type: string
 *                               url:
 *                                 type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - invalid application ID
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get('/:applicationId', isAuth, getApplication);

/**
 * @swagger
 * /api/application/compare:
 *   post:
 *     summary: Compare multiple applicants against a job position using AI
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantsIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of application IDs to compare
 *                 example: [1, 2, 3]
 *               applicationTypeId:
 *                 type: integer
 *                 description: ID of the application type that defines the job position
 *                 example: 1
 *             required:
 *               - applicantsIds
 *               - applicationTypeId
 *     responses:
 *       200:
 *         description: Applicants comparison completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     applicants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           personalInfo:
 *                             type: object
 *                             properties:
 *                               fullName:
 *                                 type: string
 *                                 example: "John Doe"
 *                               email:
 *                                 type: string
 *                                 example: "john.doe@email.com"
 *                               phone:
 *                                 type: string
 *                                 example: "+1-555-123-4567"
 *                               currentCompany:
 *                                 type: string
 *                                 example: "TechCorp Solutions"
 *                               location:
 *                                 type: string
 *                                 example: "San Francisco, CA"
 *                               experience:
 *                                 type: string
 *                                 example: "5+ years"
 *                               skills:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 example: ["JavaScript", "React", "Node.js"]
 *                               salaryExpectation:
 *                                 type: string
 *                                 example: "$120,000 - $150,000"
 *                           matchPrecentage:
 *                             type: number
 *                             minimum: 0
 *                             maximum: 100
 *                             example: 85
 *                           matchPercentageReason:
 *                             type: string
 *                             example: "Strong technical skills alignment with 5+ years of relevant experience. Minor gap in specific framework knowledge."
 *                           matchLabel:
 *                             type: string
 *                             enum: ["Excellent Match", "Good Match", "Fair Match", "Poor Match", "No Match"]
 *                             example: "Good Match"
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Application type or applications not found
 *       500:
 *         description: Internal server error
 */
router.post('/compare', isAuth, compareApplicants);





export default router;