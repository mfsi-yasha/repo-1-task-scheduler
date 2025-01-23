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
		"/verify-user",
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
					console.log(res);
					dispatch("setStore", {
						loginInfo: res,
						loginInfoFetching: "success",
					});
					if (authRouteInPathName(oldPathName)) {
						navigate("/");
					} else {
						navigate(oldPathName);
					}
				})
				.catch(() => {
					console.log("hi");
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
