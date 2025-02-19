import { OpenAPIV3 } from "openapi-types";

const userAuthResetPasswordReqDocs: OpenAPIV3.PathsObject = {
	"/user/auth/request-reset-password": {
		post: {
			summary: "API - User - Request reset password",
			description: "Returns Success Response.",
			tags: ["user/auth"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
								},
							},
							required: ["email"],
						},
					},
				},
			},
			responses: {
				"200": {
					$ref: "#/components/responses/SuccessWithAuth",
				},
				"400": {
					$ref: "#/components/responses/400.BadRequest",
				},
			},
		},
	},
};

export default userAuthResetPasswordReqDocs;
