function getPageUrl(pageType, slug) {
    let pageUrl = '';
    
    switch(pageType) {
        case 'blog':
            pageUrl = '/blog';
            break;
        case 'category':
            pageUrl = '/blog/categoria/'+slug;
            break;    
        case 'tag':
                pageUrl = '/blog/tag/'+slug;
            break;               
        case 'date':
                pageUrl = '/blog/data/'+slug;
            break;     
        case 'author':
                pageUrl = '/blog/autor/'+slug;
            break;          
        case 'post':
                pageUrl = '/blog/post/'+slug;
            break;
        case 'page':
                pageUrl = '/conteudo/'+slug;
            break;                                                     
      }
      if (slug == null) {
        pageUrl = '';
      }
      return pageUrl;
}

function getPaginationUrl(pageUrl, currentPage, totalPages) {
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    if (currentPage == 1)
        return pageUrl;
    else
        return pageUrl + '/pagina/' + currentPage;
}


// Exportação default das funções como um objeto
export default {
    getPageUrl,
    getPaginationUrl
};