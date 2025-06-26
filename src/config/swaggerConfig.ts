import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CV Backend API',
      version: '1.0.0',
      description: 'A comprehensive CV/Resume analysis and application management system with file upload capabilities, OpenAI-powered CV analysis, and company management features.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      }
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/dto/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerDocs = swaggerJsDoc(options);

export default swaggerDocs;