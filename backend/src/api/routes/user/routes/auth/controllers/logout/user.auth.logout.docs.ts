import { OpenAPIV3 } from "openapi-types";

const userAuthLogoutDocs: OpenAPIV3.PathsObject = {
	"/user/auth/logout": {
		post: {
			summary: "API - User - Logout",
			description: "Returns Success Response.",
			tags: ["user/auth"],
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

export default userAuthLogoutDocs;
