const express = require('express');
const replicateController = require('../controllers/replicateController');
const router = express.Router();

router.post('/create', replicateController.createNewPrompt);

module.exports = router;
