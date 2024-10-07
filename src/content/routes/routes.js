import express from 'express';
import { param, validationResult } from 'express-validator';
import logger from '../../utils/logger.js';
import blogController from '../controllers/blogController.js';
import contentController from '../controllers/contentController.js';

const router = express.Router();

router.get('/blog', blogController.blog);

router.get('/blog/categoria/:category',
    [
        param('category').isString().isLength({ min: 2, max: 100 }).notEmpty().trim()
    ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    blogController.blogCategory(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/blog/tag/:tag',
    [
        param('tag').isString().isLength({ min: 2, max: 100 }).notEmpty().trim()
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    blogController.blogTag(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/blog/data/:year/:month',
    [
        param('year').isInt({ min: 1 }),
        param('month').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    blogController.blogDate(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/blog/post/:post',
    [
        param('post').isString().isLength({ min: 2, max: 200 }).notEmpty().trim()
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    blogController.blogPost(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/conteudo/:page',
    [
        param('page').isString().isLength({ min: 2, max: 200 }).notEmpty().trim()
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    contentController.contentPage(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);


export default router