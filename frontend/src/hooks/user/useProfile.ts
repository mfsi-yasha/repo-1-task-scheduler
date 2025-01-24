import { useEffect } from "react";
import getUserDetailsApi from "src/apis/user/getUserDetails.api";
import { useStore } from "../useStore";
import { useNavigate } from "react-router";

const authRouteInPathName = (oldPathName: string) => {
	const authRoutes = [
		"/login",
		"/signup",
		"/forgot-password",
		"/reset-password",
	].join("::");

	return authRoutes.includes(oldPathName.split("/")[1]) &&
		oldPathName.split("/")[1]
		? true
		: false;
};

function useProfile() {
	const navigate = useNavigate();
	const { store, dispatch } = useStore();

	useEffect(() => {
		if (store.loginInfoFetching === "pending") {
			const oldPathName = window.location.pathname;
			getUserDetailsApi()
				.then(res => {
					dispatch("setStore", {
						loginInfo: res,
						loginInfoFetching: "success",
					});
					if (res.user.verified) {
						if (authRouteInPathName(oldPathName)) {
							navigate("/");
						} else {
							navigate(oldPathName);
						}
					} else {
						navigate("/verify-user");
					}
				})
				.catch(() => {
					dispatch("setStore", {
						loginInfo: null,
						loginInfoFetching: "error",
					});
					console.log(oldPathName);
					if (authRouteInPathName(oldPathName)) {
						navigate(oldPathName);
					} else {
						navigate("/login");
					}
				});
		}
	}, [store]);

	return { store };
}

export default useProfile;
