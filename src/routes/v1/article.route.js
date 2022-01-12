const {
  getArticles,
  createArticle,
  getArticleBySlug,
} = require('../../controllers/article.controller');
const multer = require('multer');
const path = require('path');
const checkToken = require('../../middlewares/auth.middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});
const upload = multer({ storage });
const router = require('express').Router();

router.get('/', getArticles);
router.post('/', checkToken, upload.single('image'), createArticle);
router.get('/:slug', getArticleBySlug);

module.exports = router;
