import { Request, Response } from "express";
import validator from "validator";
import addTask from "./addTask";
import TasksModel from "src/models/tasks/Tasks.model";
import { ResponseDataType } from "src/globals/types";

// Mock the dependencies
jest.mock("src/models/tasks/Tasks.model", () => ({
	insertTask: jest.fn(),
}));

jest.mock("validator", () => ({
	isDate: jest.fn(),
}));

describe("Controller addTask", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	const mockInsertTask = TasksModel.insertTask as jest.Mock;
	const mockIsDate = validator.isDate as jest.Mock;

	beforeEach(() => {
		// Reset mocks before each test
		req = {
			body: {
				name: "Test Task",
				description: "Test Description",
				dueDate: "2025-03-01",
				cookiePayload: { userId: "user123" },
			},
		} as Partial<Request>;

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as Partial<Response>;

		mockInsertTask.mockReset();
		mockIsDate.mockReset();
	});

	it("should return a validation error when required fields are missing", async () => {
		req.body = { name: "", description: "", dueDate: "" };

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "invalid data.",
			errors: [
				"Key - name not given.",
				"Key - description not given.",
				"Key - dueDate is not date.",
			],
		};

		await addTask.controller(req as Request, res as Response);

		// Check that the response status and json were called with the validation error
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a success response when task is inserted successfully", async () => {
		const mockTask = {
			userId: "user123",
			name: "Test Task",
			description: "Test Description",
			dueDate: new Date("2025-03-01"),
			status: "toDo",
		};

		const mockResponse: ResponseDataType<typeof mockTask> = {
			err: false,
			statusName: "success",
			msg: "Task inserted.",
			data: mockTask,
			errors: [],
		};

		// Mock the insertTask function to return a mock task
		mockInsertTask.mockResolvedValue(mockTask);
		mockIsDate.mockReturnValue(true); // Mock the validator as valid date

		await addTask.controller(req as Request, res as Response);

		// Check that the response status and json were called with the expected success response
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(mockResponse);
	});

	it("should return a failure response if an error occurs", async () => {
		mockIsDate.mockReturnValue(true); // Mock the validator as valid date
		// Mock the insertTask method to reject with an error
		const mockError = new Error("Something went wrong");
		mockInsertTask.mockRejectedValue(mockError);

		// Define the expected error response that the controller should send
		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: ["Something went wrong"],
		};

		// Call the controller and await the result
		await addTask.controller(req as Request, res as Response);

		// Ensure the res.status and res.json were called with the expected error response
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse);
	});
});
