var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res) {
  res.render('index', { title: 'Automata Made Easy' });
});
router.get('/designer', function(req, res) {
  res.render('designer', { title: 'Give your transitions' });
});

module.exports = router;
