import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

function processPage(req, res, view, paramView) {
    // Checa se a página existe no disco e já retorna seu conteúdo
    getStaticPage(req, res);
    // Renderizar para uma string primeiro
    res.render(view, { paramView }, (err, html) => {
        if (err) {
            console.error('Erro ao renderizar página:', err);
            return res.status(500).send('Erro ao processar a página');
        }
        saveStaticPage(req, html); // Salvar a página estática em disco
        res.send(html); // Enviar a resposta HTML renderizada ao cliente
    });
    return '';
}

function getStaticPage(req, res) {
    const __dirname = process.cwd();
    const staticPagesPath = path.join(__dirname, process.env.STATIC_PAGES_PATH || 'static');
    const activeStaticPages = process.env.STATIC_PAGES_ACTIVE === 'true';
    const staticPagesIgnore = (process.env.STATIC_PAGES_IGNORE || '').split(',');

    if (!activeStaticPages) {
        return '';
    }

    const urlParts = url.parse(req.url);
    const urlPath = urlParts.pathname;

    // Normalizar e verificar se a página está na lista de ignorados
    const isIgnored = staticPagesIgnore.some(prefix => urlPath.startsWith(`/${prefix}`));

    // Verificar se o parâmetro nocache está presente
    const queryParams = new URLSearchParams(urlParts.query);
    const noCache = queryParams.has('nocache');

    if (noCache || isIgnored) {
        return '';
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
            ''; // Se o arquivo não existir, processa a requisição dinamicamente
        }
    });

    return '';
}

function saveStaticPage(req, renderedContent) {
    const __dirname = process.cwd();
    const staticPagesPath = path.join(__dirname, process.env.STATIC_PAGES_PATH || 'static');
    const staticPagesIgnore = (process.env.STATIC_PAGES_IGNORE || '').split(',');
    const saveActive = process.env.STATIC_PAGES_SAVE_ACTIVE === 'true';
    if (!saveActive) return;

    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        const basePath = path.resolve(staticPagesPath);
        let sanitizedPath = path.normalize(requestUrl.pathname).replace(/^(\.\.[\/\\])+/, '');

        // Garantir que o caminho termina com '.html'
        if (!sanitizedPath.endsWith('.html')) {
            sanitizedPath += '.html';
        }

        const fullPath = path.join(basePath, sanitizedPath);

        // Assegurar que o fullPath ainda está dentro do diretório permitido
        if (!fullPath.startsWith(basePath)) {
            throw new Error("Tentativa de acesso fora do diretório permitido.");
        }

        // Verificar ignorados
        const isIgnored = staticPagesIgnore.some(prefix => sanitizedPath.startsWith(`/${prefix}`));
        if (isIgnored) return;

        fs.mkdir(path.dirname(fullPath), { recursive: true }, (err) => {
            if (err) {
                console.error('Erro ao criar diretório:', err);
                return;
            }

            fs.writeFile(fullPath, renderedContent, (err) => {
                if (err) {
                    console.error('Erro ao salvar arquivo:', err);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao salvar a página estática:', error);
    }
};

// Exportação default das funções
export default {
    processPage
};