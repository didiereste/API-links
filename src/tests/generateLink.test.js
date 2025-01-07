import { conectDB } from '../config/conecction.js';
import { generateLink } from '../controllers/userController.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

jest.mock('../config/conecction.js', () => ({
    conectDB: {
        getRepository: jest.fn(),
    },
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

        // simula el cuerpo del body que vamos a enviar
        
        mockReq = {
            body: mockLink,
        };

        //simular la respuetsa
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            writeHead: jest.fn(),
        };

        
        sendSuccess.mockImplementation((res, data, message) => {
            res.status(200).json({ status: 'success', message, data });
        });

        sendError.mockImplementation((res, statusCode, message) => {
            res.status(statusCode).json({ status: 'error', message });
        });


    });
    //limpiar pruebas
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Retornar 404 si no se encuentra el estudiante", async()=>{

        mockRepository.findOne.mockResolvedValueOnce({
            id_student: 456789,
            telephone: "312546589"
        });

        await generateLink(mockReq, mockRes);

         expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id_student: mockLink.id_student } });
        
         // Verifica que la respuesta fue 404 (no encontrado)
         expect(mockRes.status).toHaveBeenCalledWith(404);
 
         // Verifica que la respuesta JSON contiene el mensaje adecuado
         expect(mockRes.json).toHaveBeenCalledWith({
             status: 404,
             message: 'Estudiante no encontrado',
             data: undefined,
         });

    })

})