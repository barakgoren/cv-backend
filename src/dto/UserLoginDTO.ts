/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 */
export interface UserLoginDTO {
    email: string;
    password: string;
  }
  