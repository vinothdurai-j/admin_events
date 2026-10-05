const express = require('express');

const adminRouter = require('../models/admin/router');
const userRouter = require('../models/user/router');
const eventRouter = require('../models/event/router');
const registrationRouter = require('../models/registration/router');

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/events', eventRouter);
router.use('/registrations', registrationRouter);

module.exports = router;
