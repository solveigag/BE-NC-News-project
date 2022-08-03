const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectUsers,
  selectsArticles,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((allTopics) => {
      res.status(200).send({ allTopics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleById(req.body, article_id)
    .then((updatedVotes) => {
      res.status(200).send({ updatedArticle: updatedVotes });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((allUsers) => {
      res.status(200).send({ allUsers });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectsArticles()
    .then((allArticles) => {
      res.status(200).send({ allArticles });
    })
    .catch(next);
};
