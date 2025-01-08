import validator from 'validator';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { createToken } from '../utils/jwt.js';
import { conectDB } from '../config/conecction.js';
import {User}  from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    try{
        const { email, password } = req.body
         
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            return sendError(res, 400, 'Faltan datos necesarios');
        }

        if (!validator.isEmail(email)) {
            return sendError(res, 400, 'El email debe ser un email valido');
        }
        
        const userRepository= conectDB.getRepository(User)
        const userExists = await userRepository.findOne({ where: { email: email} })

        if (!userExists) {
            return sendError(res, 404, 'Usuario no encontrado');
        }
   
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        
        if (!isPasswordValid) {
            return sendError(res, 401, 'Contraseña incorrecta');
        }

        const token = createToken({ id: userExists.id})
       
        return sendSuccess(res, { token }, 'Inicio de sesion exitoso');

    }catch(error){
        return sendError(res, 500, 'Error interno del servidor');
    }
}