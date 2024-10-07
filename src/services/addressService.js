import seoService from './seoService.js';
import urlService from './urlService.js';
import addressModel from '../models/addressModel.js';
import zipModel from '../models/zipModel.js';
import cityModel from '../models/cityModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function addressListing(page, pageSize) {
    let address = await addressModel.getAllAddress(page, pageSize);
    let addressQty = await addressModel.getAllAddressCount();
    const totalPages = Math.max(1, Math.ceil(addressQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages

    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    address.forEach(addr => {
        addr['_url'] = urlService.getPageUrl('address', addr.slug_full);
        addr['_url_city'] = urlService.getPageUrl('city', addr.city_slug);
    });

    const pageType = 'addresses';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, addressQty.toLocaleString(locale));
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
        { name: 'Ruas', url: pageUrl }
    ];
    const pagination = {
        currentPage: page.toLocaleString(locale),
        totalPages: totalPages.toLocaleString(locale),
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };
    
    const pageTitle = 'CEPs dos Logradouros Brasileiros';

    const contentUpper = 'Veja os CEPs dos ' + addressQty.toLocaleString(locale) + ' logradouros do Brasil';

    const contentBottom = 'Conteúdo Inferior';

    const pageInfo = {
        address: address,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function addressDetail(slug) {
    // Checa se Existe
    let address = await addressModel.getAddressBySlug(slug);
    if (!address) { return 'not_found'; }
    let zips = await zipModel.getZipByAddress(address.id);
    let city = await cityModel.getCityById(address.city_id);
    // Inserindo URLs
    zips.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
        zip['_url_area'] = urlService.getPageUrl('area', zip.area_slug);
        zip['_url_city'] = urlService.getPageUrl('city', zip.city_slug);
    });

    const pageType = 'address';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, 1, address.name, address.city_name, address.state_code);
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
        { name: address.state_code, url: urlService.getPageUrl('state', address.state_slug) },
        { name: address.city_name, url: urlService.getPageUrl('city', address.city_slug) },
        { name: address.name, url: urlService.getPageUrl('address', address.slug_full) }
    ];
    

    const pageTitle = 'CEP ' + address.name + ' em ' + address.city_name + ' / ' + address.state_code;

    const contentUpper = '';

    const contentBottom = 'Conteúdo Inferior';

    address['_url_state'] = urlService.getPageUrl('state', address.state_slug);
    address['_url_city'] = urlService.getPageUrl('city', address.city_slug);
    address['_url_area'] = urlService.getPageUrl('area', address.area_slug);

    var contentAddress = '';
    if (zips.length > 1) {
        contentAddress = `O logradouro ${address.name}, em nosso banco de dados geográfico, tem coordenadas geográficas de latitude ${address.latitude} e longitude ${address.longitude} e possui ${zips.length} ao longo de sua extensão. Os CEPs que pertencem à ${address.name} são `;
        for (let i = 0; (i < zips.length); i++) {
            if(i==0) contentAddress += ' CEP ' + zips[i].zip;
            if(i>0) contentAddress += ', CEP' + zips[i].zip;
            if(i==(zips.length-1)) contentAddress += ' e também o CEP ' + zips[i].zip;
        }
    } else {
        contentAddress = `O endereço ${address.name} fica no bairro ${address.area_name} e possui apenas um CEP em toda sua extensão, que é o ${address.zip}
        `;
    }

    const pageInfo = {
        address: address,
        zips: zips,
        city: city,
        contentAddress: contentAddress,
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
    addressListing,
    addressDetail
};
