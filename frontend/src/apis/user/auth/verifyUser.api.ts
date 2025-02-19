import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { GetUserDetailsI } from "../getUserDetails.api";

export interface VerifyuserParams {
	otp: string;
}

export default async function (params: VerifyuserParams) {
	const { data: res } = await axiosJSON.post<ResponseDataType<GetUserDetailsI>>(
		"/user/auth/verify-user",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
