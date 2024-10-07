import utils from '../utils/utils.js';
import seoService from './seoService.js';
import urlService from './urlService.js';
import stateModel from '../models/stateModel.js';
import cityModel from '../models/cityModel.js';
import areaModel from '../models/areaModel.js';
import addressModel from '../models/addressModel.js';
import zipModel from '../models/zipModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function stateListing() {
    const pageType = 'states';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, 1, '27');
    const pageUrl = urlService.getPageUrl(pageType);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'Estados', url: pageUrl }
    ];
    
    const pageTitle = 'CEPs dos Estados Brasileiros';

    const contentUpper = 'Veja os CEPs dos 27 Estados Brasileiros';

    const contentBottom = '';

    const contentSidebar = '';

    let states = await stateModel.getAllStates();
    // Inserindo URLs
    states.forEach(state => {
        state['_url'] = urlService.getPageUrl('state', state.slug);
    });

    const pageInfo = {
        states: states,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        contentSidebar: contentSidebar
    }

    return pageInfo;
}

async function stateDetail(slug, page, pageSize) {
    // Checa se Existe
    let state = await stateModel.getStateBySlug(slug);
    if (!state) { return 'not_found'; }
    let cities = await cityModel.getCitiesByState(state.id, page, pageSize);
    let citiesPopulation = await cityModel.getCitiesByStatePopulation(state.id, 10);
    let capital = await cityModel.getCapitalByState(state.id);
    let cityQty = await cityModel.getCitiesByStateCount(state.id);
    const totalPages = Math.max(1, Math.ceil(cityQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    cities.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
    });
    citiesPopulation.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
        city['population'] = city['population'].toLocaleString(locale);
    });

    const pageType = 'state';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, cityQty.toLocaleString(locale), state.name, state.state_code);
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
        { name: state.state_code, url: urlService.getPageUrl('state', state.slug) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1,totalPages),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1,totalPages),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages,totalPages),
    };

    const pageTitle = 'CEP de ' + state.name + ' (' + state.state_code + ')';

    const contentUpper = ``;

    const contentBottom = ``;

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    capital.population = capital.population.toLocaleString(locale);
    state.city_qty = state.city_qty.toLocaleString(locale);
    state.area_qty = state.area_qty.toLocaleString(locale);
    state.address_qty = state.address_qty.toLocaleString(locale);
    state.zip_qty = state.zip_qty.toLocaleString(locale);
    state['_urlState'] = urlService.getPageUrl('state', state.slug);
    state['_urlStateArea'] = urlService.getPageUrl('state_area', state.slug);
    state['_urlStateAddress'] = urlService.getPageUrl('state_address', state.slug);
    state['_urlStateZip'] = urlService.getPageUrl('state_zip', state.slug);
    const zipBiggestCities = getBiggestCities(state, citiesPopulation);

    const pageInfo = {
        state: state,
        cities: cities,
        capital: capital,
        citiesPopulation: citiesPopulation,
        zipBiggestCities: zipBiggestCities,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function stateDetailArea(slug, page, pageSize) {
    // Checa se Existe
    let state = await stateModel.getStateBySlug(slug);
    if (!state) { return 'not_found'; }
    let areas = await areaModel.getAreasByState(state.id, page, pageSize);
    let citiesPopulation = await cityModel.getCitiesByStatePopulation(state.id, 10);
    let areaQty = await areaModel.getAreasByStateCount(state.id);
    const totalPages = Math.max(1, Math.ceil(areaQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    areas.forEach(area => {
        area['_url'] = urlService.getPageUrl('area', area.slug_full);
        area['_urlCity'] = urlService.getPageUrl('city', area.city_slug);
    });
    citiesPopulation.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
    });
    const pageType = 'state_area';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, areaQty.toLocaleString(locale), state.name, state.state_code);
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
        { name: state.state_code, url: urlService.getPageUrl('state', state.slug) },
        { name: 'Bairros', url: urlService.getPageUrl('state_area', state.slug) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages),
    };
    const pageTitle = 'CEPs dos Bairros do Estado ' + state.name + ' (' + state.state_code + ')';
    const contentUpper = ``;
    const contentBottom = ``;

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    state.city_qty = state.city_qty.toLocaleString(locale);
    state.area_qty = state.area_qty.toLocaleString(locale);
    state.address_qty = state.address_qty.toLocaleString(locale);
    state.zip_qty = state.zip_qty.toLocaleString(locale);
    state['_urlState'] = urlService.getPageUrl('state', state.slug);
    state['_urlStateArea'] = urlService.getPageUrl('state_area', state.slug);
    state['_urlStateAddress'] = urlService.getPageUrl('state_address', state.slug);
    state['_urlStateZip'] = urlService.getPageUrl('state_zip', state.slug);

    const pageInfo = {
        state: state,
        areas: areas,
        citiesPopulation: citiesPopulation,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}


