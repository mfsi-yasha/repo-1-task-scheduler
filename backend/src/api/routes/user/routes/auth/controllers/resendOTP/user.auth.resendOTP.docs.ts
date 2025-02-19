import { OpenAPIV3 } from "openapi-types";

const userAuthResendOTPDocs: OpenAPIV3.PathsObject = {
	"/user/auth/resend-otp/{scope}": {
		post: {
			summary: "API - User - Resend OTP.",
			description: "Returns Success Response.",
			tags: ["user/auth"],
			parameters: [
				{
					name: "scope",
					in: "path",
					required: true,
					schema: {
						type: "string",
						enum: ["signup", "reset-password"],
					},
				},
			],
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
				"404": {
					$ref: "#/components/responses/404.NotFound",
				},
			},
		},
	},
};

export default userAuthResendOTPDocs;
