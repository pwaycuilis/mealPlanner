const app = require('../../../app');
const request = require('supertest');

const validMealId = '6244d9e0eaf3f1e9bdb88822';
const invalidMealId = '99999999999999999';

const validFdcId = '1102653'
const invalidFdcId = '110265'

describe('GET - meals/:mealid?', () => {
    test('no mealId entered -- status 200 and show full meal list', async () => {
        const response = await request(app).get('/api/foods/meals');
        expect(response.statusCode).toEqual(200);
    })

    test('valid mealId -- status 200 and show meal', async () => {
        const response = await(request(app).get(`/api/foods/meals/${validMealId}`));
        expect(response.statusCode).toEqual(200);
    })

    test('invalid mealId -- status 404 and err msg', async () => {
        const response = await(request(app).get(`/api/foods/meals/${invalidMealId}`));
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual({ message: "Cannot find meal(catch)"});
    })
})

describe('GET - searchById', () => {
    test('valid fdcId -- status 200 and display food info', async () => {
        const response = await request(app).get(`/api/foods/searchById/${validFdcId}`)
        expect(response.statusCode).toEqual(200);
    })

    test('invalid fdcId --  status 404 and error message', async () => {
        const response = await request(app).get(`/api/foods/searchById/${invalidFdcId}`);
        expect(response.statusCode).toEqual(404);
    })
})

describe('POST - addToNewMeal', () => {

    test('valid fdcId -- should respond status 201 and display meal', async () => {
        const response = await request(app).post('/api/foods/addToNewMeal/1102653');
        expect(response.statusCode).toEqual(201);
        //expect(response.body).toEqual({"success": true});
    });

    test('invalid fdcId -- should get status 404 and err msg', async () => {
        //const fdcId = 110265;
        const response = await request(app).post(`/api/foods/addToNewMeal/${invalidFdcId}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual({message: "invalid URL or fdcId"});
    });
});

describe('POST - addToMeal', () => {
    test('valid mealId -- should respond status 201 and display meal', async () => {
        const response = await request(app).post(`/api/foods/addToMeal/${validMealId}/1102653`);
        expect(response.statusCode).toEqual(201);
    });

    test('invalid mealId -- should get status 404 and err msg', async () => {
        const response = await request(app).post(`/api/foods/addToMeal/${invalidMealId}/1102653`);
        expect(response.statusCode).toEqual(404);
    });

    test('invalid fdcId -- status 404 and error msg', async () => {
        const response = await request(app).post(`/api/foods/addToMeal/${validMealId}/${invalidFdcId}`);
        expect(response.statusCode).toEqual(404);
    })
})

// describe('')