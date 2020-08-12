const encodings = require('../node_modules/iconv-lite/encodings');
const request = require('supertest')
const app = require('../app')
const db = require('../db');

beforeAll(() => {
    return db.connectDB();
});

afterAll(() => {
    return db.closeConnection();
});

describe('fetch-data endpoint', () => {
    it('Should response with success, on corect request', () => {
        return request(app)
            .post('/fetch-data')
            .send({
                startDate: '2016-10-20',
                endDate: '2016-11-20',
                minCount: 1000,
                maxCount: 2000,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.code).toEqual(0)
            });
    });

    it('In response array total count should be less or equal to minCound and more or equal to maxCount', () => {
        return request(app)
            .post('/fetch-data')
            .send({
                startDate: '2016-10-20',
                endDate: '2016-11-20',
                minCount: 1000,
                maxCount: 2000,
            })
            .then((res) => {
                res.body.records.forEach(record => {
                    expect(record.totalCount).toBeGreaterThan(1000);
                    expect(record.totalCount).toBeLessThanOrEqual(2000);
                });
            });
    });

    it('Should response with 400 and code 4, if request is not a json', () => {
        return request(app)
            .post('/fetch-data')
            .send(null)
            .then((res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.code).toEqual(4)
            });
    });

    it('Should response with 400 and code 4, if request json doesnt\'t have requested properties', () => {
        return request(app)
            .post('/fetch-data')
            .send({
                startDate: '2016-10-20',
                endDate: '2016-11-20',
                minCount: 1000,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.code).toEqual(4)
            });
    });

    it('Should response with 400 and code 4, if one of date property of request json contains wrong data', () => {
        return request(app)
            .post('/fetch-data')
            .send({
                startDate: '2016-10-20',
                endDate: null,
                minCount: 1000,
                maxCount: 2000,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.code).toEqual(4)
            });
    });

    
    it('Should response with 400 and code 4, if one of count property of request json contains wrong data', () => {
        return request(app)
            .post('/fetch-data')
            .send({
                startDate: '2016-10-20',
                endDate: '2016-11-20',
                minCount: null,
                maxCount: 2000,
            })
            .then((res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.code).toEqual(4)
            });
    });
})
