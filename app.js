const express = require('express');
const app = express();
const {getTopics, getArticleById, patchArticleById} = require('./controllers/controllers')

app.use(express.json()); 

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById)





app.use((err, req, res, next) => {
   if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
   } else if (err.status) {
     res.status(err.status).send({msg: err.msg})
   } else {    
    res.status(err.code).send({ msg: err.msg });
  } 
    
})

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found!" });
  });


module.exports = app;