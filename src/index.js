"use strict"

const express = require('express')
const path = require('path')

const router = express.Router()

const root = require("./api/root");
// const Card = require("./api/card");

router.use('/', root);
// router.use("/card", Card);

module.exports = router;