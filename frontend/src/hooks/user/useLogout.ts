import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../useStore";
import logoutApi from "src/apis/user/auth/logout.api";

/**
 * Custom hook to handle user logout.
 *
 * This hook performs the logout operation, clears user login information from the store,
 * and redirects the user to the login page.
 *
 * @returns A function that handles the logout process.
 */
function useLogout() {
	const navigate = useNavigate();
	const { dispatch } = useStore();

	/**
	 * Function to log out the user.
	 * It calls the logout API, clears the user's login information from the store,
	 * and redirects to the login page.
	 */
	const handleLogout = useCallback(() => {
		logoutApi().then(() => {
			dispatch("setStore", { loginInfo: null, loginInfoFetching: "error" });
			navigate("/login");
		});
	}, [navigate, dispatch]);

	return handleLogout;
}

export default useLogout;
