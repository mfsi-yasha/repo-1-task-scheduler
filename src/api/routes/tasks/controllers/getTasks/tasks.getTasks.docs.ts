import { OpenAPIV3 } from "openapi-types";
import { taskDetails, taskDetailsEle } from "../addTask/tasks.addTask.docs";

const tasksGetTasksDocs: OpenAPIV3.PathItemObject = {
	get: {
		summary: "API - Tasks - Get tasks",
		description: "Returns Success Response.",
		tags: ["tasks"],
		parameters: [
			{
				name: "searchText",
				in: "query",
				required: false,
				schema: {
					type: "string",
					example: "example search",
				},
			},
			{
				name: "dueDateMin",
				in: "query",
				required: false,
				schema: {
					type: "string",
					format: "date",
					example: "2025-03-19",
				},
			},
			{
				name: "dueDateMax",
				in: "query",
				required: false,
				schema: {
					type: "string",
					format: "date",
					example: "2025-02-28",
				},
			},
			{
				name: "createdDateMin",
				in: "query",
				required: false,
				schema: {
					type: "string",
					format: "date",
					example: "2025-01-21",
				},
			},
			{
				name: "createdDateMax",
				in: "query",
				required: false,
				schema: {
					type: "string",
					format: "date",
					example: "2025-02-17",
				},
			},
			{
				name: "start",
				in: "query",
				required: false,
				schema: {
					type: "integer",
					example: 0,
				},
			},
			{
				name: "limit",
				in: "query",
				required: false,
				schema: {
					type: "integer",
					example: 10,
				},
			},
		],
		responses: {
			"200": {
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
										data: {
											type: "array",
											items: {
												type: "object",
												properties: taskDetailsEle,
											},
										},
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

export default tasksGetTasksDocs;
