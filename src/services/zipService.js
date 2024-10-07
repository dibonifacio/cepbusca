import utils from '../utils/utils.js';
import seoService from './seoService.js';
import urlService from './urlService.js';
import zipModel from '../models/zipModel.js';
import cityModel from '../models/cityModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function zipListing(page, pageSize) {
    const pageType = 'zips';
    let zips = await zipModel.getAllZip(page, pageSize);
    let zipQty = await zipModel.getAllZipCount();
    const totalPages = Math.max(1, Math.ceil(zipQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, zipQty.toLocaleString(locale));
    const pageUrl = urlService.getPageUrl(pageType, '');
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'CEPs', url: pageUrl }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };
    
    const pageTitle = 'Todos os CEPs do Brasil';

    const contentUpper = 'Veja todos os ' + zipQty.toLocaleString(locale) + ' CEPs do Brasil';

    const contentBottom = '';

    const contentSidebar = '';

    // Inserindo URLs
    zips.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
        zip['_url_address'] = urlService.getPageUrl('address', zip.address_slug);
        zip['_url_city'] = urlService.getPageUrl('city', zip.city_slug);
    });

    const pageInfo = {
        zips: zips,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        contentSidebar: contentSidebar,
        pagination: pagination
    }

    return pageInfo;
}

async function zipDetail(slug, page, pageSize) {
    // Checa se Existe
    let zip = await zipModel.getZipBySlug(slug);
    if (!zip) { return 'not_found'; }
    let zipIbge = await zipModel.getZipIbge(zip.zip.replace('-', ''));
    let zipNear = await zipModel.getNearZip(zip.zip);
    let zipsSameAddress = await zipModel.getZipByAddress(zip.address_id);
    let city = await cityModel.getCityById(zip.city_id);
    // Inserindo URLs
    zipsSameAddress.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
    });
    zipNear.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
    });
    const pageType = 'zip';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, 1, zip.zip, zip.address, zip.city_name, zip.state_code);
    const pageUrl = urlService.getPageUrl(pageType, slug);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };    
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'CEP ' + zip.zip, url: urlService.getPageUrl('zip', zip.slug_full) }
    ];

    const pageTitle = 'CEP ' + zip.zip + ' - ' + zip.address + ' - ' + zip.city_name + ' - ' + zip.state_code;

    const contentUpper = ``;

    const contentBottom = ``;

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    zip['_url_address'] = urlService.getPageUrl('address', zip.address_slug);
    zip['_url_area'] = urlService.getPageUrl('area', zip.area_slug);
    zip['_url_city'] = urlService.getPageUrl('city', zip.city_slug);
    zip['_url_state'] = urlService.getPageUrl('state', zip.state_slug);
    zip['_url_zip'] = urlService.getPageUrl('zip', zip.slug_full);

    var contentNearZip = '';
    if (zipNear.length > 1) {
        contentNearZip = `O CEP ${zip.zip}, em nosso banco de dados geográfico, tem coordenadas geográficas de latitude ${zip.latitude} e longitude ${zip.longitude} e alguns dos CEPs próximos a ele incluem o `;
        for (let i = 0; (i < zipNear.length); i++) {
            if(i==0) contentNearZip += ' CEP ' + zipNear[i].zip;
            if(i>0) contentNearZip += ', CEP' + zipNear[i].zip;
            if(i==(zipNear.length-1)) contentNearZip += ' e também o CEP ' + zipNear[i].zip;
        }
    };

    const pageInfo = {
        zip: zip,
        zipIbge: zipIbge,
        zipsSameAddress: zipsSameAddress,
        zipNear: zipNear,
        city: city,
        contentNearZip: contentNearZip,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom
    }

    return pageInfo;
}

// Exportação default das funções como um objeto
export default {
    zipListing,
    zipDetail
};
