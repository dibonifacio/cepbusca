import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morganMiddleware from './src/middlewares/morgan.middleware.js';
import staticPagesMiddleware from './src/middlewares/staticPages.middleware.js';
import logger from './src/utils/logger.js';
import errorController from './src/controllers/errorController.js';
import router from './src/routes/routes.js';
import routerContent from './src/content/routes/routes.js';

//Carrega parâmetros do sistema
dotenv.config();

// ## Bloco do logger - Winston
// Capturar exceções não tratadas
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});
// Capturar rejeições de promessas não tratadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// ## Fim Bloco do logger - Winston

// defining the Express app
const app = express();
app.use(express.json());
app.use(morganMiddleware);

// Permitir recuperar IP real do Nginx e considerar o cabeçalho X-Forwarded-For ao obter o IP do cliente:
app.set('trust proxy', true);

// enabling CORS for all requests
app.use(cors());

// Adiciona Helmet para configurar cabeçalhos de segurança
//app.use(helmet());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware de Static Pages
app.use(staticPagesMiddleware);

// Rotas
app.use(routerContent);
app.use(router);


// Se não achou nenhuma rota, 404
app.use(errorController.get404Page);

// Middleware de tratamento de erros - fica após as rotas, para tratar os erros de views ou outros
app.use((err, req, res, next) => {
  logger.error(err.stack);   // Registrar o erro
  errorController.getErrorPage(req, res, next);
  //res.status(500).render('pages/error'); // Configurar o status HTTP e renderizar uma página de erro genérica
});

// Inicializando o servidor
const httpPort = process.env.HTTP_PORT || 4000;
app.listen(httpPort, () => {
    console.log('Server is running on port ' + httpPort);
    logger.info('Server is running on port ' + httpPort);
});