async function stateDetailAddress(slug, page, pageSize) {
    // Checa se Existe
    let state = await stateModel.getStateBySlug(slug);
    if (!state) { return 'not_found'; }
    let address = await addressModel.getAddressByState(state.id, page, pageSize);
    let citiesPopulation = await cityModel.getCitiesByStatePopulation(state.id, 10);
    let addressQty = await addressModel.getAddressByStateCount(state.id);
    const totalPages = Math.max(1, Math.ceil(addressQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    address.forEach(addr => {
        addr['_url'] = urlService.getPageUrl('address', addr.slug_full);
        addr['_url_city'] = urlService.getPageUrl('city', addr.city_slug);
    });
    citiesPopulation.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
    });
    const pageType = 'state_address';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, addressQty.toLocaleString(locale), state.name, state.state_code);
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
        { name: state.state_code, url: urlService.getPageUrl('state', state.slug) },
        { name: 'Logradouros', url: urlService.getPageUrl('state_address', state.slug) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages),
    };
    const pageTitle = 'CEPs dos Logradouros do Estado ' + state.name + ' (' + state.state_code + ')';
    const contentUpper = ``;
    const contentBottom = ``;

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    state.city_qty = state.city_qty.toLocaleString(locale);
    state.area_qty = state.area_qty.toLocaleString(locale);
    state.address_qty = state.address_qty.toLocaleString(locale);
    state.zip_qty = state.zip_qty.toLocaleString(locale);
    state['_urlState'] = urlService.getPageUrl('state', state.slug);
    state['_urlStateArea'] = urlService.getPageUrl('state_area', state.slug);
    state['_urlStateAddress'] = urlService.getPageUrl('state_address', state.slug);
    state['_urlStateZip'] = urlService.getPageUrl('state_zip', state.slug);

    const pageInfo = {
        state: state,
        address: address,
        citiesPopulation: citiesPopulation,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

async function stateDetailZip(slug, page, pageSize) {
    // Checa se Existe
    let state = await stateModel.getStateBySlug(slug);
    if (!state) { return 'not_found'; }
    let zips = await zipModel.getZipByState(state.id, page, pageSize);
    let zipQty = await zipModel.getZipByStateCount(state.id);
    const totalPages = Math.max(1, Math.ceil(zipQty / pageSize)); // se vier zero de qty, tem que forçar para marcar 1 em totalPages
    page = Number(page);
    if (page < 1 || page > totalPages) { return 'page_out_bounds'; }
    // Inserindo URLs
    zips.forEach(zip => {
        zip['_url'] = urlService.getPageUrl('zip', zip.slug_full);
        zip['_url_area'] = urlService.getPageUrl('area', zip.area_slug);
        zip['_url_address'] = urlService.getPageUrl('address', zip.address_slug);
        zip['_url_city'] = urlService.getPageUrl('city', zip.city_slug);
    });
    const pageType = 'state_zip';
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page, state.name, state.state_code);
    const pageUrl = urlService.getPageUrl(pageType, slug);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: urlService.getPaginationUrl(pageUrl, page),
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: state.state_code, url: urlService.getPageUrl('state', state.slug) },
        { name: 'CEPs', url: urlService.getPageUrl('state_zip', state.slug) }
    ];
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        firstPage: pageUrl,
        previousPage: urlService.getPaginationUrl(pageUrl,page - 1),
        nextPage: urlService.getPaginationUrl(pageUrl,page + 1),
        lastPage: urlService.getPaginationUrl(pageUrl,totalPages),
    };
    const pageTitle = 'CEPs do Estado ' + state.name + ' (' + state.state_code + ')';
    const contentUpper = ``;
    const contentBottom = ``;

    // Formatando conteúdos e incluíndo URLs antes de enviar para a View
    state.city_qty = state.city_qty.toLocaleString(locale);
    state.area_qty = state.area_qty.toLocaleString(locale);
    state.address_qty = state.address_qty.toLocaleString(locale);
    state.zip_qty = state.zip_qty.toLocaleString(locale);
    state['_urlState'] = urlService.getPageUrl('state', state.slug);
    state['_urlStateArea'] = urlService.getPageUrl('state_area', state.slug);
    state['_urlStateAddress'] = urlService.getPageUrl('state_address', state.slug);
    state['_urlStateZip'] = urlService.getPageUrl('state_zip', state.slug);

    const pageInfo = {
        state: state,
        zips: zips,
        seo: seo,
        breadcrumb: breadcrumb,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        pagination: pagination
    }

    return pageInfo;
}

