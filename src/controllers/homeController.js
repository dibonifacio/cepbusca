import homeService from '../services/homeService.js';

async function home(req, res) {
    const pageInfo = await homeService.home();
    const view = 'pages/home';
    res.render(view, { pageInfo });
}

// Exportação default das funções como um objeto
export default {
    home
};