const app = require('../../../app');
const request = require('supertest');

describe('POST - addToNewMeal', () => {

    test('valid id -- should respond status 201 and display meal', async () => {
        const response = await request(app).post('/api/foods/addToNewMeal/1102653');
        expect(response.statusCode).toEqual(201);
        //expect(response.body).toEqual({"success": true});
    });

    test('invalid id -- should get status 404 and err msg', async () => {
        const fdcId = 110265;
        const response = await request(app).post(`/api/foods/addToNewMeal/${fdcId}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual({"error": `fdcId ${fdcId} not found`})
    });
});