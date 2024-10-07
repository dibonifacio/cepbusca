import zipService from '../services/zipService.js';
import navigation from '../utils/navigation.js';

async function zipList(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_ZIP || 100;
    const pageInfo = await zipService.zipListing(page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/zipList';
    res.render(view, { pageInfo });
}

async function zipDetail(req, res) {
    const zipSlug = '/'+req.params.cep;
    const pageInfo = await zipService.zipDetail(zipSlug);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/zipDetail';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    zipList,
    zipDetail
};