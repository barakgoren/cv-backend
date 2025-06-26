/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *           example: John Doe
 *         username:
 *           type: string
 *           description: The user's username
 *           example: jogn.doe
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: john@example.com
 *         password:
 *           type: string
 *           description: The user's password
 *           example: 123
 */
export interface UserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}
