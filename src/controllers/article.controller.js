const Article = require('../models/article.model');

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

const createArticle = async (req, res) => {
  const { title, body } = req.body;
  try {
    const article = new Article({
      title,
      body,
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
};
