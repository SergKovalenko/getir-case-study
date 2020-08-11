const express = require('express');
const router = express.Router();
const Validator = require('jsonschema').Validator;
const dbModule = require('../db');

/* JSON SCHEMA validator for request json */
const v = new Validator();
const schema = {
    type: 'object',
    properties: {
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        minCount: { type: 'integer' },
        maxCount: { type: 'integer' },
    },
    required: ['startDate', 'endDate', 'minCount', 'maxCount'],
};
v.addSchema(schema, 'fetchJSON');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Getir-task' });
});

/* Fetch data from MongoDB 
     main action endpoint of APP */
router.post('/fetch-data', (req, res, next) => {
    const fetchRequest = req.body;
    const db = dbModule.getDB();

    // minCount and maxCount to number 
    fetchRequest.minCount = +(fetchRequest.minCount);
    fetchRequest.maxCount = +(fetchRequest.maxCount);

    const isJsonRequesValid = v.validate(fetchRequest, schema).valid

    if (!isJsonRequesValid) {
        return res.send({
            code: 400,
            msg: "Invalid data in request JSON",
            records,
        });
    }

    const collection = db.collection('records');

    // data aggregation pipeline to process documents for response json
    const aggregationPipeline = [
        { // $createdAt should be between startDate and endDate
            $match: {
                createdAt: {
                    $gte: new Date(fetchRequest.startDate),
                    $lte: new Date(fetchRequest.endDate),
                },
            }
        },
        { // prepare documents to response json format
          // add totalCount as sum of $counts array values 
            $project: {
                key: '$key',
                createdAt: '$createdAt',
                totalCount: { $sum: '$counts' },
            }
        },
        { // totalCount should be between minCount and maxCount
            $match: {
                totalCount: {
                    $gte: fetchRequest.minCount,
                    $lte: fetchRequest.maxCount,
                },
            }
        },
    ];

    const aggCursor = collection.aggregate(aggregationPipeline);

    return aggCursor.toArray()
        .then((records) => {
            res.send({
                code: 0,
                msg: "Success",
                records,
            });
        })
        .catch(err => console.log(err))
});

module.exports = router;
