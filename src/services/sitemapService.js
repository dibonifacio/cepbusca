import urlService from './urlService.js';
import cityModel from '../models/cityModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function generateSitemap() {
    
    let resultSitemap = '';

    console.log('Sitemap XML Generator');

    let cities = await cityModel.getAllCitiesSitemap(1,100);

    resultSitemap = resultSitemap + await generateSitemapIndex(cities);
    
    for (const city of cities) {
        await generateSitemapUrls(city.slug_full);
    }

    return resultSitemap;
}


async function generateSitemapIndex(cities) {
    const siteUrl = process.env.SITE_URL;
    const sitemapFileName = 'sitemap-cidades.xml';
    const baseUrl = siteUrl + '/sitemap/';
    console.log('');
    console.log('Index: ' + sitemapFileName);
    let xmlSitemapHeader = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/assets/css/dbcorp-sitemap.xsl" ?>';
    xmlSitemapHeader = xmlSitemapHeader + `
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    let sitemap = xmlSitemapHeader;
    const now = new Date();
    const isoDate = now.toISOString();

    cities.forEach(city => {
        sitemap = sitemap + `
        <sitemap>
            <loc>${baseUrl}${city.slug_full}.xml</loc>
            <lastmod>${isoDate}</lastmod>
        </sitemap>`;
    });
    sitemap = sitemap + `
    </sitemapindex>`;
    await saveSitemapFile(sitemapFileName, sitemap);
    console.log('File: ' + sitemapFileName + ' : ' + cities.length + ' Lines');

    return sitemapFileName + ' : ' + cities.length + ' Lines';
}

async function generateSitemapUrls(citySlug) {
    const siteUrl = process.env.SITE_URL;
    const baseUrl = siteUrl;
    const sitemapFileName = citySlug + '.xml';
    console.log('Loc: ' + citySlug);
    let xmlSitemapHeader = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/assets/css/dbcorp-sitemap.xsl" ?>';
    xmlSitemapHeader = xmlSitemapHeader + `
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    let sitemap = xmlSitemapHeader;
    let cities = await cityModel.getAllCities(1,10000);
    const now = new Date();
    const isoDate = now.toISOString();
    cities.forEach(city => {
        if (citySlug != city.slug_full) {
        sitemap = sitemap + `
            <url>
                <loc>${baseUrl}/distancia-entre-${citySlug}-e-${city.slug_full}</loc>
                <lastmod>${isoDate}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.6</priority>
            </url>`;
        }
    });    
    sitemap = sitemap + `
    </urlset>`;
    await saveSitemapFile(sitemapFileName, sitemap);
    console.log('File: ' + sitemapFileName + ' : ' + cities.length + ' Lines');
    return sitemapFileName + ' : ' + cities.length + ' Lines';
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