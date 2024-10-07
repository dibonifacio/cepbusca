import urlService from './urlService.js';
import stateModel from '../models/stateModel.js';
import cityModel from '../models/cityModel.js';
import areaModel from '../models/areaModel.js';
import addressModel from '../models/addressModel.js';
import zipModel from '../models/zipModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function generateSitemap() {
    
    let resultSitemap = '';
    let sitemapFileName = '';
    let sitemapFileUrl = '';
    let itensQty = 0;
    let itens = null;

    console.log('Sitemap XML Generator');

    // State
    sitemapFileName = 'state-sitemap.xml';
    sitemapFileUrl = "state-sitemap-";
    itensQty = await stateModel.getAllStatesCount();
    resultSitemap = resultSitemap + await generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty);
    resultSitemap = resultSitemap + await generateSitemapUrls('state', sitemapFileUrl, stateModel, itensQty);

    // City
    sitemapFileName = 'city-sitemap.xml';
    sitemapFileUrl = "city-sitemap-";
    itensQty = await cityModel.getAllCitiesCount();
    resultSitemap = resultSitemap + await generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty);
    resultSitemap = resultSitemap + await generateSitemapUrls('city', sitemapFileUrl, cityModel, itensQty);

    // Area
    sitemapFileName = 'area-sitemap.xml';
    sitemapFileUrl = "area-sitemap-";
    itensQty = await areaModel.getAllAreasCount();
    resultSitemap = resultSitemap + await generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty);
    resultSitemap = resultSitemap + await generateSitemapUrls('area', sitemapFileUrl, areaModel, itensQty);

    // Address
    sitemapFileName = 'address-sitemap.xml';
    sitemapFileUrl = "address-sitemap-";
    itensQty = await addressModel.getAllAddressCount();
    resultSitemap = resultSitemap + await generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty);
    resultSitemap = resultSitemap + await generateSitemapUrls('address', sitemapFileUrl, addressModel, itensQty);

    // Zip
    sitemapFileName = 'zip-sitemap.xml';
    sitemapFileUrl = "zip-sitemap-";
    itensQty = await zipModel.getAllZipCount();
    resultSitemap = resultSitemap + await generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty);
    resultSitemap = resultSitemap + await generateSitemapUrls('zip', sitemapFileUrl, zipModel, itensQty);


    return resultSitemap;
}


async function generateSitemapIndex(sitemapFileName, sitemapFileUrl, itensQty) {
    const pageSize = process.env.PAGE_SIZE_SITEMAP || 5000;
    const baseUrl = "https://www.cepbusca.com.br/sitemap";
    console.log('');
    console.log('Index: ' + sitemapFileName);
    let xmlSitemapHeader = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/assets/css/dbcorp-sitemap.xsl" ?>';
    xmlSitemapHeader = xmlSitemapHeader + `
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    let sitemap = xmlSitemapHeader;
    const now = new Date();
    const isoDate = now.toISOString();
    const totalPages = Math.ceil(itensQty / pageSize);
    for (let i = 1; i <= totalPages; i++) {
        sitemap = sitemap + `
        <sitemap>
            <loc>${baseUrl}${sitemapFileUrl}${i}.xml</loc>
            <lastmod>${isoDate}</lastmod>
        </sitemap>`;
    }
    sitemap = sitemap + `
    </sitemapindex>`;
    await saveSitemapFile(sitemapFileName, sitemap);
    console.log('File: ' + sitemapFileName + ' : ' + totalPages + ' Lines');
    return sitemapFileName + ' : ' + totalPages + ' Lines';
}

async function generateSitemapUrls(sitemapType, sitemapBaseFileName, model, itensQty) {
    const pageSize = process.env.PAGE_SIZE_SITEMAP || 5000;
    const baseUrl = "https://www.cepsdobrasil.com.br";
    console.log('Loc: ' + sitemapType);
    let xmlSitemapHeader = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/assets/css/dbcorp-sitemap.xsl" ?>';
    xmlSitemapHeader = xmlSitemapHeader + `
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    let itens = null;
    let sitemap = '';
    let url = '';
    let page = 0;
    let sitemapFileName = '';
    const now = new Date();
    const isoDate = now.toISOString();
    const totalPages = Math.ceil(itensQty / pageSize);
    for (let i = 1; i <= totalPages; i++) {
        sitemap = xmlSitemapHeader;
        page = i;
        
        switch(sitemapType) {
            case 'state':
                itens = await model.getAllStates();
                break;
            case 'city':
                itens = await model.getAllCitiesSitemap(page, pageSize);
                break;
            case 'area':
                itens = await model.getAllAreasSitemap(page, pageSize);
                break;    
            case 'address':
                itens = await model.getAllAddressSitemap(page, pageSize);
                break;   
            case 'zip':
                itens = await model.getAllZipSitemap(page, pageSize);
                break;               
        }
        
        itens.forEach(item => {
            if (sitemapType == 'state') {
                url = urlService.getPageUrl(sitemapType, item.slug);
            } else {
                url = urlService.getPageUrl(sitemapType, item.slug_full);
            }
            sitemap = sitemap + `
            <url>
                <loc>${baseUrl}${url}</loc>
                <lastmod>${isoDate}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.6</priority>
            </url>`;
        });

        sitemap = sitemap + `
        </urlset>`;
        sitemapFileName = sitemapBaseFileName + i + '.xml';
        await saveSitemapFile(sitemapFileName, sitemap);
        console.log('File: ' + sitemapFileName + ' : ' + itens.length + ' Lines');
    }
    
    return sitemapBaseFileName + ' : ' + totalPages + ' Lines';
}

async function saveSitemapFile(sitemapFileName, sitemap) {
    // Caminho para a pasta onde o arquivo será salvo, ajustando para sair de 'src/services' e ir até 'public/assets/sitemap'
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const directoryPath = path.join(__dirname, '..', '..', 'public', 'sitemap');
    const filePath = path.join(directoryPath, sitemapFileName);
    // Verificar se a pasta existe
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
    fs.writeFileSync(filePath, sitemap, 'utf8');
}


// Exportação default das funções como um objeto
export default {
    generateSitemap
};