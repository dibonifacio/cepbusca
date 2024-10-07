import CityService from '../services/cityService.js';
import navigation from '../utils/navigation.js';

async function cityList(req, res) {
    const page = req.params.page || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_CITY || 500;
    const pageInfo = await CityService.cityListing(page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityList';
    res.render(view, { pageInfo });
}

async function cityDetail(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_ADDRESS || 100;
    const citySlug = '/'+req.params.estado+'/'+req.params.cidade;
    const pageInfo = await CityService.cityDetail(citySlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDetail';
    res.render(view, { pageInfo });
}

async function cityDistance(req, res) {
    const cityFrom = req.params.cityfrom;
    const cityTo = req.params.cityto;
    const pageInfo = await CityService.cityDistance(cityFrom, cityTo);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDistance';
    res.render(view, { pageInfo });
}

async function cityDistances(req, res) {
    const page = req.params.page || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const city = req.params.city;
    const pageInfo = await CityService.cityDistances(city, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDistances';
    res.render(view, { pageInfo });
}


async function cityDetailArea(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const citySlug = '/'+req.params.estado+'/'+req.params.cidade;
    const pageInfo = await CityService.cityDetailArea(citySlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDetailArea';
    res.render(view, { pageInfo });
}

async function cityDetailAddress(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const citySlug = '/'+req.params.estado+'/'+req.params.cidade;
    const pageInfo = await CityService.cityDetailAddress(citySlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDetailArea';
    res.render(view, { pageInfo });
}

async function cityDetailZip(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_AREA || 100;
    const citySlug = '/'+req.params.estado+'/'+req.params.cidade;
    const pageInfo = await CityService.cityDetailZip(citySlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/cityDetailArea';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    cityList,
    cityDetail,
    cityDistance,
    cityDistances,
    cityDetailArea,
    cityDetailAddress,
    cityDetailZip
};