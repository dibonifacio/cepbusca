import logger from '../utils/logger.js';
import errorController from '../controllers/errorController.js';

function errorValidator(req, res, pageInfo) {
    if (pageInfo == 'page_out_bounds') { 
        const { originalUrl } = req;
        const [baseUrl] = originalUrl.split('/pagina/');
        const validUrl = `${baseUrl}`;  // Pegar a URL base
        logger.warn(` Page Out Bounds ${req.originalUrl}`); 
        res.redirect(validUrl); // Redireciona para a URL base
        return true;
    };
    if (pageInfo == 'not_found') { 
        logger.warn(` Content not Found ${req.originalUrl}`); 
        //res.status(500).render('pages/error'); // Configurar o status HTTP e renderizar uma página de erro genérica
        errorController.getErrorPage(req, res);
        return true;
    };
    if (!pageInfo) {
        logger.warn(` PageInfo Empty ${req.originalUrl}`); 
        //res.status(500).render('pages/error'); // Configurar o status HTTP e renderizar uma página de erro genérica
        errorController.getErrorPage(req, res);
        return true;
    }
    return false;
}

// Exportação default das funções
export default {
    errorValidator
};