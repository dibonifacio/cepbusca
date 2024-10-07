import sitemapService from '../services/sitemapService.js';

async function generateSitemap(req, res) {
    const statusSitemap = await sitemapService.generateSitemap();
    res.status(200).send({statusSitemap});
}


// Exportação default das funções como um objeto
export default {
    generateSitemap
};