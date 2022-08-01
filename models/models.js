const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT users.username, 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.body, 
      articles.created_at, 
      articles.votes 
      FROM articles
        JOIN users
        ON articles.author = users.username
      WHERE article_id = $1;`,
      [article_id]
    )
    .then(({rows}) => {
        if (rows[0] === undefined) {
            return Promise.reject({code: 404, msg: "Article doesn't exist"})
          }
      return rows[0];
    });
};
