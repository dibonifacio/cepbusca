import blogService from '../services/blogService.js';
import navigation from '../../utils/navigation.js';

async function blog(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_BLOG || 20;
    const pageInfo = await blogService.blog(page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogList';
    res.render(view, { pageInfo });
};

async function blogCategory(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_BLOG || 20;
    const categorySlug = req.params.category;
    const pageInfo = await blogService.blogCategory(categorySlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogList';
    res.render(view, { pageInfo });
};

async function blogTag(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_BLOG || 20;
    const tagSlug = req.params.tag;
    const pageInfo = await blogService.blogTag(tagSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogList';
    res.render(view, { pageInfo });
};

async function blogAuthor(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_BLOG || 20;
    const authorSlug = req.params.author;
    const pageInfo = await blogService.blogAuthor(authorSlug, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogList';
    res.render(view, { pageInfo });
};

async function blogPost(req, res) {
    const postSlug = req.params.post;
    const pageInfo = await blogService.blogPost(postSlug);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogPost';
    res.render(view, { pageInfo });
};

async function blogDate(req, res) {
    const page = req.params.pagina || 1; // Assume página 1 se nenhuma página for especificada
    const pageSize = process.env.PAGE_BLOG || 20;
    const year = req.params.year;
    const month = req.params.month;
    const pageInfo = await blogService.blogDate(year, month, page, pageSize);
    if (navigation.errorValidator(req, res, pageInfo)) { return res;}
    const view = 'pages/blogList';
    res.render(view, { pageInfo });
};

export default {
    blog,
    blogCategory,
    blogTag,
    blogAuthor,
    blogDate,
    blogPost
};