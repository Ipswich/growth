var express = require('express');
var router = express.Router();
const html_generators = require('../custom_node_modules/utility_modules/html_generators.js')

router.get('/', async function(req, res, next) {
    var indexData = await html_generators.getIndexData(res, req).catch(() => {
        res.status(500).send("Database error, could not fetch environment data.")
    })
    if(!res.headersSent){
        let returnData = {}
        returnData.schedules = indexData.schedules
        returnData.currentConditions = indexData.currentConditions
        res.status(200).send(returnData);  
    }
})

router.post('/', async function(req, res, next) {
    var indexData = await html_generators.getIndexData(res, req, req.body.interval).catch(() => {
        return res.status(500).send("Database error, could not fetch environment data.")
    })
    if(!res.headersSent){
        let returnData = {}
        returnData.schedules = indexData.schedules
        returnData.currentConditions = indexData.currentConditions
        returnData.authentication = indexData.authentication
        res.status(200).send(returnData);      
    }
})

module.exports = router;