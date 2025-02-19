import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { GetUserDetailsI } from "../getUserDetails.api";

export interface SignupParams {
	email: string;
	userFullName: string;
	password: string;
}

export default async function (params: SignupParams) {
	const { data: res } = await axiosJSON.post<ResponseDataType<GetUserDetailsI>>(
		"/user/auth/signup",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
