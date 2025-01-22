import { OpenAPIV3 } from "openapi-types";

const userAuthloginDocs: OpenAPIV3.PathsObject = {
	"/user/auth/login": {
		post: {
			summary: "API - User - Login",
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
								password: {
									type: "string",
								},
							},
							required: ["email", "password"],
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
			},
		},
	},
};

export default userAuthloginDocs;
