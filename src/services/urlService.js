function getPageUrl(pageType, slug, slug2) {
    let pageUrl = '';
    
    switch(pageType) {
        case 'states':
            pageUrl = '/estados';
            break;
        case 'cities':
            pageUrl = '/cidades';
            break;
        case 'areas':
            pageUrl = '/bairros';
            break;    
        case 'addresses':
            pageUrl = '/logradouros';
            break;                       
        case 'zips':
            pageUrl = '/ceps';            
            break;
        case 'state':
            pageUrl = '/cep/'+slug;
            break;      
        case 'state_area':
            pageUrl = '/cep/'+slug+'/bairros';
            break;  
        case 'state_address':
            pageUrl = '/cep/'+slug+'/logradouros';
            break;  
        case 'state_zip':
            pageUrl = '/cep/'+slug+'/ceps';
            break;  
        case 'city':
            pageUrl = '/cep'+slug;
            break;    
        case 'city_area':
            pageUrl = '/cep'+slug+'/bairros';
            break;  
        case 'city_address':
            pageUrl = '/cep'+slug+'/logradouros';
            break;  
        case 'city_zip':
            pageUrl = '/cep'+slug;
            break;              
        case 'area':
            pageUrl = '/cep'+slug;
            break;       
        case 'address':
            pageUrl = '/cep'+slug;
            break;         
        case 'zip':
            pageUrl = '/cep'+slug;
            break;                                 
        case 'city_distance':
            pageUrl = '/distancia-entre-'+slug+'-e-'+slug2;
            break;               
        case 'site_cepsdobrasil_city':
            pageUrl = 'https://www.cepsdobrasil.com.br/cep/' + slug.toLowerCase();
            break;     
        case 'site_dddsdobrasil_city':
            pageUrl = 'https://www.dddsdobrasil.com.br/ddd/' + slug.toLowerCase();
            break;          
        case 'site_dddsdobrasil_ddd':
            pageUrl = 'https://www.dddsdobrasil.com.br/ddd-' + slug;
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