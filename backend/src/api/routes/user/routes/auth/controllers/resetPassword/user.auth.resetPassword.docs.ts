import { OpenAPIV3 } from "openapi-types";

const userAuthResetPasswordDocs: OpenAPIV3.PathsObject = {
	"/user/auth/reset-password": {
		patch: {
			summary: "API - Reset Password",
			description: "Returns Success Response.",
			tags: ["user/auth"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								otp: {
									type: "string",
								},
								newPassword: {
									type: "string",
								},
							},
							required: ["otp", "newPassword"],
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

export default userAuthResetPasswordDocs;
