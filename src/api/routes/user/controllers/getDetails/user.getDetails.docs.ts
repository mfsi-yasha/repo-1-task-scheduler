import { OpenAPIV3 } from "openapi-types";

const userGetDetailsDocs: OpenAPIV3.PathsObject = {
	"/user/": {
		get: {
			summary: "API - User - Get Details",
			description: "Returns Success Response.",
			tags: ["user"],
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

export default userGetDetailsDocs;
