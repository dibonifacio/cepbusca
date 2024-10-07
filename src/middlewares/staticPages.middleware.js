/* 
Middleware do Static Pages
Ele procura primeiro se a página está cacheada em disco na mesma estrutura de pastas da URL, caso não esteja, segue a execução do Node
Ele pode ser totalmente desabilitado pelo flag ACTIVE_STATIC_PAGES
Caso venha um parâmetro na url "nocache" ignora a página salva caso existe
URLs na lista de STATIC_PAGES_IGNORE serão ignoradas
*/

import fs from 'fs';
import path from 'path';
import url from 'url';

const staticPagesPath = process.env.STATIC_PAGES_PATH || './static';
const activeStaticPages = process.env.STATIC_PAGES_ACTIVE === 'true';
const staticPagesIgnore = (process.env.STATIC_PAGES_IGNORE || '').split(',');

const staticPagesMiddleware = (req, res, next) => {
    if (!activeStaticPages) {
        return next();
    }

    const urlParts = url.parse(req.url);
    const urlPath = urlParts.pathname;

    // Normalizar e verificar se a página está na lista de ignorados
    const isIgnored = staticPagesIgnore.some(prefix => urlPath.startsWith(`/${prefix}`));

    // Verificar se o parâmetro nocache está presente
    const queryParams = new URLSearchParams(urlParts.query);
    const noCache = queryParams.has('nocache');

    if (noCache || isIgnored) {
        return next();
    }

    // Construir o caminho seguro para o arquivo, garantindo que termina com '.html'
    const sanitizedPath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const finalPath = sanitizedPath.endsWith('.html') ? sanitizedPath : `${sanitizedPath}.html`;
    const fullPath = path.resolve(staticPagesPath, finalPath);

    // Prevenir acesso fora do diretório permitido
    if (!fullPath.startsWith(path.resolve(staticPagesPath))) {
        console.error('Tentativa de acesso fora do diretório permitido:', fullPath);
        return res.status(403).send('Acesso negado');
    }

    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (!err) {
            res.sendFile(fullPath, { root: '.' });
        } else {
            next(); // Se o arquivo não existir, processa a requisição dinamicamente
        }
    });
};

export default staticPagesMiddleware;
