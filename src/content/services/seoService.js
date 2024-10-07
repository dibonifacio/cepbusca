const TITLE_SUFIX = ' - ' + process.env.SITE_DOMAIN;

function getSeoTitleDescr(pageType, p1, p2, p3, p4) {
    let seoTitle = '';
    let seoDescr = '';
    let pageInfo = '';

    //if (currentPage > 1) {
    //    pageInfo = ' - Página ' + currentPage;
    //}

    switch(pageType) {
        case 'blog':
            seoTitle = 'Blog do Distância Cidade' + TITLE_SUFIX;
            seoDescr = 'Veja notícias, curiosidades e estatísticas sobre distância entre as cidades';
            break;        
        case 'blog_category':
            seoTitle = 'Blog - Categoria ' + p1 + TITLE_SUFIX;
            seoDescr = 'Veja notícias, curiosidades e estatísticas da categoria ' + p1 + TITLE_SUFIX;
            break;
        case 'blog_tag':
            seoTitle = 'Blog - Tag ' + p1 + TITLE_SUFIX;
            seoDescr = 'Veja notícias, curiosidades e estatísticas com a tag ' + p1 + TITLE_SUFIX;
            break;         
        case 'blog_date':
            seoTitle = 'Blog - Data ' + p1 + TITLE_SUFIX;
            seoDescr = 'Veja notícias, curiosidades e estatísticas no mês ' + p1 + TITLE_SUFIX;
            break;      
        case 'blog_author':
            seoTitle = 'Blog - Categoria ' + p1 + TITLE_SUFIX;
            seoDescr = 'Veja notícias, curiosidades e estatísticas do autor ' + p1 + TITLE_SUFIX;
            break;       
        case 'blog_post':
            seoTitle = 'Blog - ' + p1 + TITLE_SUFIX;
            seoDescr = 'Veja o artigo ' + p1 + ' em nosso Blog' + TITLE_SUFIX;
            break;
        case 'page':
            seoTitle = p1 + TITLE_SUFIX;
            seoDescr = 'Veja o conteúdo da página ' + p1 + ' em nosso site' + TITLE_SUFIX;
            break;            
      }

      return { seoTitle, seoDescr };
}

// Exportação default das funções como um objeto
export default {
    getSeoTitleDescr
};