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
 *         customFields:
 *          type: array
 *          description: Custom form fields for this application type
 *          items:
 *            type: object
 *            properties:
 *              fieldName:
 *                type: string
 *                description: The name attribute of the field
 *                example: yearsOfExperience
 *              fieldType:
 *                type: string
 *                enum: [text, email, tel, textarea, url, number]
 *                description: The type of the input field
 *                example: number
 *              label:
 *                type: string
 *                description: The display label for the field
 *                example: Years of Experience
 *              required:
 *                type: boolean
 *                description: Whether the field is required
 *                example: true
 *              placeholder:
 *                type: string
 *                description: Placeholder text for the field
 *                example: Enter years of experience
 */
export interface ApplicationTypeDTO {
    name: string;
    description?: string;
    companyId: number;
    isActive?: boolean;
    customFields?: {
        fieldName: string;
        fieldType: 'text' | 'email' | 'tel' | 'textarea' | 'url' | 'number';
        label: string;
        required: boolean;
        placeholder?: string;
    }[];
}
