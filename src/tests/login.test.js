import bcrypt from 'bcrypt';
import { conectDB } from '../config/conecction.js';
import { login } from '../controllers/authController.js';
import { createToken } from '../utils/jwt.js';

jest.mock('../config/conecction.js', () => ({
    conectDB: {
        getRepository: jest.fn(),
    },
}));

jest.mock('../utils/jwt.js', () => ({
    createToken: jest.fn(),
}));

jest.mock('bcrypt');


describe('POST /login', () =>{
    let mockReq, mockRes, mockRepository;
    const mockUser = {
        id: 2,
        email: "didier@gmail.com",
        password: "123456a"
    };

    
    beforeEach(() => {
        
        mockRepository = {
            findOne: jest.fn(),
        };

        conectDB.getRepository.mockReturnValue(mockRepository);

        mockReq = {
            body: mockUser,
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            writeHead: jest.fn(),
        };
 
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Retornar 200 si inicia sesión exitosamente", async () => {
       
        mockRepository.findOne.mockResolvedValue(mockUser);
       
        bcrypt.compare.mockResolvedValue(true);
       
        const mockToken = 'mockedToken123';
        createToken.mockReturnValue(mockToken);
    
        await login(mockReq, mockRes);
    
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { email: mockReq.body.email }
        });
    
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockUser.password);
        expect(createToken).toHaveBeenCalledWith({ id: mockReq.body.id });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Inicio de sesion exitoso',
            data: { token: mockToken },
        });
    });

    it("Retornar 404 si no se encuentra el usuario", async () => {
        mockRepository.findOne.mockResolvedValueOnce(null);

        await login(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                email: mockUser.email
            }),
        }));

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Usuario no encontrado',
        });
    });

    it("Retornar 401 si la contraseña es incorrecta", async() =>{

        mockRepository.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await login(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: mockReq.body.email } });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockReq.body.password);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', 
            message: 'Contraseña incorrecta',
        });
    });
    
    it("Retornar 500 si ocurre un error generando el token", async () => {
        mockRepository.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
    
        createToken.mockImplementation(() => { throw new Error("Error generando el token"); });
    
        await login(mockReq, mockRes);
    
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { email: mockReq.body.email }
        });
        
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockUser.password);
        expect(createToken).toHaveBeenCalledWith({ id: mockReq.body.id });
        

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Error interno del servidor',
        });
    });
   
})