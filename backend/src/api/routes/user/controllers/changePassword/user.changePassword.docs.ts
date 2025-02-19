import { OpenAPIV3 } from "openapi-types";

const userChangePasswordDocs: OpenAPIV3.PathsObject = {
	"/user/change-password": {
		patch: {
			summary: "API - Change Password Request",
			description: "Returns Success Response.",
			tags: ["user"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								oldPassword: {
									type: "string",
								},
								newPassword: {
									type: "string",
								},
							},
							required: ["oldPassword", "newPassword"],
						},
					},
				},
			},
			responses: {
				"200": {
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

export default userChangePasswordDocs;
