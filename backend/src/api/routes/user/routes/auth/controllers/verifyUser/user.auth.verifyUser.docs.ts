import { OpenAPIV3 } from "openapi-types";

const userAuthVerifyUserDocs: OpenAPIV3.PathsObject = {
	"/user/auth/verify-user": {
		post: {
			summary: "API - User - Verification",
			description: "Returns logged in user details.",
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
							},
							required: ["otp"],
						},
					},
				},
			},
			responses: {
				"201": {
					$ref: "#/components/responses/SuccessWithAuthAndUserInstance",
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

export default userAuthVerifyUserDocs;
