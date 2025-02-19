import { Request, Response } from "express";
import deleteTaskById from "./deleteTaskById";
import TasksModel from "src/models/tasks/Tasks.model";
import { ResponseDataType } from "src/globals/types";

// Mock the deleteTaskById method
jest.mock("src/models/tasks/Tasks.model", () => ({
	deleteTaskById: jest.fn(),
}));

describe("Controller deleteTaskById", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	const mockDeleteTaskById = TasksModel.deleteTaskById as jest.Mock;

	beforeEach(() => {
		// Reset mocks before each test
		req = {
			params: { taskId: "task123" },
			body: {},
		} as Partial<Request>;

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as Partial<Response>;

		mockDeleteTaskById.mockReset();
	});

	it("should return a success response when the task is deleted successfully", async () => {
		// Mock the deleteTaskById method to simulate successful deletion
		mockDeleteTaskById.mockResolvedValue(undefined);

		const expectedResponse: ResponseDataType = {
			err: false,
			statusName: "success",
			msg: "Task deleted.",
			errors: [],
		};

		// Call the controller
		await deleteTaskById.controller(req as any, res as Response);

		// Check that the response status and json were called with the success response
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a failure response if an error occurs during task deletion", async () => {
		const mockError = new Error("Something went wrong");

		// Mock the deleteTaskById method to simulate an error
		mockDeleteTaskById.mockRejectedValue(mockError);

		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: ["Something went wrong"],
		};

		// Call the controller
		await deleteTaskById.controller(req as any, res as Response);

		// Check that the response status and json were called with the failure response
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse);
	});
});
