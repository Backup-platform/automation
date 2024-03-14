import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in/api';
test.describe.skip('example api tests', () => {

	test('Simple API Test - Assert response status', async ({ request }) => {
		const response = await request.get(`${baseURL}/users/2`);
		expect(response.status()).toBe(200);
	});

	test('Simple API Test - Assert Invalid Endpoint', async ({ request }) => {
		const response = await request.get(`${baseURL}/users/non-existing`);
		expect(response.status()).toBe(404);
	});

	test('Simple API Test - Get User Detail', async ({ request }) => {
		const response = await request.get(`${baseURL}/users/1`);
		const responseBody = JSON.parse(await response.text());

		expect(response.status()).toBe(200);
		expect(responseBody.data.id).toBe(1);
		expect(responseBody.data.first_name).toBe('George');
		expect(responseBody.data.last_name).toBe('Bluth');
	});

	test('Simple API Test - Create New User', async ({ request }) => {
		const response = await request.post(`${baseURL}/users`, {
			data: {
				id: 1000,
			}
		});
		const responseBody = JSON.parse(await response.text());

		expect(response.status()).toBe(201);
		expect(responseBody.id).toBe(1000);
		expect(responseBody.createdAt).toBeTruthy();
	});

});
