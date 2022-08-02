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
    .then(({ rows: [article] }) => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return article;
    });
};

exports.updateArticleById = (newVote, article_id) => {
  const { inc_votes } = newVote;
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows: [updated] }) => {
      if (updated === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return updated;
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  });
};
