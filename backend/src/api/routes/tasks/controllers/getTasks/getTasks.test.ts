import { Request, Response } from "express";
import getTasks from "./getTasks";
import TasksModel from "src/models/tasks/Tasks.model";
import { ResponseDataType } from "src/globals/types";

// Mock TasksModel methods
jest.mock("src/models/tasks/Tasks.model");

describe("Controller getTasks", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			body: {
				cookiePayload: {
					userId: "user123", // Mock userId
				},
			},
			query: {},
		};

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should return a validation error when filters are invalid", async () => {
		const mockErrors = ["Invalid filter: status"];
		TasksModel.validateFilters = jest.fn().mockReturnValue(mockErrors); // Mock invalid filters

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Filters may be not valid.",
			errors: mockErrors,
		};

		await getTasks.controller(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(400); // Check if status is 400
		expect(res.json).toHaveBeenCalledWith(expectedResponse); // Check the response
	});

	it("should return tasks when filters are valid", async () => {
		const mockTasks = [
			{ id: "task1", name: "Task 1" },
			{ id: "task2", name: "Task 2" },
		];
		TasksModel.validateFilters = jest.fn().mockReturnValue([]); // No errors
		TasksModel.getAllTasks = jest.fn().mockResolvedValue(mockTasks); // Mock valid tasks

		const expectedResponse: ResponseDataType<typeof mockTasks> = {
			err: false,
			statusName: "success",
			msg: "Tasks fetched.",
			data: mockTasks,
			errors: [],
		};

		await getTasks.controller(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(200); // Check if status is 200
		expect(res.json).toHaveBeenCalledWith(expectedResponse); // Check if response is correct
	});

	it("should return a failure response if an error occurs", async () => {
		const mockError = new Error("Database error");
		TasksModel.validateFilters = jest.fn().mockReturnValue([]); // No errors
		TasksModel.getAllTasks = jest.fn().mockRejectedValue(mockError); // Mock an error

		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Filters may be wrong.",
			errors: [mockError.message],
		};

		await getTasks.controller(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(400); // Check if status is 400
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse); // Check the response error message
	});
});
