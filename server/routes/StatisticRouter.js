const router = require('express').Router();
const StatisticController = require('./../controllers/StatisticController');

router.route('/').get(StatisticController.handleCalculateStatistics);

module.exports = router;
