import utils from '../../utils/utils.js';
import seoService from './seoService.js';
import urlService from './urlService.js';
import blogModel from '../models/blogModel.js';

const locale = process.env.LOCALE || 'pt-BR';

async function blog(page, pageSize) {
    const pageType = 'blog';
    let posts = await blogModel.getAllPosts(page, pageSize);
    let categories = await blogModel.getAllCategories();
    let tags = await blogModel.getAllTags();
    let dates = await blogModel.getAllDates();

    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType);
    const pageUrl = urlService.getPageUrl(pageType);
    const seo = {
        title: seoTitle,
        description: seoDescr,
        canonical: pageUrl,
        staticUrl: process.env.STATIC_URL,
        siteUrl: process.env.SITE_URL
    };
    const pageTitle = 'Blog do site Distãncia Cidade';
    const pageDescription = 'Veja aqui curiosidades, notícias e estatísticas sobre <strong>Distância entre  Cidades</strong>';
    const breadcrumb = [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: pageUrl }
    ];
    
    // Inserindo URLs
    posts.forEach(post => {
        post['_url'] = urlService.getPageUrl('post', post.slug);
        post['_url_author'] = urlService.getPageUrl('author', post.author_slug);
        post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
            }).format(post['published_at']);
    });
    categories.forEach(category => {
        category['_url'] = urlService.getPageUrl('category', category.slug);
    });
    tags.forEach(tag => {
        tag['_url'] = urlService.getPageUrl('tag', tag.slug);
    });
    dates.forEach(date => {
        date['_url'] = urlService.getPageUrl('date', date.slug);
    });

    const pageInfo = {
        title: pageTitle,
        description: pageDescription,
        posts: posts,
        categories: categories,
        tags: tags,
        dates: dates,
        seo: seo,
        breadcrumb: breadcrumb    
    }
    return pageInfo;
}

async function blogCategory(categorySlug, page, pageSize) {
    const pageType = 'blog_category';
    let category = await blogModel.getCategoryBySlug(categorySlug);
    if (!category) { return 'not_found'; }
    let posts = await blogModel.getPostsByCategory(category.id, page, pageSize);
    let categories = await blogModel.getAllCategories();
    let tags = await blogModel.getAllTags();
    let dates = await blogModel.getAllDates();

    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, category.name);
    const pageUrl = urlService.getPageUrl(pageType);
    const pageTitle = 'Categoria: ' + category.name;
    const pageDescription = category.description;
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
    
    // Inserindo URLs
    posts.forEach(post => {
        post['_url'] = urlService.getPageUrl('post', post.slug);
        post['_url_author'] = urlService.getPageUrl('author', post.author_slug);
        post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(post['published_at']);
    });
    categories.forEach(category => {
        category['_url'] = urlService.getPageUrl('category', category.slug);
    });
    tags.forEach(tag => {
        tag['_url'] = urlService.getPageUrl('tag', tag.slug);
    });
    dates.forEach(date => {
        date['_url'] = urlService.getPageUrl('date', date.slug);
    });

    const pageInfo = {
        title: pageTitle,
        description: pageDescription,
        posts: posts,
        categories: categories,
        tags: tags,
        dates: dates,
        seo: seo,
        breadcrumb: breadcrumb    
    }
    return pageInfo;
}


async function blogTag(tagSlug, page, pageSize) {
    const pageType = 'blog_tag';
    let tag = await blogModel.getTagBySlug(tagSlug);
    if (!tag) { return 'not_found'; }
    let posts = await blogModel.getPostsByTag(tag.id, page, pageSize);
    let categories = await blogModel.getAllCategories();
    let tags = await blogModel.getAllTags();
    let dates = await blogModel.getAllDates();

    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, tag.name);
    const pageUrl = urlService.getPageUrl(pageType);
    const pageTitle = 'Tag: ' + tag.name;
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
    
    // Inserindo URLs
    posts.forEach(post => {
        post['_url'] = urlService.getPageUrl('post', post.slug);
        post['_url_author'] = urlService.getPageUrl('author', post.author_slug);
        post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
            }).format(post['published_at']);
    });
    categories.forEach(category => {
        category['_url'] = urlService.getPageUrl('category', category.slug);
    });
    tags.forEach(tag => {
        tag['_url'] = urlService.getPageUrl('tag', tag.slug);
    });
    dates.forEach(date => {
        date['_url'] = urlService.getPageUrl('date', date.slug);
    });

    const pageInfo = {
        title: pageTitle,
        description: pageDescription,
        posts: posts,
        categories: categories,
        tags: tags,
        dates: dates,
        seo: seo,
        breadcrumb: breadcrumb    
    }
    return pageInfo;
}

async function blogDate(year, month, page, pageSize) {
    const pageType = 'blog_date';
    //let category = await blogModel.getCategoryBySlug(categorySlug);
    //if (!category) { return 'not_found'; }
    let posts = await blogModel.getPostsByDate(year, month, page, pageSize);
    let categories = await blogModel.getAllCategories();
    let tags = await blogModel.getAllTags();
    let dates = await blogModel.getAllDates();

    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, year + '/' + month);
    const pageUrl = urlService.getPageUrl(pageType);
    const pageTitle = 'Data: ' + year + '/' + month;
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
    
    // Inserindo URLs
    posts.forEach(post => {
        post['_url'] = urlService.getPageUrl('post', post.slug);
        post['_url_author'] = urlService.getPageUrl('author', post.author_slug);
        post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(post['published_at']);
    });
    categories.forEach(category => {
        category['_url'] = urlService.getPageUrl('category', category.slug);
    });
    tags.forEach(tag => {
        tag['_url'] = urlService.getPageUrl('tag', tag.slug);
    });
    dates.forEach(date => {
        date['_url'] = urlService.getPageUrl('date', date.slug);
    });

    const pageInfo = {
        title: pageTitle,
        description: pageDescription,
        posts: posts,
        categories: categories,
        tags: tags,
        dates: dates,
        seo: seo,
        breadcrumb: breadcrumb    
    }
    return pageInfo;
}

async function blogPost(postSlug) {
    const pageType = 'blog_post';
    let post = await blogModel.getPostBySlug(postSlug);
    if (!post) { return 'not_found'; }
    let categories = await blogModel.getAllCategories();
    let tags = await blogModel.getAllTags();
    let dates = await blogModel.getAllDates();

    const { seoTitle, seoDescr } = seoService.getSeoTitleDescr(pageType, post.title);
    const pageUrl = urlService.getPageUrl(pageType);
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
    
    post['published_at'] = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(post['published_at']);
    // Inserindo URLs
    categories.forEach(category => {
        category['_url'] = urlService.getPageUrl('category', category.slug);
    });
    tags.forEach(tag => {
        tag['_url'] = urlService.getPageUrl('tag', tag.slug);
    });
    dates.forEach(date => {
        date['_url'] = urlService.getPageUrl('date', date.slug);
    });

    const pageInfo = {
        title: pageTitle,
        description: pageDescription,
        post: post,
        categories: categories,
        tags: tags,
        dates: dates,
        seo: seo,
        breadcrumb: breadcrumb    
    }
    return pageInfo;
}

// Exportação default das funções como um objeto
export default {
    blog,
    blogCategory,
    blogTag,
    blogDate,
    blogPost
};
