import { OpenAPIV3 } from "openapi-types";
import { notificationTypesArray } from "src/models/users/UsersNotifications.model";

const userGetNotificationsDocs: OpenAPIV3.PathsObject = {
	"/user/get-notifications": {
		get: {
			summary: "API - User - Get Notifications",
			description: "Returns Success Response.",
			tags: ["user"],
			parameters: [
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
					description: "Returns Success Response with Notification Details.",
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
													properties: {
														notificationId: {
															type: "string",
														},
														taskId: {
															type: "string",
														},
														userId: {
															type: "string",
														},
														description: {
															type: "string",
														},
														type: {
															type: "string",
															enum: notificationTypesArray,
														},
														createdAt: {
															type: "string",
															format: "date-time",
														},
													},
													required: [
														"notificationId",
														"taskId",
														"userId",
														"description",
														"type",
														"createdAt",
													],
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
	},
};

export default userGetNotificationsDocs;
