const { Signup } = require('./auth/signup');
const { Login } = require('./auth/login');
const { Verify } = require('./auth/verify');
const { Get_Graph } = require('./graph/get_graph');
const { Update_Graph } = require('./graph/update_graph');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/signup', Signup);

router.post('/login', Login);

router.post('/verify', Verify);

router.get('/get_graph', Get_Graph);

router.post('/update_graph', Update_Graph);

module.exports = router;
