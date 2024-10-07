import utils from '../utils/utils.js';
import seoService from './seoService.js';
import urlService from './urlService.js';
import cityModel from '../models/cityModel.js';
import blogModel from '../content/models/blogModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function home() {
    const pageType = 'home';
    const posts = await blogModel.getLastPosts(3);
    posts.forEach(post => {
        post['_url'] = '/blog/post/' + post.slug;
        post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
            }).format(post['published_at']);
    });
    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType);
    const pageUrl = urlService.getPageUrl(pageType);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    
    const pageTitle = 'CEP Busca';

    const contentUpper = '';

    const contentBottom = '';

    const contentSidebar = '';

    let cities = await cityModel.getCitiesPopulation(50);
    cities.forEach(city => {
        city['_url'] = urlService.getPageUrl('city', city.slug_full);
        city['_url_state'] = urlService.getPageUrl('state', city.state_slug);
        city['population'] = city['population'].toLocaleString(locale);
    });

    const pageInfo = {
        posts: posts,
        cities: cities,
        seo: seo,
        pageTitle: pageTitle,
        contentUpper: contentUpper,
        contentBottom: contentBottom,
        contentSidebar: contentSidebar
    }

    return pageInfo;
}


// Exportação default das funções como um objeto
export default {
    home
};
