import addressService from '../services/addressService.js';
import navigation from '../utils/navigation.js';

async function addressList(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_SIZE_ADDRESS || 100;
    const pageInfo = await addressService.addressListing(page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/addressList';
    res.render(view, { pageInfo });
}

async function addressDetail(req, res) {
    const addressSlug = '/'+req.params.estado+'/'+req.params.cidade+'/'+req.params.logradouro;
    const pageInfo = await addressService.addressDetail(addressSlug);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/addressDetail';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    addressList,
    addressDetail
};