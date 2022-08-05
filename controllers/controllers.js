const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectUsers,
  selectsArticles,
  selectAllCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/models");
const { checkTopicExists } = require("../db/seeds/utils");

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
  const { sort_by, order_by, topic } = req.query;

  Promise.all([
    checkTopicExists(topic),
    selectsArticles(sort_by, order_by, topic),
  ])
    .then((allArticles) => {
      res.status(200).send({ allArticles: allArticles[1] });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectAllCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then(([allComments]) => {
      res.status(200).send({ allComments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((res) => {
      return addCommentByArticleId(req.body, article_id);
    })
    .then(([addedComment]) => {
      res.status(201).send({ addedComment });
    })
    .catch(next);
};
