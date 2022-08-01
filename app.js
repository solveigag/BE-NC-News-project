const express = require('express');
const app = express();
const {getTopics} = require('./controllers/controllers')

app.use(express.json()); 

app.get('/api/topics', getTopics);


app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found! Please check path." });
  });


module.exports = app;