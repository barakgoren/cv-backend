// Test script to debug environment variables
require('dotenv').config();

console.log('Environment Variables Test:');
console.log('R2_BUCKET:', process.env.R2_BUCKET);
console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
console.log('R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');

// Test the FileUploadService initialization
try {
    const { fileUploadService } = require('./dist/services/fileUploadService');
    console.log('FileUploadService initialized successfully');
} catch (error) {
    console.error('FileUploadService initialization failed:', error.message);
}
