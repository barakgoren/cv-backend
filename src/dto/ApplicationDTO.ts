/**
 * @swagger
 * components:
 *   schemas:
 *     ApplicationDTO:
 *       type: object
 *       required:
 *        - firstName
 *        - lastName
 *        - companyId
 *        - email
 *       properties:
 *        firstName:
 *          type: string
 *          description: The first name of the applicant
 *          example: John
 *        lastName:
 *         type: string
 *         description: The last name of the applicant
 *         example: Doe
 *        email:
 *         type: string
 *         format: email
 *         description: The email of the applicant
 *        phone:
 *         type: string
 *         description: The phone number of the applicant
 *         example: +972 123 456 789
 *        resumeUrl:
 *         type: string
 *         format: uri
 *         description: The URL of the applicant's resume
 *         example: https://example.com/resume.pdf
 */
export interface ApplicationDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    resumeUrl?: string;
}
