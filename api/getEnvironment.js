var express = require('express');
var router = express.Router();
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.get('/', async function(req, res, next) {
    var indexData = await utils.getIndexData(req).catch(() => {
        res.status(500).send("Database error, could not fetch environment data.")
    })
    let returnData = {}
    returnData.msg = "Sensor event successfully added!"
    returnData.schedules = indexData.schedules
    returnData.currentConditions = indexData.currentConditions
    res.status(200).send(returnData);  
})

router.post('/', async function(req, res, next) {
    var indexData = await utils.getIndexData(req, req.body.interval).catch(() => {
        res.status(500).send("Database error, could not fetch environment data.")
    })
    let returnData = {}
    returnData.msg = "Sensor event successfully added!"
    returnData.schedules = indexData.schedules
    returnData.currentConditions = indexData.currentConditions
    res.status(200).send(returnData);  
})

module.exports = router;