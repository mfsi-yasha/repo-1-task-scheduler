import { Request, Response } from "express";
import updateTaskController from "./updateTask";
import TasksModel from "src/models/tasks/Tasks.model";
import { ResponseDataType } from "src/globals/types";

// Mock the updateTask method
jest.mock("src/models/tasks/Tasks.model", () => ({
	updateTask: jest.fn(),
	// Mock the taskStatuses object
	taskStatuses: ["toDo"],
}));

describe("Controller updateTask", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	const mockUpdateTask = TasksModel.updateTask as jest.Mock;

	beforeEach(() => {
		// Reset mocks before each test
		req = {
			params: { taskId: "task123" },
			body: {
				cookiePayload: { userId: "user123" },
				name: "Updated Task",
				description: "Updated Description",
				dueDate: "2025-02-20",
				status: "toDo",
			},
		} as Partial<Request>;

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		} as Partial<Response>;

		mockUpdateTask.mockReset();
	});

	it("should return a validation error when the name is missing", async () => {
		req.body.name = "";

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "invalid data.",
			errors: ["Key - name not given."],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a validation error when the description is missing", async () => {
		req.body.description = "";

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "invalid data.",
			errors: ["Key - description not given."],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a validation error when the dueDate is not valid", async () => {
		req.body.dueDate = "invalid-date";

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "invalid data.",
			errors: ["Key - dueDate is not date."],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a validation error when the status is not valid", async () => {
		req.body.status = "invalid-status"; // Invalid status

		const expectedResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "invalid data.",
			errors: ["Key - status is not valid."],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a success response when the task is updated successfully", async () => {
		const mockUpdatedTask = {
			id: "task123",
			name: "Updated Task",
			description: "Updated Description",
			dueDate: new Date("2025-02-20"),
			status: "toDo",
		};

		// Mock the updateTask method to return a successful task update
		mockUpdateTask.mockResolvedValue(mockUpdatedTask);

		const expectedResponse: ResponseDataType<typeof mockUpdatedTask> = {
			err: false,
			statusName: "success",
			msg: "Task inserted.",
			data: mockUpdatedTask,
			errors: [],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(expectedResponse);
	});

	it("should return a failure response if an error occurs during task update", async () => {
		const mockError = new Error("Some unexpected error");

		// Mock the updateTask method to simulate an unexpected error
		mockUpdateTask.mockRejectedValue(mockError);

		const expectedErrorResponse: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: ["Some unexpected error"],
		};

		await updateTaskController.controller(req as any, res as Response);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(expectedErrorResponse);
	});
});
