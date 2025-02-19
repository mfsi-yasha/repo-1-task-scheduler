import { OpenAPIV3 } from "openapi-types";

const homeDocs: OpenAPIV3.PathsObject = {
	"/": {
		get: {
			summary: "API - Home",
			tags: ["home"],
			description: "API - Home - Shows that API is working.",
			responses: {
				"200": {
					$ref: "#/components/responses/Success",
				},
			},
		},
	},
};

export default homeDocs;
