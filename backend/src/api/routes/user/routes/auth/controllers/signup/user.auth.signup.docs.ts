import { OpenAPIV3 } from "openapi-types";
const userAuthSignupDocs: OpenAPIV3.PathsObject = {
	"/user/auth/signup": {
		post: {
			summary: "API - User - Signup",
			description: "Returns signedup user details.",
			tags: ["user/auth"],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								userFullName: { type: "string" },
								email: { type: "string" },
								password: { type: "string" },
							},
							required: ["userFullName", "email", "password"],
						},
					},
				},
			},
			responses: {
				"201": {
					$ref: "#/components/responses/SuccessWithAuthAndUserInstance",
				},
				"400": { $ref: "#/components/responses/400.BadRequest" },
			},
		},
	},
};
export default userAuthSignupDocs;
