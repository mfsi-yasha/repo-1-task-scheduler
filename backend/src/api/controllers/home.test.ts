import { Request, Response } from "express";
import home from "./home";
import { RequestType, ResponseDataType } from "src/globals/types";

// Mock the Response object to intercept the response methods
jest.mock("express", () => ({
	...jest.requireActual("express"),
	Request: jest.fn(),
	Response: jest.fn().mockImplementation(() => ({
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
	})),
}));

describe("Home Controller", () => {
	let req: Partial<Request>; // Use Partial<Request> to represent mock Request object
	let res: Partial<Response>; // Use Partial<Response> to represent mock Response object

	beforeEach(() => {
		// Create a mock of req and res for each test
		req = {} as Partial<Request>;
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as Partial<Response>;
	});

	it("should return a success response with a message", async () => {
		const expectedResponse: ResponseDataType<undefined> = {
			err: false,
			msg: "Working",
			statusName: "success",
			errors: [],
		};

		// Call the home function
		await home.controller(
			req as RequestType<{}, {}, undefined>,
			res as Response,
		);

		// Validate that res.status(200) was called
		expect(res.status).toHaveBeenCalledWith(200);

		// Validate that res.json was called with the expected response object
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});
});
