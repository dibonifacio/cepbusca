import fs from 'fs';
import axios from 'axios';
import path from 'path';
import xml2js from 'xml2js';
import dotenv from 'dotenv';

//Carrega parâmetros do sistema
dotenv.config();

// Função para verificar se o arquivo é um sitemap de URLs
function isUrlSitemap(xml) {
  return xml.hasOwnProperty('urlset'); // Verifica se o elemento raiz é 'urlset'
}

// Função para extrair URLs do sitemap XML
function extractUrlsFromSitemap(xml) {
  const urls = [];
  if (xml.urlset && xml.urlset.url) {
    xml.urlset.url.forEach((urlEntry) => {
      if (urlEntry.loc && urlEntry.loc[0]) {
        urls.push(urlEntry.loc[0]);
      }
    });
  }
  return urls;
}

// Função para processar o arquivo XML de sitemap
function parseSitemapFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);

      xml2js.parseString(data, (err, result) => {
        if (err) return reject(err);

        // Se o arquivo for um sitemap de índice, ignore-o
        if (result.hasOwnProperty('sitemapindex')) {
          console.log(`${filePath} é um arquivo de índice de sitemap, será ignorado.`);
          return resolve([]); // Retorna um array vazio para indicar que não há URLs a processar
        }

        // Caso seja um sitemap de URLs, extrai as URLs
        if (isUrlSitemap(result)) {
          const urls = extractUrlsFromSitemap(result);
          return resolve(urls);
        }

        resolve([]); // Se não for nem 'urlset' nem 'sitemapindex', retorna vazio
      });
    });
  });
}

// Função para enviar URLs para o IndexNow
async function sendUrlsToIndexNow(urls) {
  const apiKey = '0a798bd95f244dd1ac3f4436ebde37ce'; // Substitua pela sua chave API do IndexNow

  const requestData = {
    host: 'www.distanciacidade.com.br',
    key: apiKey,
    keyLocation: 'https://www.distanciacidade.com.br/0a798bd95f244dd1ac3f4436ebde37ce.txt',
    urlList: urls,
  };

  try {
    const response = await axios.post('https://www.bing.com/indexnow', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`URLs enviadas com sucesso! Status: ${response.status}`);
  } catch (error) {
    console.error('Erro ao enviar URLs:', error.response ? error.response.data : error.message);
  }
}

// Função para processar todos os arquivos de sitemap
async function processSitemaps(sitemapDirectory) {
  // Lê todos os arquivos no diretório de sitemaps
  const files = fs.readdirSync(sitemapDirectory);

  for (const file of files) {
    const filePath = path.join(sitemapDirectory, file);
    console.log(`Processando arquivo: ${file}`);

    // Processa o arquivo de sitemap (extrai URLs ou ignora se for índice)
    const urls = await parseSitemapFile(filePath);

    // Se houver URLs, envia para o IndexNow em lotes de até 5.000 URLs
    if (urls.length > 0) {
      await sendUrlsToIndexNow(urls.slice(0, 5000)); // Ajuste o lote de URLs se necessário
    }
  }
}

// Caminho para o diretório onde os arquivos de sitemap estão armazenados
const sitemapDirectory = './public/sitemap'; // Ajuste para o caminho do seu diretório de sitemaps
processSitemaps(sitemapDirectory);
