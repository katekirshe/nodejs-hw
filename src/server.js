import express from 'express';
import cors from 'cors';
//import pino from 'pino-http';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
//import { Note } from './models/note.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors()); // Дозволяє запити з будь-яких джерел
app.use(cookieParser());
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);
app.use(errors());

// // Маршрут для тестування middleware помилки
// app.get('/test-error', (req, res) => {
//   // Штучна помилка для прикладу
//   throw new Error('Simulated server error');
// });

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


