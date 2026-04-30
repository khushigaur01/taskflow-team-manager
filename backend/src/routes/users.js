const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll } = require('../controllers/userController');
router.get('/', auth, getAll);
module.exports = router;