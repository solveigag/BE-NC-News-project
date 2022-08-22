const cors = require('cors')
const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  getArticles,
  getAllCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
  getApi
} = require("./controllers/controllers");
app.use(cors());
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.delete("/api/comments/:comment_id", deleteCommentByCommentId)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found!" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Invalid input data type" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required fields." });
} else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(err.code).send({ msg: err.msg });
  }
});



module.exports = app;
