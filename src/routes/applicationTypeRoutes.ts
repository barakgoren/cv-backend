import express from 'express';
import { createApplicationType, getApplicationTypes } from '../controllers/application-type.controller';
import { isAuth } from '../utils/auth';

const router = express.Router();

/**
 * @swagger
 * /api/application-type:
 *   post:
 *     summary: Create a new type of application for a company by the user's companyId
 *     tags: [ApplicationType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationTypeDTO'
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      201:
 *          description: The application type was successfully created
 *      400:
 *          description: Bad request, possibly due to missing or invalid data
 *      401:
 *          description: User is not authorized to create an application type
 *      404:
 *          description: Company not found
 *      500:
 *          description: Internal server error
 */
router.post('/', isAuth, createApplicationType);

/**
 * @swagger
 * /api/application-type:
 *   get:
 *     summary: Get all application types for a company by the user's companyId
 *     tags: [ApplicationType]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      400:
 *         description: Bad request, possibly due to missing or invalid data
 *      401:
 *          description: User is not authorized to get application types
 *      404:
 *          description: Company not found
 *      500:
 *          description: Internal server error
 */
router.get('/', isAuth, getApplicationTypes)

export default router;