const {selectTopics} = require('../models/models');

exports.getTopics = (req, res, next) => {
    selectTopics().then((allTopics) => {
        res.status(200).send({allTopics})
    }).catch(next)
}