import express from 'express';
import { createApplicationType, deleteApplicationType, getApplicationTypeById, getApplicationTypes, patchApplicationType, updateApplicationType } from '../controllers/application-type.controller';
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

/**
 * @swagger
 * /api/application-type/{applicationTypeId}:
 *  get:
 *   summary: A public endpoint to retrieve an application type by its ID, main use is to get the application type for a form submission
 *   tags: [ApplicationType]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *      description: The ID of the application type to retrieve
 *   responses:
 *    200:
 *      description: The application type was successfully retrieved
 *    400:
 *      description: Bad request, possibly due to missing or invalid data
 *    401:
 *      description: User is not authorized to access the application type
 *    404:
 *      description: Application type not found
 *    500:
 *      description: Internal server error
 */
router.get('/:id', getApplicationTypeById);

/**
 * @swagger
 * /api/application-type/{applicationTypeId}:
 *  patch:
 *   summary: Update an application type by its ID
 *   tags: [ApplicationType]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *      description: The ID of the application type to update
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *          $ref: '#/components/schemas/ApplicationTypeDTO'
 *   responses:
 *    200:
 *      description: The application type was successfully updated
 *    400:
 *      description: Bad request, possibly due to missing or invalid data
 *    401:
 *      description: User is not authorized to update the application type
 *    404:
 *      description: Application type not found
 *    500:
 *      description: Internal server error
 */
router.patch('/:id', isAuth, patchApplicationType);


/**
 * @swagger
 * /api/application-type/{applicationTypeId}:
 *  put:
 *   summary: Update an application type by its ID
 *   tags: [ApplicationType]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *      description: The ID of the application type to update
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *          $ref: '#/components/schemas/ApplicationTypeDTO'
 *   responses:
 *    200:
 *      description: The application type was successfully updated
 *    400:
 *      description: Bad request, possibly due to missing or invalid data
 *    401:
 *      description: User is not authorized to update the application type
 *    404:
 *      description: Application type not found
 *    500:
 *      description: Internal server error
 */
router.put('/:id', isAuth, updateApplicationType);


/**
 * @swagger
 * /api/application-type/{applicationTypeId}:
 *  delete:
 *   summary: Delete an application type by its ID
 *   tags: [ApplicationType]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: applicationTypeId
 *      required: true
 *      schema:
 *        type: integer
 *      description: The ID of the application type to delete
 *   responses:
 *    200:
 *      description: The application type was successfully deleted
 *    400:
 *      description: Bad request, possibly due to missing or invalid data
 *    401:
 *      description: User is not authorized to delete the application type
 *    404:
 *      description: Application type not found
 *    500:
 *      description: Internal server error
 */
router.delete('/:id', isAuth, deleteApplicationType);

export default router;