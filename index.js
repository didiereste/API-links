import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { conectDB } from './src/config/conecction.js';



const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ['POST'],
};
app.use(cors(corsOptions));

async function initializeDatabase() {
    try {
        await conectDB.initialize();
        console.log('Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); 
    }
}


async function startServer() {
    await initializeDatabase();

    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/student', userRoutes);

    app.listen(PORT, () => {
        console.log(`El servidor está escuchando en el puerto ${PORT}`);
    });
}

startServer();