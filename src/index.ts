import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import companyRoutes from './routes/companyRoutes';
import applicationRoutes from './routes/applicationRoutes';
import applicationTypeRoutes from './routes/applicationTypeRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggerConfig';
import dotenv from 'dotenv';
import Logger from './utils/logger';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3005;
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.frzuroc.mongodb.net/CV-Sys?retryWrites=true&w=majority`; // Updated connection string

app.use(express.json());
app.use(cors());


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => Logger.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Welcome to the CV Backend API!🚀');
});
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/application-type', applicationTypeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV Backend API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          ul { line-height: 2; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>❗️404 Route not found :(</h1>
        <p>Available routes:</p>
        <ul>
          <li><a href="/">/</a> - Main route</li>
          <li><a href="/api/users">/api/users</a> - User API endpoints</li>
          <li><a href="/api-docs">/api-docs</a> - Swagger API documentation</li>
        </ul>
      </body>
    </html>
    `);
});

app.listen(PORT, () => {
  Logger.log(`Server is running on port ${PORT}`);
});
