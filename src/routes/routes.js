import express from 'express';
import { param, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import homeController from '../controllers/homeController.js';
import stateController from '../controllers/stateController.js';
import cityController from '../controllers/cityController.js';
import areaController from '../controllers/areaController.js';
import addressController from '../controllers/addressController.js';
import zipController from '../controllers/zipController.js';
import sitemapController from '../controllers/sitemapController.js';
import errorController from '../controllers/errorController.js';

const router = express.Router();

// Lista de siglas de estados brasileiros
const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

// Rota de checagem de status
router.get("/status", (req, res) => {
    logger.info("Checking the APP status: Everything is OK");
    res.status(200).send({
        status: "UP",
        message: "The App is up and running!"
    });
});

// Página de erro
router.get('/erro-servidor', errorController.getErrorPage);

// Home
router.get('/', homeController.home);

router.get('/estados', stateController.stateList);

router.get('/cidades', cityController.cityList);
router.get('/cidades/pagina/:page', 
    [
        param('page').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    cityController.cityList(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/bairros',  areaController.areaList);
router.get('/bairros/pagina/:pagina', 
    [
        param('pagina').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
    }
    areaController.areaList(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);


router.get('/logradouros',  addressController.addressList);
router.get('/logradouros/pagina/:pagina', 
    [
        param('pagina').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
    }
    addressController.addressList(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/ceps',  zipController.zipList);
router.get('/ceps/pagina/:pagina', 
    [
        param('pagina').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
    }
    zipController.zipList(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);


// URLs de CEP
router.get('/cep/:cep', (req, res, next) => {
  const { cep } = req.params;
  // Regex para verificar se o CEP está no formato 9999-999
  const cepRegex = /^\d{5}-\d{3}$/;
  if (cepRegex.test(cep)) {
      next(); // O formato está correto, passa para o controlador
  } else {
      next('route'); // O formato está incorreto, tenta a próxima rota
  }
}, zipController.zipDetail);

router.get('/ceps/:cep/pagina/:pagina', (req, res, next) => {
  const { cep } = req.params;
  const cepRegex = /^\d{5}-\d{3}$/; // Regex para verificar se o CEP está no formato 9999-999
  if (cepRegex.test(cep)) {
      next(); // O formato está correto, passa para o controlador
  } else {
      next('route'); // O formato está incorreto, tenta a próxima rota
  }
}, zipController.zipDetail);


// URLs de ESTADO
router.get('/cep/:estado',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/bairros',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailArea(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/bairros/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailArea(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/logradouros',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailAddress(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/logradouros/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailAddress(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/ceps',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailZip(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/ceps/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  stateController.stateDetailZip(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);


// URLs de CIDADE
router.get('/cep/:estado/:cidade',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  cityController.cityDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/:cidade/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn( `Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  cityController.cityDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);


router.get('/cep/:estado/:cidade/bairros',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  cityController.cityDetailArea(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);


router.get('/cep/:estado/:cidade/bairros/pagina/:pagina',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
      param('pagina').isInt({ min: 1 })
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  cityController.cityDetailArea(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);


// URLs de BAIRRO
router.get('/cep/:estado/:cidade/bairro/:bairro',
  [
      param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
      param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
      param('bairro').isString().isLength({ min: 2, max: 200 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
  }
  areaController.areaDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/cep/:estado/:cidade/bairro/:bairro/pagina/:pagina',
  [
    param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
    param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
    param('bairro').isString().isLength({ min: 2, max: 200 }).notEmpty().trim(),
    param('pagina').isInt({ min: 1 })
  ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
    }
    areaController.areaDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

// URLs de LOGRADOURO
router.get('/cep/:estado/:cidade/:logradouro',
  [
    param('estado').isString().isLength({ min: 2, max: 2 }).notEmpty().trim(),
    param('cidade').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
    param('logradouro').isString().isLength({ min: 2, max: 200 }).notEmpty().trim()
  ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/pagina-de-erro'); // Redireciona para uma página de erro ou outra URL
    }
    addressController.addressDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);


// URLs de Distância
router.get('/distancia/:city',
  [
      param('city').isString().isLength({ min: 2, max: 200 }).notEmpty().trim()
  ],    
(req, res, next) => {
  const errors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
    return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
  }
  cityController.cityDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
}
);

router.get('/distancia/:city/pagina/:page',
    [
        param('city').isString().isLength({ min: 2, max: 200 }).notEmpty().trim(),
        param('page').isInt({ min: 1 })
    ],    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      logger.warn(` Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`); // Registra erros de validação no arquivo específico
      return res.redirect('/erro-servidor'); // Redireciona para uma página de erro ou outra URL
    }
    cityController.cityDetail(req, res, next); // Caso os parâmetros sejam válidos, prossiga com o controlador
  }
);

router.get('/distancia-entre-:cityfrom-e-:cityto',
  [
      param('cityfrom').isString().isLength({ min: 2, max: 100 }).notEmpty().trim(),
      param('cityto').isString().isLength({ min: 2, max: 100 }).notEmpty().trim()
  ],    
  (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          logger.warn(`Validation error on route ${req.originalUrl}: ${JSON.stringify(errors.array())}`);
          return res.redirect('/erro-servidor');
      }
      cityController.cityDistance(req, res, next); // Controller para calcular a distância
  }
);

// URLs de Gerador de Sitemap
router.get('/sitemap-generate', sitemapController.generateSitemap);

export default router