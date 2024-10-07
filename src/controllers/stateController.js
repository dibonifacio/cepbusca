import StateService from '../services/stateService.js';
import navigation from '../utils/navigation.js';

async function stateList(req, res) {
    const pageInfo = await StateService.stateListing();
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/stateList';
    res.render(view, { pageInfo });
}

async function stateDetail(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_CITY || 100;
    const stateSlug = req.params.estado;
    const pageInfo = await StateService.stateDetail(stateSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/stateDetail';
    res.render(view, { pageInfo });
}

async function stateDetailArea(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const stateSlug = req.params.estado;
    const pageInfo = await StateService.stateDetailArea(stateSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/stateDetailArea';
    res.render(view, { pageInfo });
}

async function stateDetailAddress(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_ADDRESS || 100;
    const stateSlug = req.params.estado;
    const pageInfo = await StateService.stateDetailAddress(stateSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/stateDetailAddress';
    res.render(view, { pageInfo });
}

async function stateDetailZip(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_ZIP || 100;
    const stateSlug = req.params.estado;
    const pageInfo = await StateService.stateDetailZip(stateSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/stateDetailZip';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    stateList,
    stateDetail,
    stateDetailArea,
    stateDetailAddress,
    stateDetailZip
};