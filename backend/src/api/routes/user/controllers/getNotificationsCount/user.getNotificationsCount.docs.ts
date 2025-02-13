import { OpenAPIV3 } from "openapi-types";

const userGetNotificationsCountDocs: OpenAPIV3.PathsObject = {
	"/user/get-notifications-count": {
		get: {
			summary: "API - User - Get Notifications Count",
			description: "Returns Success Response.",
			tags: ["user"],
			responses: {
				"200": {
					description: "Returns Success Response with Notification Count.",
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
												type: "number",
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

export default userGetNotificationsCountDocs;
