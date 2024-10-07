import seoService from './seoService.js';
import urlService from './urlService.js';
import addressModel from '../models/addressModel.js';
import areaModel from '../models/areaModel.js';
import cityModel from '../models/cityModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function areaListing(page, pageSize) {

    let areas = await areaModel.getAllAreas(page, pageSize);
    let areaQty = await areaModel.getAllAreasCount();
    const totalPages = Math.max(1, Math.ceil(areaQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    areas.forEach(area => {
        area['_url'] = urlService.getPageUrl('area', area.slug_full);
        area['_url_city'] = urlService.getPageUrl('city', area.city_slug);
    });

    const pageType = 'areas';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, areaQty.toLocaleString(locale), );
    const pageUrl = urlService.getPageUrl(pageType, '');
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: urlService.getPaginationUrl(pageUrl,page),
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'Bairros', url: pageUrl }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };
    
    const pageTitle = 'CEPs dos Bairros Brasileiros';

    const contentUpper = 'Veja os CEPs dos ' + areaQty.toLocaleString(locale) + ' bairros do Brasil';

    const contentBottom = 'Conteúdo Inferior';

    const pageInfo = {
        areas: areas,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function areaDetail(slug, page, pageSize) {
    // Checa se Existe
    let area = await areaModel.getAreaBySlug(slug);
    if (!area) { return 'not_found'; }
    let city = await cityModel.getCityById(area.city_id);
    let areaNear = await areaModel.getNearAreas(area.id);
    let address = await addressModel.getAddressByArea(area.id, page, pageSize);
    let addressQty = await addressModel.getAddressByAreaCount(area.id);
    const totalPages = Math.max(1, Math.ceil(addressQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    page = Number(page);
    // Inserindo URLs
    address.forEach(addr => {
        addr['_url'] = urlService.getPageUrl('address', addr.slug_full);
        addr['_url_zip'] = urlService.getPageUrl('zip', '/'+addr.zip);
    });
    areaNear.forEach(area => {
        area['_url'] = urlService.getPageUrl('area', area.slug_full);
    });

    const pageType = 'area';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, addressQty.toLocaleString(locale), area.name, area.city_name, area.state_code);
    const pageUrl = urlService.getPageUrl(pageType, slug);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: urlService.getPaginationUrl(pageUrl,page),
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };    
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: area.state_code, url: urlService.getPageUrl('state', area.state_slug) },
        { name: area.city_name, url: urlService.getPageUrl('city', area.city_slug) },
        { name: 'Bairro ' + area.name, url: urlService.getPageUrl('city', area.slug_full) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };

    const pageTitle = 'CEP ' + area.name + ' em ' + area.city_name + ' / ' + area.state_code;

    const contentUpper = '';

    const contentBottom = '';

    area.address_qty = addressQty.toLocaleString(locale);
    area['_url_state'] = urlService.getPageUrl('state', area.state_slug);
    area['_url_city'] = urlService.getPageUrl('city', area.city_slug);

    var contentNearArea = '';
    if (areaNear.length > 1) {
        contentNearArea = ` O bairro ${area.name} é um dos ${city.area_qty} bairros na cidade de ${area.city_name}. Além de ${area.name}, podemos citar também outros bairros de ${area.city_name} como `;
        areaNear.forEach(area => {
            contentNearArea += ', ' + area.name;
        });
    } else {
        contentNearArea = ` O bairro ${area.name} é o único bairro na cidade de ${area.city_name} que temos cadastrado em nossa base de dados.`;
    }
    
    const contentArea = ` O bairro
    ${area.name} é um dos ${city.area_qty} bairros na cidade de ${area.city_name}, que tem uma população de ${city.population} habitantes, que a coloca em
    ${city.population_ranking}º lugar como maior cidade do Brasil e em ${city.population_ranking_state}º lugar como maior cidade de ${city.state_name}. 
    O código IBGE de ${city.name} é ${city.id.toLocaleString(locale)} e na telefonia, a cidade tem o DDD ${city.ddd}. 
    A cidade tem uma área total de ${city.area_size}km², ou ${city.area_size_m2}m². 
    Em área total, ${city.name} / ${city.state_code} é a ${city.area_ranking}º maior cidade do Brasil e a ${city.area_ranking_state}º maior do estado de ${city.state_name}.
    Sua localização geográfica está na latidade ${city.latitude} e na longitude ${city.longitude}`;

    var contentAddress = '';
    var i = 0;
    if (address.length > 1 ) {
        if (address.length > 20) {
            contentAddress = `O bairro ${area.name}, em nosso banco de dados geográfico, tem ${address.length} ruas cadastradas, sendo algumas delas`;
        } else {
            contentAddress = `O bairro ${area.name}, em nosso banco de dados geográfico, tem ${address.length} ruas cadastradas, que são`;
        }
        for (let i = 0; (i < address.length) && (i<30); i++) {
            if(i==0) contentAddress += ' ' + address[i].name + ' com o CEP ' + address[i].zip;
            if(i>0) contentAddress += ', ' + address[i].name + ' com o CEP ' + address[i].zip;
            if(i==30 || i==(address.length-1)) contentAddress += ' e por último ' + address[i].name + ' com o CEP ' + address[i].zip;
        };

    } else {
        contentAddress = ` O bairro ${area.name}, em nosso banco de dados geográfico, tem 1 rua cadastrada, que é 
        ${address[0].name}, que tem o CEP ${address[0].zip}.`;
    }

    const pageInfo = {
        area: area,
        address: address,
        areaNear: areaNear,
        city: city,
        contentArea: contentArea,
        contentNearArea: contentNearArea,
        contentAddress: contentAddress,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}


// Exportação default das funções como um objeto
export default {
    areaListing,
    areaDetail
};
