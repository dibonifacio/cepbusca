import logger from '../utils/logger.js';

function get404Page(req, res, next) {
    const seo = {
        title: 'Página não Encontrada',
        description: '',
        canonical: '',
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };    
    const pageInfo = {
        seo: seo,
        pageTitle: 'Página não Encontrada'
    }
    logger.warn(` 404NotFound: ${req.originalUrl}`);
    const view = 'pages/notFound';
    //res.status(404).render(view, { pageInfo });
    return res.render(view, { pageInfo });
}

function getErrorPage(req, res, next) {
    const seo = {
        title: 'Erro de Servidor',
        description: '',
        canonical: '',
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };    
    const pageInfo = {
        seo: seo,
        pageTitle: 'Erro de Servidor'
    }
    logger.warn(` 500ServerError: ${req.originalUrl}`);
    const view = 'pages/error';
    //res.status(500).render(view, { pageInfo });
    return res.render(view, { pageInfo });
}


// Exportação default das funções como um objeto
export default {
    get404Page,
    getErrorPage
};