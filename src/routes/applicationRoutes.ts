import express from 'express';
import { getApplication, getApplicationsByCompanyId, postApplication } from '../controllers/application.controller';
import { isAuth } from '../utils/auth';

const router = express.Router();

/**
 * @swagger
 * /api/application/{companyId}:
 *   post:
 *     summary: Post new application for a company
 *     tags: [Application]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: ID of the company to post the application for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationDTO'
 *     responses:
 *      201:
 *       description: The application was successfully created
 *      404:
 *       description: Company not found
 *      500:
 *       description: Internal server error
 */
router.post('/', postApplication);

router.get('/company/:companyId', isAuth, getApplicationsByCompanyId);
router.get('/:applicationId', isAuth, getApplication);



export default router;