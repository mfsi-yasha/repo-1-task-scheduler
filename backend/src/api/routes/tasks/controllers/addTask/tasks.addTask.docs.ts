import { OpenAPIV3 } from "openapi-types";
import { taskStatuses } from "src/models/tasks/Tasks.model";

export const taskDetailsEle: OpenAPIV3.SchemaObject["properties"] = {
	taskId: {
		type: "string",
		example: "12345",
	},
	userId: {
		type: "string",
		example: "67890",
	},
	name: {
		type: "string",
		example: "Task Name",
	},
	description: {
		type: "string",
		example: "Task description",
	},
	status: {
		type: "string",
		enum: taskStatuses,
		example: taskStatuses[0],
	},
	dueDate: {
		type: "string",
		format: "date-time",
		example: "2025-02-17T00:00:00Z",
	},
	deleted: {
		type: "boolean",
		example: false,
	},
	createdAt: {
		type: "string",
		format: "date-time",
		example: "2025-02-01T12:00:00Z",
	},
	updatedAt: {
		type: "string",
		format: "date-time",
		example: "2025-02-15T12:00:00Z",
	},
};

export const taskDetails: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: taskDetailsEle,
	required: [
		"taskId",
		"userId",
		"name",
		"description",
		"status",
		"dueDate",
		"deleted",
		"createdAt",
		"updatedAt",
	],
};

const tasksAddTaskDocs: OpenAPIV3.PathItemObject = {
	post: {
		summary: "API - Tasks - Add",
		description: "Returns Success Response.",
		tags: ["tasks"],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							name: { type: "string" },
							description: { type: "string" },
							dueDate: {
								type: "string",
								format: "date",
							},
						},
						required: ["name", "description", "dueDate"],
					},
				},
			},
		},
		responses: {
			"201": {
				description: "Returns Success Response with Task Details.",
				content: {
					"application/json": {
						schema: {
							allOf: [
								{
									$ref: "#/components/schemas/ResponseTypes.DataType",
								},
								{
									properties: {
										data: taskDetails,
									},
								},
							],
						},
					},
				},
			},
			"400": {
				$ref: "#/components/responses/400.BadRequest",
			},
			"403": {
				$ref: "#/components/responses/403.Forbidden",
			},
		},
	},
};

export default tasksAddTaskDocs;
