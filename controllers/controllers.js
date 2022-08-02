const {selectTopics, selectArticleById} = require('../models/models');

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