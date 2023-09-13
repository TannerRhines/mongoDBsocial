const router = require('express').Router();
const apiRoutes = require('./api');

// Log apiRoutes to the console for debugging
// console.log(apiRoutes);

router.use('/api', apiRoutes);
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;