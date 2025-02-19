import { useEffect } from "react";
import getUserDetailsApi from "src/apis/user/getUserDetails.api";
import { useStore } from "../useStore";
import { useNavigate } from "react-router";

/**
 * Helper function to check if the current route is an authentication route.
 *
 * This function checks if the provided pathname corresponds to any of the
 * authentication-related routes (login, signup, forgot-password, or reset-password).
 *
 * @param oldPathName The current pathname of the window.
 * @returns True if the route is an authentication route, false otherwise.
 */
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

/**
 * Custom hook to manage user profile state and authentication flow.
 *
 * This hook checks the user's login state on initial load. It fetches user details and handles
 * redirects based on whether the user is verified or not. If the user is not verified, they are
 * redirected to a verification page. Otherwise, they are redirected to the previously accessed route
 * or the home page.
 *
 * @returns The current store state.
 */
function useProfile() {
	const navigate = useNavigate();
	const { store, dispatch } = useStore();

	/**
	 * Fetches user details when login info is in a "pending" state.
	 * Upon successful fetching, it updates the store and navigates based on the user's verification status.
	 * If the fetch fails, it updates the store and redirects to an appropriate route (login or previous route).
	 */
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
