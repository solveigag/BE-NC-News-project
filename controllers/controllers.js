const {selectTopics, selectArticleById, updateArticleById} = require('../models/models');

exports.getTopics = (req, res, next) => {
    selectTopics().then((allTopics) => {
        res.status(200).send({allTopics})
    }).catch(next)
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    updateArticleById(req.body, article_id).then((updatedVotes) => {
        res.status(200).send({updatedArticle: updatedVotes})
    }).catch(next)
}