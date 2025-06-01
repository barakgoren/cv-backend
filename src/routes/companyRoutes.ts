import express from 'express';
import { isAdmin, isAuth } from '../utils/auth';
import { createCompany, deleteCompany, getCompanies, getCompany } from '../controllers/company.controller';

const router = express.Router();


/**
 * @swagger
 * /api/company:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyDTO'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 *       401:
 *         description: User is not authorized to create a company
 */
router.post('/', isAuth, isAdmin, createCompany);


/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Gets all companies
 *     tags: [Company]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of companies
 *       401:
 *         description: User is not authorized to get companies
 */
router.get('/', isAuth, isAdmin, getCompanies);


/**
 * @swagger
 * /api/company/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company to get
 *         schema:
 *           type: string
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the company details
 *       404:
 *         description: Company not found
 *       401:
 *         description: User is not authorized to get companies
 */
router.get('/:id', isAuth, isAdmin, getCompany);


/**
 * @swagger
 * /api/company/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the company to delete
 *         schema:
 *           type: string
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       401:
 *         description: User is not authorized to delete companies
 */
router.delete('/:id', isAuth, isAdmin, deleteCompany);

export default router;