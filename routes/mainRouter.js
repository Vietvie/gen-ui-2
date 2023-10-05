const express = require('express');
const genuiController = require('../controllers/genuiController');
const router = express.Router();

router.get('/layout/:name', genuiController.getOneLayout);
router.get('/layouts', genuiController.getAllLayouts);
router.post('/generate', genuiController.generateUi);
router.post('/delete', genuiController.deletePage);
router.post('/readlayout', genuiController.readLayout);

module.exports = router;
