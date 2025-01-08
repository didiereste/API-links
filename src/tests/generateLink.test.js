import { conectDB } from '../config/conecction.js';
import { generateLink } from '../controllers/studentController.js';
import crypto from 'crypto';

jest.mock('../config/conecction.js', () => ({
    conectDB: {
        getRepository: jest.fn(),
    },
}));

jest.mock('crypto', () => ({
    createHash: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('mockedhash'),
    }),
}));

describe('POST /generate-link', () =>{
    let mockReq, mockRes, mockRepository;
    const mockLink = {
        id_student: 456789,
        telephone: "312546589"
    };

    beforeEach(() => {
        
        mockRepository = {
            findOne: jest.fn(),
        };

        conectDB.getRepository.mockReturnValue(mockRepository);

        mockReq = {
            body: mockLink,
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

    it("Retornar 200 si genera el link", async() =>{

        const mockStudent = {
            id_student: 456789,
            telephone: '312546589',
        };

        mockRepository.findOne.mockResolvedValueOnce(mockStudent);

        await generateLink(mockReq, mockRes);

       
        expect(crypto.createHash).toHaveBeenCalledWith('sha256');
        expect(crypto.createHash().update).toHaveBeenCalledWith(`${mockLink.id_student}:${mockLink.telephone}`);
        expect(crypto.createHash().digest).toHaveBeenCalledWith('hex');

        const expectedLink = `https://miscursos.com/cursos/mockedhash`;
        expect(mockRes.status).toHaveBeenCalledWith(200);

        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Link generado correctamente',
            data: { link: expectedLink },
        });

    });

    it("Retornar 404 si no se encuentra el estudiante", async () => {

        mockRepository.findOne.mockResolvedValueOnce(null);
    
        await generateLink(mockReq, mockRes);
    
        expect(mockRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({ id_student: mockLink.id_student }),
        }));
    
        expect(mockRes.status).toHaveBeenCalledWith(404);
    
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Usuario no encontrado',
        });
    });

    it("Retornar 400 si faltan datos necesarios", async () => {
        const mockIncompleteLink = {
            id_student: 456789,
        };
    
        mockReq.body = mockIncompleteLink;
    
        await generateLink(mockReq, mockRes);
    
       
        expect(mockRes.status).toHaveBeenCalledWith(400);
    
     
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Faltan datos necesarios',
        });
    });

})