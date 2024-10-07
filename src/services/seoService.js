const TITLE_SUFIX = ' - CEP Busca'

function getSeoTitleDescr(pageType, currentPage, p1, p2, p3, p4) {
    let seoTitle = '';
    let seoDescr = '';
    let pageInfo = '';

    if (currentPage > 1) {
        pageInfo = ' - Página ' + currentPage;
    }

    switch(pageType) {
        case 'home':
            seoTitle = 'Todos os CEPs, estados, cidades, bairros e ruas do Brasil ' + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs do Brasil, num único lugar, todos os CEPs reunidos';
            break;        
        case 'states':
            seoTitle = 'CEP dos Estados Brasileiros' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs dos 27 estados do Brasil, num único lugar, todos os CEPs reunidos' + pageInfo;
            break;
        case 'state':
            seoTitle = 'CEP de ' + p2 + ' (' + p3 + ') ' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs de ' + p3 + ' - ' + p2 + ' e de todas as ' + p1 + ' cidades de ' + p3 + pageInfo;
            break;         
        case 'state_area':
            seoTitle = 'CEP dos bairros de ' + p3 + ' - ' + p2 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs de ' + p3 + ' - ' + p2 + ' e de todos os ' + p1 + ' bairros de ' + p3 + pageInfo;
            break;      
        case 'state_address':
            seoTitle = 'CEP dos logradouros de ' + p3 + ' - ' + p2 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs de ' + p3 + ' - ' + p2 + ' e de todos os ' + p1 + ' logradouros de ' + p3 + pageInfo;
            break;       
        case 'cities':
            seoTitle = 'CEP das Cidades Brasileiros' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs das ' + p1 + ' cidades do Brasil, num único lugar, todos os CEPs reunidos' + pageInfo;
            break;
        case 'city':
            seoTitle = 'CEP ' + p2 + ' / ' + p3 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista dos ' + p1 + ' CEPs de ' + p2 + ' / ' + p3 + ', num único lugar, todos os CEPs reunidos' + pageInfo;
            break;       
        case 'city_address':
            seoTitle = 'CEP dos Logradouros de ' + p2 + ' / ' + p3 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista dos CEPs dos logradouros de ' + p2 + ' / ' + p3 + ', num único lugar. CEPs dos ' + p1 + ' logradouros' + pageInfo;
            break;    
        case 'city_area':
            seoTitle = 'CEP dos Bairros de ' + p2 + ' / ' + p3 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista dos CEPs dos bairros de ' + p2 + ' / ' + p3 + ', num único lugar, todos os CEPs reunidos. CEPs dos ' + p1 + ' bairros' + pageInfo;
            break;                           
        case 'areas':
            seoTitle = 'CEP dos Bairros Brasileiros' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs dos ' + p1 + ' bairros do Brasil, num único lugar, todos os CEPs reunidos' + pageInfo;
            break;     
        case 'area':
            seoTitle = 'CEP ' + p2 + ' - ' + p3 + ' / ' + p4 +  pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os ' + p1 + ' CEPs de ' + p2 + ' - ' + p3 + ' / ' + p4 + ', num único lugar, todos os CEPs reunidos' + pageInfo;
            break;   
        case 'addresses':
            seoTitle = 'CEP dos Logradouros Brasileiras' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os CEPs das ' + p1 + ' ruas do Brasil, num único lugar, todos os CEPs reunidos' + pageInfo;
            break;
        case 'address':
            seoTitle = 'CEP ' + p1 + ' - ' + p2 + '/' + p3 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Encontre aqui informações sobre ' + p1 + ' que fica na cidade de ' + p2 + '/' + p3 + pageInfo;
            break;            
        case 'zips':
            seoTitle = 'Todos os CEPs Brasileiros' + pageInfo + TITLE_SUFIX;
            seoDescr = 'Lista de todos os ' + p1 + ' CEPs do Brasil, num único lugar, todos os CEPs reunidos' + pageInfo;
            break;     
        case 'zip':
            seoTitle = 'CEP ' + p1 + ' - ' + p2 + ' - ' + p3 + '/' + p4 + pageInfo + TITLE_SUFIX;
            seoDescr = 'Encontre aqui informações sobre o CEP ' + p1 + ' que fica em ' + p2 + ', na cidade de ' + p3 + '/' + p4 + pageInfo;
            break;
      }

      return { seoTitle, seoDescr };
}

// Exportação default das funções como um objeto
export default {
    getSeoTitleDescr
};