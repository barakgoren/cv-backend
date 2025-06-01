import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unknown API',
      version: '1.0.0',
      description: 'Skinder is an app created by Barak Goren, Its purpose is to gather all the information about the ski and snowboard instructors from Israel on the most popular ski resorts in the world.',
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