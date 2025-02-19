import { Request, Response } from "express";
import getTaskByIdController from "./getTaskById";
import TasksModel from "src/models/tasks/Tasks.model";
import { ResponseDataType } from "src/globals/types";

// Mock the getTaskById method
jest.mock("src/models/tasks/Tasks.model", () => ({
	getTaskById: jest.fn(),
}));

describe("Controller getTaskById", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	const mockGetTaskById = TasksModel.getTaskById as jest.Mock;

	beforeEach(() => {
		// Reset mocks before each test
		req = {
			params: { taskId: "task123" },
			body: { cookiePayload: { userId: "user123" } },
		} as Partial<Request>;

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as Partial<Response>;

		mockGetTaskById.mockReset();
	});

	it("should return a success response when task is found", async () => {
		const mockTask = {
			id: "task123",
			name: "Test Task",
			description: "Test Description",
		};

		// Mock the getTaskById method to return a mock task
		mockGetTaskById.mockResolvedValue(mockTask);

		const expectedResponse: ResponseDataType<typeof mockTask> = {
			err: false,
			statusName: "success",
			msg: "Task fetched.",
			data: mockTask,
			errors: [],
		};

		// Call the controller
		await getTaskByIdController.controller(req as any, res as Response);

		// Check that the response status and json were called with the success response
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a failure response when task is not found", async () => {
		const mockError = new Error("Task not found!");

		// Mock the getTaskById method to return null (task not found)
		mockGetTaskById.mockResolvedValue(null);

		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: ["Task not found!"],
		};

		// Call the controller
		await getTaskByIdController.controller(req as any, res as Response);

		// Check that the response status and json were called with the failure response
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse);
	});

	it("should return a failure response if an error occurs", async () => {
		const mockError = new Error("Some unexpected error");

		// Mock the getTaskById method to simulate an unexpected error
		mockGetTaskById.mockRejectedValue(mockError);

		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: ["Some unexpected error"],
		};

		// Call the controller
		await getTaskByIdController.controller(req as any, res as Response);

		// Check that the response status and json were called with the failure response
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse);
	});
});
