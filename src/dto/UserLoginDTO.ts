/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 */
export interface UserLoginDTO {
  username: string;
  password: string;
}
