import express from 'express';
import { createUser, getUserById, getUserByToken, getUsers, deleteUser, login } from '../services/userService';
import { isAdmin, isAuth } from '../utils/auth';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user and return a token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginDTO'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
router.get('/', isAuth, isAdmin, getUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the current user by token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The current user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', isAuth, getUserByToken);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', isAuth, isAdmin, getUserById);

/**
 * @swagger 
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;