function getBiggestCities(state, citiesPopulation) {
    let html = '<p>A maior cidade de ' + state.name + ' é ' + citiesPopulation[0].name + ', com uma população total de ' + citiesPopulation[0].population + ' habitantes e CEP de ' + citiesPopulation[0].zip_start + ' a ' + citiesPopulation[0].zip_end + '. ' + citiesPopulation[1].name + ' é a segunda maior cidade do estado de ' + state.name + ' com CEPs de ' + citiesPopulation[1].zip_start + ' e ' + citiesPopulation[1].zip_end + '</p>';
    html = html + '<p>Completando a lista das 10 maiores cidades de ' + state.name + ' temos ainda ';
    html = html + citiesPopulation[2].name + ', com uma população total de ' + citiesPopulation[2].population + ' habitantes e CEP de ' + citiesPopulation[2].zip_start + ' a ' + citiesPopulation[2].zip_end + ' e ';
    html = html + citiesPopulation[3].name + ', com ' + citiesPopulation[3].population + ' habitantes na quarta posição e CEP de ' + citiesPopulation[3].zip_start + ' a ' + citiesPopulation[3].zip_end + '. ';
    html = html + citiesPopulation[4].name + ' em quinto lugar com uma população total de ' + citiesPopulation[4].population + ' habitantes e CEP de ' + citiesPopulation[4].zip_start + ' a ' + citiesPopulation[4].zip_end + ', ';
    html = html + citiesPopulation[5].name + ', em sexto com ' + citiesPopulation[5].population + ' habitantes e CEP de ' + citiesPopulation[5].zip_start + ' a ' + citiesPopulation[5].zip_end + ', ';
    html = html + citiesPopulation[6].name + ' que tem CEP de ' + citiesPopulation[6].zip_start + ' a ' + citiesPopulation[6].zip_end + ' e uma população total de ' + citiesPopulation[6].population + ' habitantes. </p>';
    html = html + '<p>Em oitavo lugar vem ' + citiesPopulation[7].name + ', com uma população total de ' + citiesPopulation[7].population + ' habitantes e CEP de ' + citiesPopulation[7].zip_start + ' a ' + citiesPopulation[7].zip_end + ', ';
    html = html + citiesPopulation[8].name + ', com uma população total de ' + citiesPopulation[8].population + ' habitantes e CEP de ' + citiesPopulation[8].zip_start + ' a ' + citiesPopulation[8].zip_end + ' e ';
    html = html + citiesPopulation[9].name + ', com  ' + citiesPopulation[9].population + ' habitantes e CEP de ' + citiesPopulation[9].zip_start + ' a ' + citiesPopulation[9].zip_end + '. ';
    return html;
}

// Exportação default das funções como um objeto
export default {
    stateListing,
    stateDetail,
    stateDetailArea,
    stateDetailAddress,
    stateDetailZip
};
