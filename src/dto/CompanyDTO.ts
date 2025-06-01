/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The company's name
 *         users:
 *          type: array
 *          items:
 *             type: number
 *          description: List of user IDs associated with the company
 */
export interface CompanyDTO {
    name: string;
    users?: number[];
}
