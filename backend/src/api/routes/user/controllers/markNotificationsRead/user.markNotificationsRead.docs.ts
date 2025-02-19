import { OpenAPIV3 } from "openapi-types";

const userMarkNotificationsReadDocs: OpenAPIV3.PathsObject = {
	"/user/mark-notification-read": {
		post: {
			summary: "API - User - Mark Notification Read",
			description: "Returns Success Response.",
			tags: ["user"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								notificationId: {
									type: "string",
								},
							},
							required: ["notificationId"],
						},
					},
				},
			},
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
	},
};

export default userMarkNotificationsReadDocs;
