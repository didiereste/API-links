import { conectDB } from '../config/conecction.js';
import { Student } from '../models/studentModel.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import validator from 'validator';
import crypto from 'crypto';

export const generateLink = async (req, res) => {
    try {
        const { id_student, telephone } = req.body;
    
        if (!id_student || !telephone) {
            return sendError(res, 400, 'Faltan datos necesarios');
        }

        if (!validator.isNumeric(String(id_student))) {
            return sendError(res, 400, 'El ID del estudiante debe ser numérico');
        }

        const studentRepository = conectDB.getRepository(Student);

        const user = await studentRepository.findOne({
            where: {
                id_student: Number(id_student),
                telephone: telephone
            }
        });

        if (!user) {
            return sendError(res, 404, 'Usuario no encontrado');
        }

        const uniqueString = `${id_student}:${telephone}`;
        const uniqueHash = crypto.createHash('sha256').update(uniqueString).digest('hex');
        const uniqueLink = `https://miscursos.com/cursos/${uniqueHash}`;

        return sendSuccess(res, { link: uniqueLink }, 'Link generado correctamente');

    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Error interno del servidor');
    }
};