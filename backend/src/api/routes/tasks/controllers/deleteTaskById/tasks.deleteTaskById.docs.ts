import { OpenAPIV3 } from "openapi-types";

const tasksDeleteTaskByIdDocs: OpenAPIV3.PathItemObject = {
	delete: {
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
				$ref: "#/components/responses/Success",
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

export default tasksDeleteTaskByIdDocs;
