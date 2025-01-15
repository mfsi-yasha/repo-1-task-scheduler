import { OpenAPIV3 } from "openapi-types";
import homeDocs from "./controllers/home.docs";
import userChangePasswordDocs from "./routes/user/controllers/changePassword/user.changePassword.docs";
import userAuthResetPasswordDocs from "./routes/user/routes/auth/controllers/resetPassword/user.auth.resetPassword.docs";
import userAuthloginDocs from "./routes/user/routes/auth/controllers/login/user.auth.login.docs";
import userAuthLogoutDocs from "./routes/user/routes/auth/controllers/logout/user.auth.logout.docs";
import userAuthSignupDocs from "./routes/user/routes/auth/controllers/signup/user.auth.signup.docs";
import userAuthVerifyUserDocs from "./routes/user/routes/auth/controllers/verifyUser/user.auth.verifyUser.docs";
import userAuthResendOTPDocs from "./routes/user/routes/auth/controllers/resendOTP/user.auth.resendOTP.docs";
import userAuthResetPasswordReqDocs from "./routes/user/routes/auth/controllers/requestResetPassword/user.auth.resetPasswordReq.docs";
import userGetDetailsDocs from "./routes/user/controllers/getDetails/user.getDetails.docs";

const apiDocs: OpenAPIV3.Document = {
	openapi: "3.0.3",
	info: {
		title: "Task Scheduler API",
		description: "Task Scheduler API Information",
		version: "1.0.0",
		contact: {
			name: "Mindfire Solutions",
			url: "https://www.mindfiresolutions.com/",
		},
	},
	servers: [
		{
			url: "http://localhost:8000/v1/api",
			description: "Local server",
		},
	],
	tags: [
		{
			name: "home",
			description: "API - Home",
		},
		{
			name: "user",
			description: "User APIs",
		},
		{
			name: "user/auth",
			description: "User Auth APIs",
		},
	],
	paths: {
		...homeDocs,
		...userGetDetailsDocs,
		...userChangePasswordDocs,
		...userAuthloginDocs,
		...userAuthLogoutDocs,
		...userAuthSignupDocs,
		...userAuthVerifyUserDocs,
		...userAuthResetPasswordReqDocs,
		...userAuthResendOTPDocs,
		...userAuthResetPasswordDocs,
	},
	components: {
		schemas: {
			"ResponseTypes.DataType": {
				type: "object",
				properties: {
					err: {
						type: "boolean",
					},
					statusName: {
						$ref: "#/components/schemas/ResponseTypes.StatusNames",
					},
					msg: {
						type: "string",
					},
					errors: {
						type: "array",
						items: {
							type: "string",
						},
					},
				},
			},
			"ResponseTypes.StatusNames": {
				type: "string",
				enum: [
					"success",
					"failure",
					"not-found",
					"already-exists",
					"validation-error",
					"value-not-allowed",
					"permission-denied",
					"forbidden",
				],
			},
			"Users.UserInstance": {
				type: "object",
				properties: {
					userId: {
						type: "string",
					},
					email: {
						type: "string",
					},
					userFullName: {
						type: "string",
					},
					verified: {
						type: "boolean",
					},
					createdAt: {
						type: "string",
						format: "date-time",
					},
					updatedAt: {
						type: "string",
						format: "date-time",
					},
				},
				required: [
					"id",
					"email",
					"userFullName",
					"verified",
					"createdAt",
					"updatedAt",
				],
			},
			"Users.ResponseDataWithUserInstance": {
				allOf: [
					{ $ref: "#/components/schemas/ResponseTypes.DataType" },
					{
						properties: {
							data: {
								type: "object",
								properties: {
									user: {
										$ref: "#/components/schemas/Users.UserInstance",
									},
								},
							},
						},
					},
				],
			},
		},
		responses: {
			Success: {
				description: "Returns Success Response.",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			SuccessWithAuth: {
				description: "Returns Success Response.",
				headers: {
					"Set-Cookie": {
						description:
							"APP developers need to store this header in their local store. And attach this as a request header in their all protected requests.",
						schema: {
							type: "string",
							example: "authToken=abcde12345; Path=/; HttpOnly",
						},
					},
				},
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			SuccessWithUserInstance: {
				description: "Returns Success Response with User Details.",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Users.ResponseDataWithUserInstance",
						},
					},
				},
			},
			SuccessWithAuthAndUserInstance: {
				description: "Returns Success Response with User Details.",
				headers: {
					"Set-Cookie": {
						description:
							"APP developers need to store this header in their local store. And attach this as a request header in their all protected requests.",
						schema: {
							type: "string",
							example: "authToken=abcde12345; Path=/; HttpOnly",
						},
					},
				},
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Users.ResponseDataWithUserInstance",
						},
					},
				},
			},
			"400.BadRequest": {
				description: "Bad Request",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
						example: {
							err: true,
							statusName: "validation-error",
							msg: "Bad Request",
							errors: ["Bad Request"],
						},
					},
				},
			},
			"401.Unauthorized": {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
						example: {
							err: true,
							statusName: "permission-denied",
							msg: "Unauthorized",
							errors: ["Unauthorized"],
						},
					},
				},
			},
			"403.Forbidden": {
				description: "Forbidden",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
						example: {
							err: true,
							statusName: "forbidden",
							msg: "Forbidden",
							errors: ["Forbidden"],
						},
					},
				},
			},
			"404.NotFound": {
				description: "Not Found",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			"413.PayloadTooLarge": {
				description: "Payload Too Large",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			"414.URITooLong": {
				description: "URI Too Long",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			"415.UnsupportedMediaType": {
				description: "Unsupported Media Type",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
			"500.InternalServerError": {
				description: "Internal Server Error",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ResponseTypes.DataType",
						},
					},
				},
			},
		},
	},
};

export default apiDocs;
