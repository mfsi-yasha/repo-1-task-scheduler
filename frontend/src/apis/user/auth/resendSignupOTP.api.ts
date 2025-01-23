import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export default async function () {
	const { data: res } = await axiosJSON.post<ResponseDataType>(
		"/user/auth/resend-otp/signup",
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
