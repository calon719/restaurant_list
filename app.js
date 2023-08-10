const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;
const restaurants = require('./public/jsons/restaurant.json').results;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/restaurants');
});

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim().toLowerCase() : '';
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const values = Object.values(restaurant);
    const isMatched = values.some((value) => {
      let result = false;
      if (typeof value === 'string') {
        result = value.toLowerCase().includes(keyword);
      }

      return result;
    });

    return isMatched;
  });

  const isKeywordMatched = filteredRestaurants.length ? true : false;

  res.render('index', {
    restaurants: filteredRestaurants,
    keyword,
    isKeywordMatched,
  });
});

app.get('/restaurants/:id', (req, res) => {
  const id = Number(req.params.id);
  const restaurant = restaurants.find((item) => item.id === id);

  res.render('detail', { restaurant });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
