const Article = require('../models/article.model');
const slugify = require('slugify');

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.log(error);
  }
};

const getArticleBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Article.findOne({ slug });
    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.log(error);
  }
};

const createArticle = async (req, res) => {
  const { title, body, category } = req.body;
  const { filename } = req.file;
  try {
    const article = new Article({
      title,
      body,
      category,
      slug: slugify(title, {
        lower: true,
        trim: true,
        remove: /[*+~.()'"!:@/]/g,
      }),
      coverImage: filename,
    });
    await article.save();

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getArticles,
  createArticle,
  getArticleBySlug,
};
