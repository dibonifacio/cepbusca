import areaService from '../services/areaService.js';
import navigation from '../utils/navigation.js';

async function areaList(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const pageInfo = await areaService.areaListing(page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/areaList';
    res.render(view, { pageInfo });
}

async function areaDetail(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const areaSlug = '/'+req.params.estado+'/'+req.params.cidade+'/bairro/'+req.params.bairro;
    const pageInfo = await areaService.areaDetail(areaSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/areaDetail';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    areaList,
    areaDetail
};