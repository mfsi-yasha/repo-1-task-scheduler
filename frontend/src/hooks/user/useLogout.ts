import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../useStore";
import logoutApi from "src/apis/user/auth/logout.api";

function useLogout() {
	const navigate = useNavigate();
	const { dispatch } = useStore();

	const handleLogout = useCallback(() => {
		logoutApi().then(() => {
			dispatch("setStore", { loginInfo: null, loginInfoFetching: "error" });
			navigate("/login");
		});
	}, [navigate, dispatch]);

	return handleLogout;
}

export default useLogout;
