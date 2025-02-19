import { OpenAPIV3 } from "openapi-types";
import { taskStatuses } from "src/models/tasks/Tasks.model";
import { taskDetails } from "../addTask/tasks.addTask.docs";

const tasksUpdateTaskDocs: OpenAPIV3.PathItemObject = {
	patch: {
		summary: "API - Tasks - Update",
		description: "Returns Success Response.",
		tags: ["tasks"],
		parameters: [
			{
				name: "taskId",
				in: "path",
				required: true,
				schema: {
					type: "string",
				},
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							name: { type: "string" },
							description: { type: "string" },
							status: { type: "string", enum: taskStatuses },
							dueDate: {
								type: "string",
								format: "date",
							},
						},
						required: [],
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

export default tasksUpdateTaskDocs;
