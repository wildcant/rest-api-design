const express = require('express');
const getConnetion = require('./config/dbConnection').getConnetion;
const app = express();

// Model
function getData(orderParam = 'id', direction = 'ASC', startIndex = 0) {
  return new Promise((resolve, reject) => {
    getConnetion(async (err, connection) => {
      if (err) reject(err);
      let response = {};
      connection.query('SELECT COUNT(*) FROM test.posts', (error, pages) => {
        if (error) reject(error);
        connection.query(`SELECT * FROM test.posts ORDER BY ${orderParam} ${direction} LIMIT ${startIndex},10`, (error, posts) => {
          if (error) reject(error);
          connection.release();
          response.posts = posts;
          response.numberOfPages = pages[0]['COUNT(*)'];
          resolve(response);
        }); 
      })
    })
  })
}
// Controller
const staticPaginatedData = async (req, res) => {
  const { page, sortBy, dir } = req.query;
  try {
    const currentPage = page == undefined ? 1 : page;
    const startIndex = (parseInt(currentPage) - 1) * 10;
    const response = await getData(sortBy, dir, startIndex);
    response.currentPage = currentPage;
    response.isLastPage = currentPage*10 == response.numberOfPages ? true : false;
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Route
app.get('/posts', staticPaginatedData)

app.listen(3001);