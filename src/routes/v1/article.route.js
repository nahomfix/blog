const {
  getArticles,
  createArticle,
} = require('../../controllers/article.controller');

const router = require('express').Router();

router.get('/', getArticles);
router.post('/', createArticle);

module.exports = router;
