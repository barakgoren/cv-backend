/**
 * @swagger
 * components:
 *   schemas:
 *     ApplicationTypeDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *          type: string
 *          description: The Application types's name
 *          example: Junior Software Engineer
 *         description:
 *          type: string
 *          description: A brief description of the application type
 *          example: This application type is for junior software engineers
 *         isActive:
 *          type: boolean
 *          description: Indicates if the application type is active
 *          example: true
 */
export interface ApplicationTypeDTO {
    name: string;
    description?: string;
    companyId: number;
    isActive?: boolean;
}
