const express = require('express');
const router  = express.Router();
const { register, login, refresh, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refresh);
router.get('/me',        verifyToken, getMe);  // Protected

module.exports = router;