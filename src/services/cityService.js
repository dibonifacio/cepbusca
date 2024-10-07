import seoService from './seoService.js';
import urlService from './urlService.js';
import cityModel from '../models/cityModel.js';
import areaModel from '../models/areaModel.js';
import zipModel from '../models/zipModel.js';
import addressModel from '../models/addressModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function cityListing(page, pageSize) {    

    let cities = await cityModel.getAllCities(page, pageSize);
    let cityQty = await cityModel.getAllCitiesCount();
    const totalPages = Math.max(1, Math.ceil(cityQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    cities.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
    });

    const pageType = 'cities';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, cityQty.toLocaleString(locale));
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
        { name: 'Cidades', url: pageUrl }
    ];
    const pagination = {
        currentPage: page.toLocaleString(locale),
        totalPages: totalPages.toLocaleString(locale),
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };
    
    const pageTitle = 'CEPs das Cidades Brasileiras';

    const contentUpper = 'Veja os CEPs das ' + cityQty.toLocaleString(locale) + ' cidades do Brasil';

    const contentBottom = 'Conteúdo Inferior';

    const pageInfo = {
        cities: cities,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function cityDetail(slug, page, pageSize) {
    // Checa se Existe
    let city = await cityModel.getCityBySlug(slug);
    if (!city) { return 'not_found'; }
    let cityIbge = await cityModel.getCityIbgeById(city.id);
    let cityNear = await cityModel.getNearCities(city.id);
    let zips = await zipModel.getZipByCity(city.id, page, pageSize);
    let zipQty = await zipModel.getZipByCityCount(city.id);
    const totalPages = Math.max(1, Math.ceil(zipQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    zips.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
        zip['_url_area'] = urlService.getPageUrl('area', zip.area_slug);
        zip['_url_address'] = urlService.getPageUrl('address', zip.address_slug);
    });
    cityNear.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
        city['population'] = city['population'].toLocaleString(locale);
    });

    const pageType = 'city';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, zipQty.toLocaleString(locale), city.name, city.state_code);
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
        { name: city.state_code, url: urlService.getPageUrl('state', city.state_slug) },
        { name: city.name, url: urlService.getPageUrl('city', city.slug_full) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };

    const pageTitle = 'CEP ' + city.name + ' / ' + city.state_code;

    const contentUpper = '';

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    city.area_size_m2 = (city.area_size*1000000).toLocaleString(locale);
    city.area_size_ha = (city.area_size*100).toLocaleString(locale);
    city.area_qty = city.area_qty.toLocaleString(locale);
    city.address_qty = city.address_qty.toLocaleString(locale);
    city.zip_qty = city.zip_qty.toLocaleString(locale);
    city['_url_state'] = urlService.getPageUrl('state', city.state_slug);
    city['_url_city'] = urlService.getPageUrl('city', city.slug_full);
    city['_url_city_area'] = urlService.getPageUrl('city_area', city.slug_full);
    city['_url_city_address'] = urlService.getPageUrl('city_address', city.slug_full);
    city['_url_city_zip'] = urlService.getPageUrl('city_zip', city.slug_full);
    city.area_size = city.area_size.toLocaleString(locale);
    city.area_ranking = city.area_ranking.toLocaleString(locale);
    city.area_ranking_state = city.area_ranking_state.toLocaleString(locale);
    city.population = city.population.toLocaleString(locale);
    city.population_ranking = city.population_ranking.toLocaleString(locale);
    city.population_ranking_state = city.population_ranking_state.toLocaleString(locale);
    city.ibge = city.id.toLocaleString(locale);

    const nearestCities = getNearestCities(city, cityNear);

    const contentBottom = `
    ${city.name} é uma cidade no estado de ${city.state_name} que tem uma população de ${city.population} habitantes. 
    Em tamanho da população, ela é a ${city.population_ranking}º maior cidade do Brasil e a ${city.population_ranking_state}º maior cidade de ${city.state_name}. 
    O código IBGE de ${city.name} é ${city.id.toLocaleString(locale)} e na telefonia, a cidade tem o DDD ${city.ddd}. 
    A cidade tem uma área total de ${city.area_size}km², ou ${city.area_size_m2}m², ou ainda ${city.area_size_ha} hectares. 
    Em área total, ${city.name} / ${city.state_code} é a ${city.area_ranking}º maior cidade do Brasil e a ${city.area_ranking_state}º maior do estado de ${city.state_name}.
    Sua localização geográfica está na latidade ${city.latitude} e na longitude ${city.longitude}`;

    const pageInfo = {
        city: city,
        cityIbge: cityIbge,
        cityNear: cityNear,
        zips: zips,
        nearestCities: nearestCities,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function cityDetailArea(slug, page, pageSize) {
    // Checa se Existe
    let city = await cityModel.getCityBySlug(slug);
    if (!city) { return 'not_found'; }
    let cityNear = await cityModel.getNearCities(city.id);
    let areas = await areaModel.getAreasByCity(city.id, page, pageSize);
    let areaQty = await areaModel.getAreasByCityCount(city.id);
    const totalPages = Math.max(1, Math.ceil(areaQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    areas.forEach(area => {
        area['_url'] = urlService.getPageUrl('area', area.slug_full);
        area['_url_address'] = urlService.getPageUrl('address', area.address_slug);
        area['_url_city'] = urlService.getPageUrl('city', area.city_slug);
    });
    cityNear.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
    });
    const pageType = 'city_area';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, areaQty.toLocaleString(locale), city.name, city.state_code);
    const pageUrl = urlService.getPageUrl(pageType, city.slug_full);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: urlService.getPaginationUrl(pageUrl,page),
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };    
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: city.state_code, url: urlService.getPageUrl('state', city.state_slug) },
        { name: city.name, url: urlService.getPageUrl('city', city.slug_full) },
        { name: 'Bairros', url: urlService.getPageUrl('city_area', city.slug_full) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };

    const pageTitle = 'CEPs dos Bairros de ' + city.name + ' / ' + city.state_code;

    const contentUpper = '';

    const contentBottom = '';

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    city.area_qty = city.area_qty.toLocaleString(locale);
    city.address_qty = city.address_qty.toLocaleString(locale);
    city.zip_qty = city.zip_qty.toLocaleString(locale);
    city['_url_state'] = urlService.getPageUrl('state', city.state_slug);
    city['_url_city'] = urlService.getPageUrl('city', city.slug_full);
    city['_url_city_area'] = urlService.getPageUrl('city_area', city.slug_full);
    city['_url_city_address'] = urlService.getPageUrl('city_address', city.slug_full);
    city['_url_city_zip'] = urlService.getPageUrl('city_zip', city.slug_full);

    const pageInfo = {
        city: city,
        cityNear: cityNear,
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

function getNearestCities(city, citiesNear) {
    let html = '<p>A cidade mais próxima de ' + city.name + ' é ' + citiesNear[0].name + ', com uma população total de ' + citiesNear[0].population + ' habitantes e CEP de ' + citiesNear[0].zip_start + ' a ' + citiesNear[0].zip_end + '. ' + citiesNear[1].name + ' é a segunda cidade mais próxima de ' + city.name + ' com CEPs de ' + citiesNear[1].zip_start + ' e ' + citiesNear[1].zip_end + '</p>';
    html = html + '<p>Completando a lista das 10 cidades mais próximas de ' + city.name + ' temos ainda ';
    html = html + citiesNear[2].name + ', com uma população total de ' + citiesNear[2].population + ' habitantes e CEP de ' + citiesNear[2].zip_start + ' a ' + citiesNear[2].zip_end + ' e ';
    html = html + citiesNear[3].name + ', com ' + citiesNear[3].population + ' habitantes na quarta posição e CEP de ' + citiesNear[3].zip_start + ' a ' + citiesNear[3].zip_end + '. ';
    html = html + citiesNear[4].name + ' em quinto lugar com uma população total de ' + citiesNear[4].population + ' habitantes e CEP de ' + citiesNear[4].zip_start + ' a ' + citiesNear[4].zip_end + ', ';
    html = html + citiesNear[5].name + ', em sexto com ' + citiesNear[5].population + ' habitantes e CEP de ' + citiesNear[5].zip_start + ' a ' + citiesNear[5].zip_end + ', ';
    html = html + citiesNear[6].name + ' que tem CEP de ' + citiesNear[6].zip_start + ' a ' + citiesNear[6].zip_end + ' e uma população total de ' + citiesNear[6].population + ' habitantes. </p>';
    html = html + '<p>Em oitavo lugar vem ' + citiesNear[7].name + ', com uma população total de ' + citiesNear[7].population + ' habitantes e CEP de ' + citiesNear[7].zip_start + ' a ' + citiesNear[7].zip_end + ', ';
    html = html + citiesNear[8].name + ', com uma população total de ' + citiesNear[8].population + ' habitantes e CEP de ' + citiesNear[8].zip_start + ' a ' + citiesNear[8].zip_end + ' e ';
    html = html + citiesNear[9].name + ', com  ' + citiesNear[9].population + ' habitantes e CEP de ' + citiesNear[9].zip_start + ' a ' + citiesNear[9].zip_end + '. ';
    return html;
}

// Exportação default das funções como um objeto
export default {
    cityListing,
    cityDetail,
    cityDetailArea
};
