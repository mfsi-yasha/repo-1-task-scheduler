import { OpenAPIV3 } from "openapi-types";
import { taskDetails } from "../addTask/tasks.addTask.docs";

const tasksGetTaskByIdDocs: OpenAPIV3.PathItemObject = {
	get: {
		summary: "API - Tasks - Add",
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

export default tasksGetTaskByIdDocs;
