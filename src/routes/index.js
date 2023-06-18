import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.app.get('db'));
  res.json({hello: "hello"});
});

export default router;
