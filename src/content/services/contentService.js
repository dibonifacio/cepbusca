import utils from '../../utils/utils.js';
import seoService from './seoService.js';
import urlService from './urlService.js';
import contentModel from '../models/contentModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function contentPage(pageSlug) {
    const pageType = 'page';
    let page = await contentModel.getPageBySlug(pageSlug);
    if (!page) { return 'not_found'; }
    let pages = await contentModel.getAllPages();
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, page.title);

    // Inserindo URLs
    pages.forEach(page => {
        page['_url'] = urlService.getPageUrl(pageType, page.slug);
    });

    const pageUrl = urlService.getPageUrl(pageType, pageSlug);
    const pageTitle = '';
    const pageDescription = '';
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: pageUrl }
    ];

    const pageInfo = {
        page: page,
        pages: pages,
        title: pageTitle,
        description: pageDescription,
        seo: seo,
        breadcrumb: breadcrumb
    }
    return pageInfo;
}

// Exportação default das funções como um objeto
export default {
    contentPage
};
