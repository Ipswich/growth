var express = require('express');
var router = express.Router();
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.get('/', async function(req, res, next) {
    var indexData = await utils.getIndexData(req).catch(() => {
        res.status(500).send("Database error, could not fetch environment data.")
    })
    res.status(200).send(indexData)
})

module.exports = router;