import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { GetUserDetailsI } from "../getUserDetails.api";

export interface LoginParams {
	email: string;
	password: string;
}

export default async function (params: LoginParams) {
	const { data: res } = await axiosJSON.post<ResponseDataType<GetUserDetailsI>>(
		"/user/auth/login",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
