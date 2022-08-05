
const db = require("../db/connection");
const { checkUsernameExists} = require("../db/seeds/utils");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, articles.author, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
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

exports.selectsArticles = (sortBy = "created_at", orderBy = "DESC", topic) => {
  const validSortBys = [
    "author",
    "created_at",
    "title",
    "article_id",
    "topic",
    "votes",
    "comment_count",
  ];
  const validOrderBys = ["desc", "DESC", "asc", "ASC"];

  if (!validSortBys.includes(sortBy) || !validOrderBys.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  let queryArr = [];
  let queryStr = `SELECT articles.author, 
  articles.title, 
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  CAST(COUNT(comments.article_id)AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id`;

  if (topic) {
      queryStr += ` HAVING articles.topic = $1`;
      queryArr.push(topic);        
  }

  queryStr += ` ORDER BY ${sortBy} ${orderBy};`;

  return db.query(queryStr, queryArr).then(({ rows: articles }) => {
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

  return checkUsernameExists(username)
    .then((rows) => {
      return db.query(
        "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [body, username, article_id]
      );
    })
    .then(({ rows: addedComment }) => {
      return addedComment;
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows: [comment] }) => {
      if (comment === undefined) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      }
      return comment;
    });
};
