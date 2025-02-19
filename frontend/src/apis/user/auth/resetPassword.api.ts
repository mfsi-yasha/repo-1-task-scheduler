import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export interface ResetPasswordParams {
	otp: string;
	newPassword: string;
}

export default async function (params: ResetPasswordParams) {
	const { data: res } = await axiosJSON.patch<ResponseDataType>(
		"/user/auth/reset-password",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
