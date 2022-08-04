const { all } = require("../app");
const db = require("../db/connection");
const {checkUsernameExists} = require("../db/seeds/utils")

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, users.username, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      JOIN users ON articles.author = users.username
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id, users.username;`,
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

exports.selectsArticles = () => {
  return db
    .query(
      `SELECT users.username, 
       articles.title, 
       articles.article_id,
       articles.topic,
       articles.created_at,
       articles.votes,
       COUNT(comments.article_id) AS comment_count
        FROM articles 
          JOIN users ON articles.author = users.username
     	    LEFT JOIN comments ON articles.article_id = comments.article_id 
     	  GROUP BY articles.article_id, users.username
       ORDER BY articles.created_at DESC;`
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.selectAllCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: allComments }) => {
      return allComments;
    });
};

exports.addCommentByArticleId = (newComment, article_id) => {
  const { username, body } = newComment;

 return checkUsernameExists(username).then((rows) => {
    return db.query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, article_id]
    )
  })   
    .then(({ rows: addedComment }) => {
      return addedComment;
    });
};
