import contentService from '../services/contentService.js';
import navigation from '../../utils/navigation.js';

async function contentPage(req, res) {
    const contentSlug = req.params.page;
    const pageInfo = await contentService.contentPage(contentSlug);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/content';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    contentPage
};