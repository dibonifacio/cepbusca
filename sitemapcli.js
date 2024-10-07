// importing package dependencies
import sitemapService from './src/services/sitemapService.js';
import dotenv from 'dotenv';

//Carrega parâmetros do sistema
dotenv.config();

await sitemapService.generateSitemap();
