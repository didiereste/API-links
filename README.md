## API-links estudiantes
## RUTAS 

 Autenticacion   {url}/api/v1/auth/login    
 Generar Link   {url}/api/v1/student/generate-link



## Descripcion
API que permite generar enlaces de acceso personalizado para estudiantes dependiendo del ID y numero de telefono

## Tecnologias utilizadas
-- **Node.Js
-- **Express
-- **JWT
-- **Bcrypt
-- **Validator
-- **TypeORM
-- **Crypto

## Instalación y Ejecución

### 1. Clonar repositorio
    git clone https://github.com/didiereste/API-links.git

### 2.Acceder a la carpeta
    cd API-links

### 3.Instalar dependencias
    npm install

### 4.Configuración del entorno:
### Copia el archivo .env.example y renómbralo a .env
cp .env.example .env

### 4.Inciar proyecto
    *Desarrollo
        npm run dev
    *Produccion
        npm start



